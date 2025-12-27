import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OperationType = 'upscale' | 'downscale';
export type ScaleFactor = 2 | 4 | 8;
export type Algorithm = 'realesrgan' | 'lanczos3' | 'mitchell' | 'cubic';
export type QualityMode = 'fast' | 'balanced' | 'quality';
export type OperationStatus = 'uploading' | 'processing' | 'completed' | 'failed';

export interface ImageOperation {
    id: string;
    fileName: string;
    originalSize: number;
    originalResolution: { width: number; height: number };
    operationType: OperationType;
    scaleFactor: ScaleFactor;
    algorithm: Algorithm;
    qualityMode: QualityMode;
    status: OperationStatus;
    progress: number;
    createdAt: Date | string;
    processedUrl?: string;
    processedSize?: number;
    processedResolution?: { width: number; height: number };
    error?: string;
}

export interface ProcessingConfig {
    operationType: OperationType;
    scaleFactor: ScaleFactor;
    algorithm: Algorithm;
    qualityMode: QualityMode;
}

interface ProcessingState {
    // Current State
    currentFile: File | null;
    currentOperation: ImageOperation | null;
    config: ProcessingConfig;

    // History & Stats
    operations: ImageOperation[];
    totalProcessed: number;
    storageUsed: number;

    // Actions
    setCurrentFile: (file: File | null) => void;
    setConfig: (config: Partial<ProcessingConfig>) => void;
    startOperation: (operation: ImageOperation) => void;
    updateOperation: (id: string, updates: Partial<ImageOperation>) => void;
    completeOperation: (id: string, url: string, size: number, resolution: { width: number; height: number }) => void;
    failOperation: (id: string, error: string) => void;
    clearCurrentOperation: () => void;
    removeFromHistory: (id: string) => void;
    clearHistory: () => void;
}

export const useProcessingStore = create<ProcessingState>()(
    persist(
        (set) => ({
            currentFile: null,
            currentOperation: null,
            config: {
                operationType: 'upscale',
                scaleFactor: 4,
                algorithm: 'realesrgan',
                qualityMode: 'balanced',
            },
            operations: [],
            totalProcessed: 0,
            storageUsed: 0,

            setCurrentFile: (file) => set({ currentFile: file }),

            setConfig: (newConfig) => set((state) => ({ config: { ...state.config, ...newConfig } })),

            startOperation: (operation) => set({ currentOperation: operation }),

            updateOperation: (id, updates) => set((state) => {
                const updatedOp = state.currentOperation?.id === id
                    ? { ...state.currentOperation, ...updates }
                    : state.currentOperation;

                return { currentOperation: updatedOp };
            }),

            completeOperation: (id, url, size, resolution) => set((state) => {
                if (!state.currentOperation || state.currentOperation.id !== id) return state;

                const completedOp: ImageOperation = {
                    ...state.currentOperation,
                    status: 'completed',
                    progress: 100,
                    processedUrl: url,
                    processedSize: size,
                    processedResolution: resolution,
                };

                // Filter out any existing operation with the same ID to prevent duplicates
                const otherOps = state.operations.filter(op => op.id !== id);
                const wasAlreadyInHistory = otherOps.length < state.operations.length;

                return {
                    currentOperation: completedOp,
                    operations: [completedOp, ...otherOps],
                    totalProcessed: wasAlreadyInHistory ? state.totalProcessed : state.totalProcessed + 1,
                    storageUsed: wasAlreadyInHistory ? state.storageUsed : state.storageUsed + size,
                };
            }),

            failOperation: (id, error) => set((state) => {
                if (!state.currentOperation || state.currentOperation.id !== id) return state;

                const failedOp: ImageOperation = {
                    ...state.currentOperation,
                    status: 'failed',
                    error,
                };

                // Filter out any existing operation with the same ID to prevent duplicates
                const otherOps = state.operations.filter(op => op.id !== id);

                return {
                    currentOperation: failedOp,
                    operations: [failedOp, ...otherOps],
                };
            }),

            clearCurrentOperation: () => set({ currentOperation: null, currentFile: null }),

            removeFromHistory: (id) => set((state) => ({
                operations: state.operations.filter(op => op.id !== id)
            })),

            clearHistory: () => set({ operations: [], totalProcessed: 0, storageUsed: 0 }),
        }),
        {
            name: 'pixelforge-storage',
            partialize: (state) => ({
                config: state.config,
                operations: state.operations,
                totalProcessed: state.totalProcessed,
                storageUsed: state.storageUsed
            }),
        }
    )
);
