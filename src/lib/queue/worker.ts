import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { Worker, Job } from 'bullmq';
import { redisConfig } from './config';
import { JobData, IMAGE_PROCESSING_QUEUE } from './imageQueue';
import { db } from '@/lib/db';
import { imageOperations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { realESRGAN } from '@/lib/services/realesrgan';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

console.log('Starting worker for queue:', IMAGE_PROCESSING_QUEUE);

const worker = new Worker<JobData>(IMAGE_PROCESSING_QUEUE, async (job: Job<JobData>) => {
    console.log(`Processing job ${job.id}: ${job.data.operationId}`);

    const { operationId, filePaths, config, metadata } = job.data;

    try {
        await db.update(imageOperations)
            .set({ status: 'processing', startedAt: new Date(), progress: 0 } as any)
            .where(eq(imageOperations.id, operationId));

        await job.updateProgress(5);

        const inputPath = filePaths.original;
        const outputPath = filePaths.processed;

        try {
            await fs.access(inputPath);
        } catch {
            throw new Error(`Input file not found: ${inputPath}`);
        }

        let processedBuffer: Buffer;
        let finalWidth: number;
        let finalHeight: number;

        if (config.operationType === 'downscale') {
            const scale = config.scaleFactor;
            finalWidth = Math.round(metadata.width / scale);
            finalHeight = Math.round(metadata.height / scale);

            await job.updateProgress(20);

            processedBuffer = await sharp(inputPath, { failOn: 'none' })
                .resize(finalWidth, finalHeight, {
                    kernel: (config.algorithm as any) || 'lanczos3',
                    withoutEnlargement: true
                })
                .toBuffer();

            const qualityMap: Record<string, number> = { fast: 70, balanced: 85, quality: 95 };
            const quality = qualityMap[config.qualityMode || 'balanced'];

            await job.updateProgress(60);

            const sharpInstance = sharp(processedBuffer);
            if (metadata.fileExtension === 'png') {
                await sharpInstance.png({ compressionLevel: 6, effort: 3 }).toFile(outputPath);
            } else if (metadata.fileExtension === 'webp') {
                await sharpInstance.webp({ quality, effort: 3 }).toFile(outputPath);
            } else {
                await sharpInstance.jpeg({ quality, mozjpeg: true }).toFile(outputPath);
            }

        } else {
            const scale = config.scaleFactor as 2 | 4 | 8;
            finalWidth = metadata.width * scale;
            finalHeight = metadata.height * scale;

            await job.updateProgress(10);

            const supportedScales = [2, 3, 4];
            if (supportedScales.includes(scale) && await realESRGAN.isAvailable()) {
                await realESRGAN.upscale({
                    inputPath,
                    outputPath,
                    scale: scale as 2 | 3 | 4,
                    format: (metadata.fileExtension as any) === 'png' ? 'png' : 'jpg'
                }, async (percent) => {
                    const scaledProgress = 10 + Math.round(percent * 0.8);
                    await job.updateProgress(scaledProgress);
                    await db.update(imageOperations)
                        .set({ progress: scaledProgress } as any)
                        .where(eq(imageOperations.id, operationId));
                });
            } else {
                processedBuffer = await sharp(inputPath, { failOn: 'none' })
                    .resize(finalWidth, finalHeight, {
                        kernel: 'lanczos3',
                        fit: 'fill'
                    })
                    .toBuffer();

                const qualityMap: Record<string, number> = { fast: 70, balanced: 85, quality: 95 };
                const quality = qualityMap[config.qualityMode || 'balanced'];

                const sharpInstance = sharp(processedBuffer);
                if (metadata.fileExtension === 'png') {
                    await sharpInstance.png({ compressionLevel: 6, effort: 3 }).toFile(outputPath);
                } else if (metadata.fileExtension === 'webp') {
                    await sharpInstance.webp({ quality, effort: 3 }).toFile(outputPath);
                } else {
                    await sharpInstance.jpeg({ quality, mozjpeg: true }).toFile(outputPath);
                }
            }
        }

        await job.updateProgress(95);

        const finalMetadata = await sharp(outputPath).metadata();
        const duration = Date.now() - job.timestamp;

        await db.update(imageOperations)
            .set({
                status: 'completed',
                completedAt: new Date(),
                processedSizeBytes: finalMetadata.size,
                processingTimeMs: duration,
                progress: 100
            } as any)
            .where(eq(imageOperations.id, operationId));

        await job.updateProgress(100);
        console.log(`Job ${job.id} completed`);

    } catch (error: any) {
        console.error(`Job ${job.id} failed:`, error);
        await db.update(imageOperations)
            .set({
                status: 'failed',
                errorMessage: error.message,
                completedAt: new Date()
            })
            .where(eq(imageOperations.id, operationId));
        throw error;
    }
}, {
    connection: redisConfig,
    concurrency: 5 // Process up to 5 images in parallel
});

worker.on('completed', job => {
    console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
});
