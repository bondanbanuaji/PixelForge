import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatResolution(width: number, height: number) {
    return `${width}x${height}`;
}

export function calculateNewDimensions(
    width: number,
    height: number,
    scaleFactor: number,
    operation: 'upscale' | 'downscale'
) {
    const factor = operation === 'upscale' ? scaleFactor : 1 / scaleFactor;
    return {
        width: Math.round(width * factor),
        height: Math.round(height * factor),
    };
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

export function generateId() {
    return crypto.randomUUID();
}

export function estimateProcessingTime(
    width: number,
    height: number,
    scaleFactor: number,
    operation: 'upscale' | 'downscale'
): number {
    const pixels = width * height;
    if (operation === 'downscale') {
        // Downscaling is fast, ~1-2 seconds
        return Math.max(1, Math.ceil(pixels / 5000000));
    } else {
        // Upscaling with AI takes longer
        const basetime = Math.ceil(pixels / 500000) * scaleFactor;
        return Math.max(5, basetime);
    }
}
