'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    SparklesIcon,
    PhotoIcon,
    ClockIcon,
    ServerStackIcon,
    ArrowLeftIcon,
    Cog6ToothIcon,
    FolderIcon
} from '@heroicons/react/24/outline';
import { UploadZone, ConfigPanel, ProcessingStatus, UserButton } from '@/components';
import { useProcessingStore } from '@/stores/processing';
import { formatBytes, generateId } from '@/lib/utils';

export default function DashboardPage() {
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const {
        currentFile,
        currentOperation,
        config,
        operations,
        totalProcessed,
        storageUsed,
        startOperation,
        updateOperation,
        completeOperation,
        failOperation,
        clearCurrentOperation,
    } = useProcessingStore();

    const handleFileSelect = (file: File, dims: { width: number; height: number }) => {
        setDimensions(dims);
    };

    const handleProcess = async () => {
        if (!currentFile || !dimensions) return;

        setIsProcessing(true);

        // Create operation
        const operationId = generateId();
        startOperation({
            id: operationId,
            fileName: currentFile.name,
            originalSize: currentFile.size,
            originalResolution: dimensions,
            operationType: config.operationType,
            scaleFactor: config.scaleFactor,
            algorithm: config.algorithm,
            qualityMode: config.qualityMode,
            status: 'processing',
            progress: 0,
            createdAt: new Date(),
        });

        // Simulate progress updates
        const progressInterval = setInterval(() => {
            updateOperation(operationId, {
                progress: Math.min(90, (useProcessingStore.getState().currentOperation?.progress || 0) + 10)
            });
        }, 500);

        try {
            const formData = new FormData();
            formData.append('file', currentFile);
            formData.append('config', JSON.stringify(config));

            const response = await fetch('/api/process', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Processing failed');
            }

            const result = await response.json();

            completeOperation(
                operationId,
                result.processedUrl,
                result.processedSize,
                result.processedResolution
            );

        } catch (error) {
            clearInterval(progressInterval);
            failOperation(operationId, error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setIsProcessing(false);
        }
    };

    const canProcess = currentFile && dimensions && !isProcessing;

    return (
        <div className="min-h-screen bg-base-100">
            {/* Header */}
            <header className="glass sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="btn btn-ghost btn-sm gap-2">
                                <ArrowLeftIcon className="w-4 h-4" />
                                Back
                            </Link>
                            <div className="hidden sm:flex items-center gap-2">
                                <SparklesIcon className="w-6 h-6 text-primary-500" />
                                <span className="font-bold">PixelForge</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/history" className="btn btn-ghost btn-sm gap-2">
                                <FolderIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">History</span>
                            </Link>
                            <Link href="/dashboard/settings" className="btn btn-ghost btn-sm gap-2">
                                <Cog6ToothIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Settings</span>
                            </Link>
                            <div className="divider divider-horizontal m-0" />
                            <UserButton />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Processed', value: totalProcessed.toString(), icon: PhotoIcon, color: 'text-primary-400' },
                        { label: 'Storage Used', value: formatBytes(storageUsed), icon: ServerStackIcon, color: 'text-accent-400' },
                        { label: 'Recent', value: operations.length.toString(), icon: ClockIcon, color: 'text-emerald-400' },
                        { label: 'Queue', value: currentOperation ? '1' : '0', icon: ServerStackIcon, color: 'text-amber-400' },
                    ].map((stat, index) => (
                        <div key={index} className="bg-base-200 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-base-300 flex items-center justify-center">
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-sm text-slate-400">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upload Zone */}
                        <div>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <PhotoIcon className="w-5 h-5 text-primary-400" />
                                Upload Image
                            </h2>
                            <UploadZone onFileSelect={handleFileSelect} />
                        </div>

                        {/* Processing Status */}
                        {currentOperation && (
                            <div>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <SparklesIcon className="w-5 h-5 text-primary-400" />
                                    Processing Status
                                </h2>
                                <ProcessingStatus />
                            </div>
                        )}

                        {/* Process Button */}
                        {currentFile && !currentOperation && (
                            <button
                                onClick={handleProcess}
                                disabled={!canProcess}
                                className="btn btn-primary btn-lg w-full gap-2 glow"
                            >
                                <SparklesIcon className="w-5 h-5" />
                                {config.operationType === 'upscale' ? 'Upscale Image' : 'Downscale Image'}
                            </button>
                        )}

                        {/* New Image Button after completion */}
                        {currentOperation?.status === 'completed' && (
                            <button
                                onClick={clearCurrentOperation}
                                className="btn btn-outline btn-lg w-full gap-2"
                            >
                                <PhotoIcon className="w-5 h-5" />
                                Process Another Image
                            </button>
                        )}
                    </div>

                    {/* Sidebar - Config */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Cog6ToothIcon className="w-5 h-5 text-primary-400" />
                            Configuration
                        </h2>
                        <ConfigPanel dimensions={dimensions} />
                    </div>
                </div>

                {/* Recent Operations */}
                {operations.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-primary-400" />
                            Recent Operations
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {operations.slice(0, 6).map((op) => (
                                <div key={op.id} className="card bg-base-200 card-hover">
                                    <figure className="h-40 bg-base-300">
                                        {op.processedUrl && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={op.processedUrl}
                                                alt={op.fileName}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </figure>
                                    <div className="card-body p-4">
                                        <h3 className="font-medium truncate">{op.fileName}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`badge badge-sm ${op.operationType === 'upscale' ? 'badge-primary' : 'badge-secondary'}`}>
                                                {op.operationType} {op.scaleFactor}x
                                            </span>
                                            <span className={`badge badge-sm ${op.status === 'completed' ? 'badge-success' : 'badge-error'}`}>
                                                {op.status}
                                            </span>
                                        </div>
                                        {op.processedUrl && (
                                            <a
                                                href={op.processedUrl}
                                                download={`processed_${op.fileName}`}
                                                className="btn btn-sm btn-primary mt-2"
                                            >
                                                Download
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
