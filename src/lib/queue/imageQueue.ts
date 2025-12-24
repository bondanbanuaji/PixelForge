import { Queue } from 'bullmq';
import { redisConfig } from './config';

export const IMAGE_PROCESSING_QUEUE = 'image-processing';

export const imageQueue = new Queue(IMAGE_PROCESSING_QUEUE, {
    connection: redisConfig,
});

export type JobData = {
    operationId: string;
    userId: string;
    filePaths: {
        original: string;
        processed: string;
    };
    config: {
        operationType: 'upscale' | 'downscale';
        scaleFactor: 2 | 4 | 8;
        algorithm?: string;
        qualityMode?: 'fast' | 'balanced' | 'quality';
    };
    metadata: {
        width: number;
        height: number;
        size: number;
        fileExtension: string;
    };
};
