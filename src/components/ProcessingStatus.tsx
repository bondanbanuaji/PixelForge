'use client';

import { CheckCircle, XCircle, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProcessingStore } from '@/stores/processing';

export function ProcessingStatus() {
    const { currentOperation } = useProcessingStore();

    if (!currentOperation) return null;

    const statusConfig = {
        idle: { color: 'text-gray-400', bg: 'glass-card', label: 'Ready' },
        uploading: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Uploading...' },
        processing: { color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', label: 'Processing...' },
        completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Completed!' },
        failed: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Failed' },
    };

    const config = statusConfig[currentOperation.status];

    return (
        <div className={cn('rounded-2xl p-6 border transition-all duration-300', config.bg.includes('glass') ? config.bg : `border ${config.bg.split(' ')[1] || 'border-white/10'} ${config.bg.split(' ')[0]}`)}>
            <div className="flex items-center gap-4">
                {/* Status Icon */}
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-sm shadow-inner')}>
                    {currentOperation.status === 'completed' && (
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                    )}
                    {currentOperation.status === 'failed' && (
                        <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    {(currentOperation.status === 'uploading' || currentOperation.status === 'processing') && (
                        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                    )}
                </div>

                {/* Status Info */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <span className={cn('font-medium text-lg', config.color)}>{config.label}</span>
                        <span className="text-sm text-gray-400 font-mono">{currentOperation.progress}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <div
                            className={cn(
                                'h-full rounded-full transition-all duration-300 relative overflow-hidden',
                                currentOperation.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' :
                                    currentOperation.status === 'failed' ? 'bg-red-500' :
                                        'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                            )}
                            style={{ width: `${currentOperation.progress}%` }}
                        >
                            {/* Animated shimmer on progress bar */}
                            {(currentOperation.status === 'uploading' || currentOperation.status === 'processing') && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full animate-[shimmer_1.5s_infinite] -translate-x-full" />
                            )}
                        </div>
                    </div>

                    {/* Status Message */}
                    {currentOperation.status === 'processing' && (
                        <p className="text-sm text-indigo-300/80 mt-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            {currentOperation.operationType === 'upscale'
                                ? 'Applying AI enhancement models...'
                                : 'Resizing and optimizing image...'}
                        </p>
                    )}

                    {currentOperation.status === 'failed' && currentOperation.error && (
                        <p className="text-sm text-red-400 mt-2">{currentOperation.error}</p>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            {currentOperation.status === 'completed' && currentOperation.processedUrl && (
                <div className="mt-4 space-y-3">
                    {/* File Info */}
                    {currentOperation.processedSize && currentOperation.processedResolution && (
                        <div className="flex items-center justify-between text-sm text-gray-400 bg-black/40 border border-white/5 rounded-lg px-4 py-3">
                            <span className="flex items-center gap-2">
                                <Wand2 className="w-4 h-4 text-indigo-400" />
                                {currentOperation.processedResolution.width} × {currentOperation.processedResolution.height}
                            </span>
                            <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">
                                {(currentOperation.processedSize / 1024 / 1024).toFixed(2)} MB
                            </span>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <a
                            href={currentOperation.processedUrl}
                            download={`${currentOperation.fileName.replace(/\.[^/.]+$/, '')}_processed.${currentOperation.processedUrl.split('.').pop() || 'jpg'}`}
                            className="flex-1 btn bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all"
                        >
                            Download Result
                        </a>
                        <button
                            onClick={() => window.open(currentOperation.processedUrl, '_blank')}
                            className="btn bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                        >
                            Preview
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
