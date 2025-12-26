'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Sparkles,
    Image as ImageIcon,
    Clock,
    HardDrive,
    ArrowLeft,
    Settings,
    History,
    Zap,
    Download
} from 'lucide-react';
import { ImageUploadZone } from '@/components/upload/ImageUploadZone';
import { ConfigPanel, ProcessingStatus, UserButton } from '@/components';
import { useProcessingStore } from '@/stores/processing';
import { formatBytes, generateId } from '@/lib/utils';
import { AnimatedButton } from '@/components/ui/AnimatedButton';

export default function DashboardPage() {
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [serverOperationId, setServerOperationId] = useState<string | null>(null);

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

    useEffect(() => {
        if (currentFile) {
            const img = new Image();
            img.onload = () => {
                setDimensions({ width: img.width, height: img.height });
            };
            img.src = URL.createObjectURL(currentFile);
        } else {
            setDimensions(null);
        }
    }, [currentFile]);


    // Polling function to check processing status
    const pollStatus = useCallback(async (opId: string, localOpId: string) => {
        try {
            const response = await fetch(`/api/queue/status?id=${opId}`);
            if (!response.ok) {
                throw new Error('Failed to check status');
            }

            const data = await response.json();

            // Update progress
            updateOperation(localOpId, { progress: data.progress });

            if (data.status === 'completed' && data.processedUrl) {
                // Parse resolution if available
                let processedResolution = { width: 0, height: 0 };
                if (data.resolutionResult) {
                    const [width, height] = data.resolutionResult.split('x').map(Number);
                    processedResolution = { width, height };
                }

                completeOperation(
                    localOpId,
                    data.processedUrl,
                    data.processedSize || 0,
                    processedResolution
                );
                setServerOperationId(null);
                setIsProcessing(false);
                return true; // Stop polling
            } else if (data.status === 'failed') {
                failOperation(localOpId, data.error || 'Processing failed');
                setServerOperationId(null);
                setIsProcessing(false);
                return true; // Stop polling
            }

            return false; // Continue polling
        } catch (error) {
            console.error('Polling error:', error);
            return false; // Continue polling on error
        }
    }, [updateOperation, completeOperation, failOperation]);

    // Effect to handle polling
    useEffect(() => {
        if (!serverOperationId || !currentOperation) return;

        const intervalId = setInterval(async () => {
            const shouldStop = await pollStatus(serverOperationId, currentOperation.id);
            if (shouldStop) {
                clearInterval(intervalId);
            }
        }, 2000); // Poll every 2 seconds

        return () => clearInterval(intervalId);
    }, [serverOperationId, currentOperation, pollStatus]);

    const handleProcess = async () => {
        if (!currentFile || !dimensions) return;

        setIsProcessing(true);

        // Create local operation for UI
        const localOperationId = generateId();
        startOperation({
            id: localOperationId,
            fileName: currentFile.name,
            originalSize: currentFile.size,
            originalResolution: dimensions,
            operationType: config.operationType,
            scaleFactor: config.scaleFactor,
            algorithm: config.algorithm,
            qualityMode: config.qualityMode,
            status: 'uploading',
            progress: 0,
            createdAt: new Date(),
        });

        try {
            const formData = new FormData();
            formData.append('file', currentFile);
            formData.append('config', JSON.stringify(config));

            // Update to uploading status
            updateOperation(localOperationId, { status: 'uploading', progress: 10 });

            const response = await fetch('/api/process', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Processing failed');
            }

            const result = await response.json();

            // Update to processing status and start polling
            updateOperation(localOperationId, {
                status: 'processing',
                progress: 20
            });

            // Set server operation ID to start polling
            setServerOperationId(result.operationId);

        } catch (error) {
            failOperation(localOperationId, error instanceof Error ? error.message : 'Unknown error');
            setIsProcessing(false);
        }
    };


    const canProcess = currentFile && dimensions && !isProcessing;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-6">
                            <Link
                                href="/"
                                className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Back</span>
                            </Link>

                            <div className="h-6 w-px bg-white/10" />

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-white">PixelForge</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard/history"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                            >
                                <History className="w-4 h-4" />
                                <span className="hidden sm:inline font-medium">History</span>
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                                <span className="hidden sm:inline font-medium">Settings</span>
                            </Link>
                            <div className="h-6 w-px bg-white/10 mx-2" />
                            <UserButton />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Total Processed', value: totalProcessed.toString(), icon: ImageIcon, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                        { label: 'Storage Used', value: formatBytes(storageUsed), icon: HardDrive, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                        { label: 'Recent', value: operations.length.toString(), icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        { label: 'Queue', value: currentOperation ? '1' : '0', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    ].map((stat, index) => (
                        <div key={index} className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-white/20 transition-colors">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                                <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upload Zone */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-sm border border-indigo-500/30">1</span>
                                <h2 className="text-xl font-bold">Upload Image</h2>
                            </div>
                            <ImageUploadZone />
                        </div>

                        {/* Processing Status */}
                        {currentOperation && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-sm border border-indigo-500/30">3</span>
                                    <h2 className="text-xl font-bold">Processing Status</h2>
                                </div>
                                <ProcessingStatus />
                            </div>
                        )}

                        {/* Process Button */}
                        {currentFile && !currentOperation && (
                            <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-sm border border-indigo-500/30">3</span>
                                    <h2 className="text-xl font-bold">Start Processing</h2>
                                </div>
                                <AnimatedButton
                                    onClick={handleProcess}
                                    disabled={!canProcess}
                                    className="w-full text-lg py-5"
                                    glow
                                >
                                    <Sparkles className="w-5 h-5" />
                                    {config.operationType === 'upscale' ? 'Enhance Image' : 'Resize Image'}
                                </AnimatedButton>
                            </div>
                        )}

                        {/* New Image Button after completion */}
                        {currentOperation?.status === 'completed' && (
                            <div className="pt-4">
                                <button
                                    onClick={clearCurrentOperation}
                                    className="w-full py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-all flex items-center justify-center gap-2"
                                >
                                    <ImageIcon className="w-5 h-5" />
                                    Process Another Image
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Config */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-sm border border-indigo-500/30">2</span>
                            <h2 className="text-xl font-bold">Configuration</h2>
                        </div>
                        <ConfigPanel dimensions={dimensions} />
                    </div>
                </div>

                {/* Recent Operations */}
                {operations.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Clock className="w-5 h-5 text-indigo-400" />
                                Recent Operations
                            </h2>
                            <Link href="/dashboard/history" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                                View all
                            </Link>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {operations.slice(0, 6).map((op) => (
                                <div key={op.id} className="glass-card rounded-xl overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
                                    <figure className="h-48 bg-black/40 relative overflow-hidden">
                                        {op.processedUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={op.processedUrl}
                                                alt={op.fileName}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                <ImageIcon className="w-10 h-10 opacity-20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </figure>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${op.operationType === 'upscale' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-purple-500/20 text-purple-300'}`}>
                                                {op.operationType} {op.scaleFactor}x
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${op.status === 'completed' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                                                }`}>
                                                {op.status}
                                            </span>
                                        </div>
                                        <h3 className="font-medium text-white truncate mb-4">{op.fileName}</h3>

                                        {op.processedUrl && (
                                            <a
                                                href={op.processedUrl}
                                                download={`processed_${op.fileName}`}
                                                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-medium transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
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
