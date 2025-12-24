import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { db } from '@/lib/db';
// We don't import imageOperations here directly to avoid circular deps if extended later, 
// but for now execution logic is separate.

export type RealESRGANModel = 'realesrgan-x4plus' | 'realesrgan-x4plus-anime' | 'realesr-animevideov3';

interface UpscaleOptions {
    inputPath: string;
    outputPath: string;
    model?: RealESRGANModel;
    scale?: 2 | 3 | 4; // Binary supports these, though our UI might restrict to 2/4/8
    format?: 'jpg' | 'png' | 'webp';
}

export class RealESRGANService {
    private binaryPath: string;
    private modelsPath: string;

    constructor() {
        // Defaults to environment variable or looking in bin folder
        this.binaryPath = process.env.REALESRGAN_PATH || path.join(process.cwd(), 'bin', 'realesrgan-ncnn-vulkan');
        this.modelsPath = path.dirname(this.binaryPath); // Models usually sit next to binary
    }

    async isAvailable(): Promise<boolean> {
        try {
            await fs.promises.access(this.binaryPath, fs.constants.X_OK);
            return true;
        } catch {
            return false;
        }
    }

    async upscale({ inputPath, outputPath, model = 'realesrgan-x4plus', scale = 4, format = 'jpg' }: UpscaleOptions): Promise<void> {
        const isAvailable = await this.isAvailable();
        if (!isAvailable) {
            throw new Error(`Real-ESRGAN binary not found or not executable at: ${this.binaryPath}`);
        }

        return new Promise((resolve, reject) => {
            const args = [
                '-i', inputPath,
                '-o', outputPath,
                '-n', model,
                '-s', scale.toString(),
                '-f', format
            ];

            // If GPU ID is specified in env, add it
            if (process.env.REALESRGAN_GPU_ID) {
                args.push('-g', process.env.REALESRGAN_GPU_ID);
            }

            console.log('Spawning Real-ESRGAN:', this.binaryPath, args.join(' '));

            const child = spawn(this.binaryPath, args);

            let stderr = '';

            child.stderr.on('data', (data) => {
                const output = data.toString();
                stderr += output;
                // Optional: Parse progress from stderr "23.45%"
            });

            child.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Real-ESRGAN process failed with code ${code}: ${stderr}`));
                }
            });

            child.on('error', (err) => {
                reject(new Error(`Failed to spawn Real-ESRGAN process: ${err.message}`));
            });

            // Timeout after 5 minutes
            const timeout = setTimeout(() => {
                child.kill();
                reject(new Error('Real-ESRGAN process timed out after 5 minutes'));
            }, 5 * 60 * 1000);

            child.on('close', () => clearTimeout(timeout));
        });
    }
}

export const realESRGAN = new RealESRGANService();
