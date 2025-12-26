import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(img.src);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

export function generateId() {
    return uuidv4();
}

export function calculateNewDimensions(width: number, height: number, scale: number, type: 'upscale' | 'downscale') {
    if (type === 'upscale') {
        return { width: width * scale, height: height * scale };
    }
    return { width: Math.round(width / scale), height: Math.round(height / scale) };
}

export function estimateProcessingTime(width: number, height: number, scale: number, type: 'upscale' | 'downscale') {
    const pixels = width * height;
    const isUpscale = type === 'upscale';
    const baseTime = (pixels / 1000000) * (isUpscale ? 2 : 0.5);
    const factorTime = baseTime * (scale / 2);
    return Math.max(0.5, parseFloat(factorTime.toFixed(1)));
}
