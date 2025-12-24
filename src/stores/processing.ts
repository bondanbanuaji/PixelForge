import { create } from 'zustand';

export type OperationType = 'upscale' | 'downscale';
export type ScaleFactor = 2 | 4 | 8;
export type QualityMode = 'fast' | 'balanced' | 'quality';
export type Algorithm = 'lanczos3' | 'mitchell' | 'cubic' | 'realesrgan';
export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export interface ImageOperation {
    id: string;
    fileName: string;
    originalSize: number;
    processedSize?: number;
    originalResolution: { width: number; height: number };
    processedResolution?: { width: number; height: number };
    operationType: OperationType;
    scaleFactor: ScaleFactor;
    algorithm: Algorithm;
    qualityMode: QualityMode;
    status: ProcessingStatus;
    progress: number;
    errorMessage?: string;
    originalUrl?: string;
    processedUrl?: string;
    processingTime?: number;
    createdAt: Date;
    completedAt?: Date;
}

export interface ProcessingConfig {
    operationType: OperationType;
    scaleFactor: ScaleFactor;
    qualityMode: QualityMode;
    algorithm: Algorithm;
}

interface ProcessingState {
    // Current operation
    currentFile: File | null;
    currentOperation: ImageOperation | null;
    config: ProcessingConfig;

    // History
    operations: ImageOperation[];

    // Stats
    totalProcessed: number;
    storageUsed: number;

    // Actions
    setCurrentFile: (file: File | null) => void;
    setConfig: (config: Partial<ProcessingConfig>) => void;
    startOperation: (operation: ImageOperation) => void;
    updateOperation: (id: string, updates: Partial<ImageOperation>) => void;
    completeOperation: (id: string, processedUrl: string, processedSize: number, processedResolution: { width: number; height: number }) => void;
    failOperation: (id: string, errorMessage: string) => void;
    clearCurrentOperation: () => void;
    addToHistory: (operation: ImageOperation) => void;
    removeFromHistory: (id: string) => void;
    clearHistory: () => void;
}

export const useProcessingStore = create<ProcessingState>((set, get) => ({
    // Initial state
    currentFile: null,
    currentOperation: null,
    config: {
        operationType: 'upscale',
        scaleFactor: 2,
        qualityMode: 'balanced',
        algorithm: 'realesrgan',
    },
    operations: [],
    totalProcessed: 0,
    storageUsed: 0,

    // Actions
    setCurrentFile: (file) => set({ currentFile: file }),

    setConfig: (newConfig) => set((state) => ({
        config: { ...state.config, ...newConfig }
    })),

    startOperation: (operation) => set({ currentOperation: operation }),

    updateOperation: (id, updates) => set((state) => ({
        currentOperation: state.currentOperation?.id === id
            ? { ...state.currentOperation, ...updates }
            : state.currentOperation,
        operations: state.operations.map(op =>
            op.id === id ? { ...op, ...updates } : op
        )
    })),

    completeOperation: (id, processedUrl, processedSize, processedResolution) => {
        const state = get();
        const operation = state.currentOperation?.id === id
            ? state.currentOperation
            : state.operations.find(op => op.id === id);

        if (operation) {
            const completedOp: ImageOperation = {
                ...operation,
                status: 'completed',
                progress: 100,
                processedUrl,
                processedSize,
                processedResolution,
                completedAt: new Date(),
                processingTime: Date.now() - operation.createdAt.getTime(),
            };

            set((state) => ({
                currentOperation: state.currentOperation?.id === id ? completedOp : state.currentOperation,
                operations: [completedOp, ...state.operations.filter(op => op.id !== id)],
                totalProcessed: state.totalProcessed + 1,
                storageUsed: state.storageUsed + processedSize,
            }));
        }
    },

    failOperation: (id, errorMessage) => set((state) => ({
        currentOperation: state.currentOperation?.id === id
            ? { ...state.currentOperation, status: 'failed', errorMessage, progress: 0 }
            : state.currentOperation,
        operations: state.operations.map(op =>
            op.id === id ? { ...op, status: 'failed', errorMessage, progress: 0 } : op
        )
    })),

    clearCurrentOperation: () => set({ currentOperation: null, currentFile: null }),

    addToHistory: (operation) => set((state) => ({
        operations: [operation, ...state.operations]
    })),

    removeFromHistory: (id) => set((state) => ({
        operations: state.operations.filter(op => op.id !== id)
    })),

    clearHistory: () => set({ operations: [], totalProcessed: 0, storageUsed: 0 }),
}));
