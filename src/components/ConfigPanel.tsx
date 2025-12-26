'use client';

import { ArrowUp, ArrowDown, Zap, Sparkles, SlidersHorizontal, Settings2 } from 'lucide-react';
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
        <div className="glass-card rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-white">Processing Options</h3>
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
                                ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'
                        )}
                    >
                        <ArrowUp className="w-5 h-5" />
                        <span className="font-medium">Upscale</span>
                    </button>
                    <button
                        onClick={() => setConfig({ operationType: 'downscale', algorithm: 'lanczos3' })}
                        className={cn(
                            'flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300',
                            config.operationType === 'downscale'
                                ? 'border-purple-500 bg-purple-500/20 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'
                        )}
                    >
                        <ArrowDown className="w-5 h-5" />
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
                                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                                        : 'border-purple-500 bg-purple-500/20 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                                    : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'
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
                        { value: 'fast', label: 'Fast', icon: Zap },
                        { value: 'balanced', label: 'Balanced', icon: SlidersHorizontal },
                        { value: 'quality', label: 'Quality', icon: Sparkles },
                    ] as const).map(({ value, label, icon: Icon }) => (
                        <button
                            key={value}
                            onClick={() => setConfig({ qualityMode: value })}
                            className={cn(
                                'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-300',
                                config.qualityMode === value
                                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                                    : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'
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
                        className="select select-bordered w-full bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-white"
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
                <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Original:</span>
                        <span className="font-medium text-white">{dimensions.width} × {dimensions.height}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Result:</span>
                        <span className={cn(
                            'font-medium',
                            config.operationType === 'upscale' ? 'text-indigo-400' : 'text-purple-400'
                        )}>
                            {newDimensions.width} × {newDimensions.height}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Est. Time:</span>
                        <span className="font-medium text-white">~{estimatedTime}s</span>
                    </div>
                </div>
            )}
        </div>
    );
}
