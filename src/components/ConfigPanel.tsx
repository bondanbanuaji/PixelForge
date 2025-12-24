'use client';

import { ArrowUpIcon, ArrowDownIcon, BoltIcon, SparklesIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { cn, calculateNewDimensions, estimateProcessingTime } from '@/lib/utils';
import { useProcessingStore, type ScaleFactor, type Algorithm } from '@/stores/processing';

interface ConfigPanelProps {
    dimensions?: { width: number; height: number } | null;
}

export function ConfigPanel({ dimensions }: ConfigPanelProps) {
    const { config, setConfig } = useProcessingStore();

    const newDimensions = dimensions
        ? calculateNewDimensions(dimensions.width, dimensions.height, config.scaleFactor, config.operationType)
        : null;

    const estimatedTime = dimensions
        ? estimateProcessingTime(dimensions.width, dimensions.height, config.scaleFactor, config.operationType)
        : null;

    const algorithms: { value: Algorithm; label: string; description: string }[] = config.operationType === 'upscale'
        ? [{ value: 'realesrgan', label: 'Real-ESRGAN', description: 'AI-powered upscaling' }]
        : [
            { value: 'lanczos3', label: 'Lanczos3', description: 'Best quality balance' },
            { value: 'mitchell', label: 'Mitchell', description: 'Sharp edges, good for text' },
            { value: 'cubic', label: 'Cubic', description: 'Smooth gradients' },
        ];

    return (
        <div className="bg-base-200 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-primary-400" />
                <h3 className="font-semibold">Processing Options</h3>
            </div>

            {/* Operation Type */}
            <div className="space-y-3">
                <label className="text-sm text-slate-400">Operation Type</label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setConfig({ operationType: 'upscale', algorithm: 'realesrgan' })}
                        className={cn(
                            'flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all',
                            config.operationType === 'upscale'
                                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                : 'border-slate-700 hover:border-slate-600'
                        )}
                    >
                        <ArrowUpIcon className="w-5 h-5" />
                        <span className="font-medium">Upscale</span>
                    </button>
                    <button
                        onClick={() => setConfig({ operationType: 'downscale', algorithm: 'lanczos3' })}
                        className={cn(
                            'flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all',
                            config.operationType === 'downscale'
                                ? 'border-accent-500 bg-accent-500/10 text-accent-400'
                                : 'border-slate-700 hover:border-slate-600'
                        )}
                    >
                        <ArrowDownIcon className="w-5 h-5" />
                        <span className="font-medium">Downscale</span>
                    </button>
                </div>
            </div>

            {/* Scale Factor */}
            <div className="space-y-3">
                <label className="text-sm text-slate-400">Scale Factor</label>
                <div className="grid grid-cols-3 gap-3">
                    {([2, 4, 8] as ScaleFactor[]).map((factor) => (
                        <button
                            key={factor}
                            onClick={() => setConfig({ scaleFactor: factor })}
                            className={cn(
                                'p-3 rounded-xl border-2 font-bold text-lg transition-all',
                                config.scaleFactor === factor
                                    ? config.operationType === 'upscale'
                                        ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                        : 'border-accent-500 bg-accent-500/10 text-accent-400'
                                    : 'border-slate-700 hover:border-slate-600'
                            )}
                        >
                            {factor}x
                        </button>
                    ))}
                </div>
            </div>

            {/* Quality Mode */}
            <div className="space-y-3">
                <label className="text-sm text-slate-400">Quality Mode</label>
                <div className="grid grid-cols-3 gap-3">
                    {([
                        { value: 'fast', label: 'Fast', icon: BoltIcon },
                        { value: 'balanced', label: 'Balanced', icon: AdjustmentsHorizontalIcon },
                        { value: 'quality', label: 'Quality', icon: SparklesIcon },
                    ] as const).map(({ value, label, icon: Icon }) => (
                        <button
                            key={value}
                            onClick={() => setConfig({ qualityMode: value })}
                            className={cn(
                                'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all',
                                config.qualityMode === value
                                    ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                    : 'border-slate-700 hover:border-slate-600'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Algorithm (Downscale only) */}
            {config.operationType === 'downscale' && (
                <div className="space-y-3">
                    <label className="text-sm text-slate-400">Algorithm</label>
                    <select
                        value={config.algorithm}
                        onChange={(e) => setConfig({ algorithm: e.target.value as Algorithm })}
                        className="select select-bordered w-full bg-base-300"
                    >
                        {algorithms.map((alg) => (
                            <option key={alg.value} value={alg.value}>
                                {alg.label} - {alg.description}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Preview Info */}
            {dimensions && newDimensions && (
                <div className="p-4 bg-base-300 rounded-xl space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Original:</span>
                        <span className="font-medium">{dimensions.width} × {dimensions.height}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Result:</span>
                        <span className={cn(
                            'font-medium',
                            config.operationType === 'upscale' ? 'text-primary-400' : 'text-accent-400'
                        )}>
                            {newDimensions.width} × {newDimensions.height}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Est. Time:</span>
                        <span className="font-medium">~{estimatedTime}s</span>
                    </div>
                </div>
            )}
        </div>
    );
}
