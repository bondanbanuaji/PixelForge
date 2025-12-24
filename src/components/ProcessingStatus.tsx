'use client';

import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useProcessingStore } from '@/stores/processing';

export function ProcessingStatus() {
    const { currentOperation } = useProcessingStore();

    if (!currentOperation) return null;

    const statusConfig = {
        idle: { color: 'text-slate-400', bg: 'bg-slate-800', label: 'Ready' },
        uploading: { color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Uploading...' },
        processing: { color: 'text-primary-400', bg: 'bg-primary-500/10', label: 'Processing...' },
        completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Completed!' },
        failed: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Failed' },
    };

    const config = statusConfig[currentOperation.status];

    return (
        <div className={cn('rounded-2xl p-6', config.bg)}>
            <div className="flex items-center gap-4">
                {/* Status Icon */}
                <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', config.bg)}>
                    {currentOperation.status === 'completed' && (
                        <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
                    )}
                    {currentOperation.status === 'failed' && (
                        <XCircleIcon className="w-8 h-8 text-red-400" />
                    )}
                    {(currentOperation.status === 'uploading' || currentOperation.status === 'processing') && (
                        <div className="spinner w-8 h-8" />
                    )}
                    {currentOperation.status === 'idle' && (
                        <ClockIcon className="w-8 h-8 text-slate-400" />
                    )}
                </div>

                {/* Status Info */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <span className={cn('font-medium', config.color)}>{config.label}</span>
                        <span className="text-sm text-slate-400">{currentOperation.progress}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-base-300 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                'h-full rounded-full transition-all duration-300',
                                currentOperation.status === 'completed' ? 'bg-emerald-500' :
                                    currentOperation.status === 'failed' ? 'bg-red-500' :
                                        'bg-primary-500 progress-striped'
                            )}
                            style={{ width: `${currentOperation.progress}%` }}
                        />
                    </div>

                    {/* Status Message */}
                    {currentOperation.status === 'processing' && (
                        <p className="text-sm text-slate-400 mt-2">
                            {currentOperation.operationType === 'upscale'
                                ? 'Applying AI enhancement...'
                                : 'Resizing image...'}
                        </p>
                    )}

                    {currentOperation.status === 'failed' && currentOperation.errorMessage && (
                        <p className="text-sm text-red-400 mt-2">{currentOperation.errorMessage}</p>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            {currentOperation.status === 'completed' && currentOperation.processedUrl && (
                <div className="mt-4 flex gap-3">
                    <a
                        href={currentOperation.processedUrl}
                        download={`processed_${currentOperation.fileName}`}
                        className="btn btn-primary flex-1"
                    >
                        Download Result
                    </a>
                    <button
                        onClick={() => window.open(currentOperation.processedUrl, '_blank')}
                        className="btn btn-outline"
                    >
                        Preview
                    </button>
                </div>
            )}
        </div>
    );
}
