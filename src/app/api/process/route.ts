import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Types
type Algorithm = 'lanczos3' | 'mitchell' | 'cubic';
type OperationType = 'upscale' | 'downscale';
type ScaleFactor = 2 | 4 | 8;

interface ProcessingRequest {
    operationType: OperationType;
    scaleFactor: ScaleFactor;
    algorithm?: Algorithm;
    qualityMode?: 'fast' | 'balanced' | 'quality';
}

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const PROCESSED_DIR = path.join(process.cwd(), 'public', 'processed');

async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(PROCESSED_DIR)) {
        await mkdir(PROCESSED_DIR, { recursive: true });
    }
}

// Sharp kernel mapping
type SharpKernel = 'nearest' | 'cubic' | 'mitchell' | 'lanczos2' | 'lanczos3';

function getSharpKernel(algorithm: Algorithm): SharpKernel {
    const kernels: Record<Algorithm, SharpKernel> = {
        lanczos3: 'lanczos3',
        mitchell: 'mitchell',
        cubic: 'cubic',
    };
    return kernels[algorithm] || 'lanczos3';
}

export async function POST(request: NextRequest) {
    try {
        await ensureDirectories();

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const configRaw = formData.get('config') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Parse config
        let config: ProcessingRequest;
        try {
            config = JSON.parse(configRaw);
        } catch {
            return NextResponse.json({ error: 'Invalid config' }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Supported: JPG, PNG, WebP' },
                { status: 400 }
            );
        }

        // Validate file size (50MB max)
        if (file.size > 50 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File too large. Maximum size: 50MB' },
                { status: 400 }
            );
        }

        const operationId = uuidv4();
        const fileExtension = path.extname(file.name) || '.jpg';
        const originalFileName = `${operationId}_original${fileExtension}`;
        const processedFileName = `${operationId}_processed${fileExtension}`;

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save original file
        const originalPath = path.join(UPLOAD_DIR, originalFileName);
        await writeFile(originalPath, buffer);

        // Get original image metadata
        const metadata = await sharp(buffer).metadata();
        const originalWidth = metadata.width || 0;
        const originalHeight = metadata.height || 0;

        // Calculate new dimensions
        let newWidth: number;
        let newHeight: number;

        if (config.operationType === 'upscale') {
            newWidth = originalWidth * config.scaleFactor;
            newHeight = originalHeight * config.scaleFactor;
        } else {
            newWidth = Math.round(originalWidth / config.scaleFactor);
            newHeight = Math.round(originalHeight / config.scaleFactor);
        }

        // Process image
        const startTime = Date.now();
        let processedBuffer: Buffer;

        if (config.operationType === 'downscale') {
            // Use Sharp for downscaling
            const kernel = getSharpKernel(config.algorithm || 'lanczos3');
            processedBuffer = await sharp(buffer)
                .resize(newWidth, newHeight, {
                    kernel,
                    withoutEnlargement: true,
                })
                .toBuffer();
        } else {
            // For upscaling, use Sharp resize (Real-ESRGAN would be used in production)
            // Sharp upscaling as fallback
            processedBuffer = await sharp(buffer)
                .resize(newWidth, newHeight, {
                    kernel: 'lanczos3',
                    fit: 'fill',
                })
                .toBuffer();
        }

        // Get quality setting
        const qualityMap = { fast: 70, balanced: 85, quality: 95 };
        const quality = qualityMap[config.qualityMode || 'balanced'];

        // Save processed file with quality optimization
        const processedPath = path.join(PROCESSED_DIR, processedFileName);

        if (file.type === 'image/jpeg' || fileExtension === '.jpg' || fileExtension === '.jpeg') {
            await sharp(processedBuffer)
                .jpeg({ quality })
                .toFile(processedPath);
        } else if (file.type === 'image/png') {
            await sharp(processedBuffer)
                .png({ compressionLevel: config.qualityMode === 'quality' ? 9 : 6 })
                .toFile(processedPath);
        } else {
            await sharp(processedBuffer)
                .webp({ quality })
                .toFile(processedPath);
        }

        const processingTime = Date.now() - startTime;

        // Get processed file size
        const processedMetadata = await sharp(processedPath).metadata();

        // Clean up original file (optional, keep for history)
        // await unlink(originalPath);

        return NextResponse.json({
            success: true,
            operationId,
            originalUrl: `/uploads/${originalFileName}`,
            processedUrl: `/processed/${processedFileName}`,
            originalResolution: { width: originalWidth, height: originalHeight },
            processedResolution: { width: newWidth, height: newHeight },
            originalSize: file.size,
            processedSize: processedMetadata.size || 0,
            processingTime,
        });

    } catch (error) {
        console.error('Processing error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Processing failed' },
            { status: 500 }
        );
    }
}
