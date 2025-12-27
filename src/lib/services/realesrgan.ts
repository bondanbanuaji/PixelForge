import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
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
    private available: boolean | null = null;

    constructor() {
        this.binaryPath = process.env.REALESRGAN_PATH || path.join(process.cwd(), 'bin', 'realesrgan-ncnn-vulkan');
        this.modelsPath = path.dirname(this.binaryPath);
    }

    async isAvailable(): Promise<boolean> {
        if (this.available !== null) return this.available;
        try {
            await fs.promises.access(this.binaryPath, fs.constants.X_OK);
            this.available = true;
            return true;
        } catch {
            this.available = false;
            return false;
        }
    }

    async upscale({
        inputPath,
        outputPath,
        model = 'realesrgan-x4plus',
        scale = 4,
        format = 'jpg'
    }: UpscaleOptions, onProgress?: (percent: number) => void): Promise<void> {
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
                '-f', format,
                '-t', '400' // Use tiling to prevent OOM on GPUs with low VRAM
            ];

            if (process.env.REALESRGAN_GPU_ID) {
                args.push('-g', process.env.REALESRGAN_GPU_ID);
            }

            const child = spawn(this.binaryPath, args);
            let stderr = '';

            child.stderr.on('data', (data) => {
                const output = data.toString();
                stderr += output;

                // Parse progress from stderr e.g. "23.45%"
                const progressMatch = output.match(/(\d+\.\d+)%/);
                if (progressMatch && onProgress) {
                    onProgress(parseFloat(progressMatch[1]));
                }
            });

            child.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Real-ESRGAN failed (${code}): ${stderr}`));
                }
            });

            child.on('error', (err) => {
                reject(new Error(`Spawn failed: ${err.message}`));
            });

            const timeout = setTimeout(() => {
                child.kill();
                reject(new Error('Process timed out (5m)'));
            }, 5 * 60 * 1000);

            child.on('close', () => clearTimeout(timeout));
        });
    }
}

export const realESRGAN = new RealESRGANService();

