'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Trash2,
    Download,
    Search,
    Image as ImageIcon,
    X,
    Filter,
    Clock
} from 'lucide-react';
import { useProcessingStore, type ImageOperation } from '@/stores/processing';
import { formatBytes, cn } from '@/lib/utils';

export default function HistoryPage() {
    const { operations, removeFromHistory, clearHistory } = useProcessingStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'upscale' | 'downscale'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'failed'>('all');
    const [selectedImage, setSelectedImage] = useState<ImageOperation | null>(null);

    const filteredOperations = operations.filter((op) => {
        const matchesSearch = op.fileName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || op.operationType === filterType;
        const matchesStatus = filterStatus === 'all' || op.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-6">
                            <Link
                                href="/dashboard"
                                className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Dashboard</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-indigo-400" />
                            <h1 className="text-xl font-bold">Processing History</h1>
                        </div>

                        <div className="flex items-center gap-2">
                            {operations.length > 0 && (
                                <button
                                    onClick={() => {
                                        if (confirm('Clear all history?')) clearHistory();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="hidden sm:inline font-medium">Clear All</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                {/* Filters */}
                <div className="glass-card rounded-2xl p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by filename..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-white placeholder-gray-500"
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="relative min-w-[150px]">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-white appearance-none cursor-pointer"
                            >
                                <option value="all">All Types</option>
                                <option value="upscale">Upscale</option>
                                <option value="downscale">Downscale</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="relative min-w-[150px]">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-white appearance-none cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {filteredOperations.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                        <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <ImageIcon className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-medium text-white">No images found</h3>
                        <p className="text-gray-400 mt-2">
                            {operations.length === 0
                                ? 'Process some images to see them here'
                                : 'Try adjusting your filters'}
                        </p>
                        {operations.length === 0 && (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 mt-6 px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
                            >
                                Process Images
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredOperations.map((op) => (
                            <div
                                key={op.id}
                                className="glass-card rounded-xl overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
                                onClick={() => setSelectedImage(op)}
                            >
                                <figure className="h-48 bg-black/40 relative overflow-hidden">
                                    {op.processedUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={op.processedUrl}
                                            alt={op.fileName}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-12 h-12 text-gray-700" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <span
                                            className={cn(
                                                'text-xs font-bold px-2 py-1 rounded uppercase tracking-wider',
                                                op.operationType === 'upscale'
                                                    ? 'bg-indigo-500/90 text-white backdrop-blur-sm'
                                                    : 'bg-purple-500/90 text-white backdrop-blur-sm'
                                            )}
                                        >
                                            {op.operationType} {op.scaleFactor}x
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </figure>
                                <div className="p-4">
                                    <h3 className="font-medium text-white truncate text-sm mb-3">{op.fileName}</h3>

                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4 font-mono">
                                        <span>
                                            {op.processedResolution
                                                ? `${op.processedResolution.width}×${op.processedResolution.height}`
                                                : 'N/A'}
                                        </span>
                                        <span>{op.processedSize ? formatBytes(op.processedSize) : 'N/A'}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        {op.processedUrl && (
                                            <a
                                                href={op.processedUrl}
                                                download={`processed_${op.fileName}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors"
                                            >
                                                <Download className="w-3 h-3" />
                                                Download
                                            </a>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFromHistory(op.id);
                                            }}
                                            className="px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="glass-card w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                            <h3 className="font-bold text-white truncate flex-1">{selectedImage.fileName}</h3>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-auto p-6">
                            <div className="flex flex-col lg:flex-row gap-6 h-full">
                                {/* Image Area */}
                                <div className="flex-1 bg-black/50 rounded-xl items-center justify-center flex p-4 border border-white/5 min-h-[300px]">
                                    {selectedImage.processedUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={selectedImage.processedUrl}
                                            alt={selectedImage.fileName}
                                            className="max-w-full max-h-[60vh] object-contain shadow-2xl rounded"
                                        />
                                    ) : (
                                        <div className="text-gray-500 flex flex-col items-center gap-2">
                                            <ImageIcon className="w-12 h-12" />
                                            <span>Image not available</span>
                                        </div>
                                    )}
                                </div>

                                {/* Info Area */}
                                <div className="w-full lg:w-80 space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Details</h4>

                                        <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Process Type</p>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        'text-xs font-bold px-2 py-1 rounded uppercase tracking-wider',
                                                        selectedImage.operationType === 'upscale'
                                                            ? 'bg-indigo-500/20 text-indigo-300'
                                                            : 'bg-purple-500/20 text-purple-300'
                                                    )}>
                                                        {selectedImage.operationType}
                                                    </span>
                                                    <span className="text-xs font-bold px-2 py-1 rounded bg-white/10 text-white">
                                                        {selectedImage.scaleFactor}x
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Original</p>
                                                    <p className="font-mono text-sm text-white">
                                                        {selectedImage.originalResolution.width}×{selectedImage.originalResolution.height}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{formatBytes(selectedImage.originalSize)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Result</p>
                                                    <p className="font-mono text-sm text-indigo-300">
                                                        {selectedImage.processedResolution
                                                            ? `${selectedImage.processedResolution.width}×${selectedImage.processedResolution.height}`
                                                            : 'N/A'}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {selectedImage.processedSize ? formatBytes(selectedImage.processedSize) : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedImage.processedUrl && (
                                        <a
                                            href={selectedImage.processedUrl}
                                            download={`processed_${selectedImage.fileName}`}
                                            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                                        >
                                            <Download className="w-5 h-5" />
                                            Download Image
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
