'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    PhotoIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
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
        <div className="min-h-screen bg-base-100">
            {/* Header */}
            <header className="glass sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="btn btn-ghost btn-sm gap-2">
                                <ArrowLeftIcon className="w-4 h-4" />
                                Dashboard
                            </Link>
                        </div>
                        <h1 className="text-lg font-bold">Processing History</h1>
                        <div className="flex items-center gap-2">
                            {operations.length > 0 && (
                                <button
                                    onClick={() => {
                                        if (confirm('Clear all history?')) clearHistory();
                                    }}
                                    className="btn btn-ghost btn-sm text-red-400"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-base-200 rounded-2xl p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by filename..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input input-bordered w-full pl-10 bg-base-300"
                            />
                        </div>

                        {/* Type Filter */}
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                            className="select select-bordered bg-base-300"
                        >
                            <option value="all">All Types</option>
                            <option value="upscale">Upscale</option>
                            <option value="downscale">Downscale</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                            className="select select-bordered bg-base-300"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>

                {/* Results */}
                {filteredOperations.length === 0 ? (
                    <div className="text-center py-20">
                        <PhotoIcon className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                        <h3 className="text-xl font-medium text-slate-400">No images found</h3>
                        <p className="text-slate-500 mt-2">
                            {operations.length === 0
                                ? 'Process some images to see them here'
                                : 'Try adjusting your filters'}
                        </p>
                        <Link href="/dashboard" className="btn btn-primary mt-6">
                            Process Images
                        </Link>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredOperations.map((op) => (
                            <div
                                key={op.id}
                                className="card bg-base-200 card-hover cursor-pointer"
                                onClick={() => setSelectedImage(op)}
                            >
                                <figure className="h-48 bg-base-300 relative">
                                    {op.processedUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={op.processedUrl}
                                            alt={op.fileName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <PhotoIcon className="w-12 h-12 text-slate-600" />
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <span
                                            className={cn(
                                                'badge badge-sm',
                                                op.operationType === 'upscale' ? 'badge-primary' : 'badge-secondary'
                                            )}
                                        >
                                            {op.operationType} {op.scaleFactor}x
                                        </span>
                                    </div>
                                </figure>
                                <div className="card-body p-4">
                                    <h3 className="font-medium truncate text-sm">{op.fileName}</h3>
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>
                                            {op.processedResolution
                                                ? `${op.processedResolution.width}×${op.processedResolution.height}`
                                                : 'N/A'}
                                        </span>
                                        <span>{op.processedSize ? formatBytes(op.processedSize) : 'N/A'}</span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        {op.processedUrl && (
                                            <a
                                                href={op.processedUrl}
                                                download={`processed_${op.fileName}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="btn btn-sm btn-primary flex-1"
                                            >
                                                <ArrowDownTrayIcon className="w-4 h-4" />
                                            </a>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFromHistory(op.id);
                                            }}
                                            className="btn btn-sm btn-ghost text-red-400"
                                        >
                                            <TrashIcon className="w-4 h-4" />
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="bg-base-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-slate-700">
                            <h3 className="font-bold truncate flex-1">{selectedImage.fileName}</h3>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="btn btn-ghost btn-sm btn-circle"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            {selectedImage.processedUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={selectedImage.processedUrl}
                                    alt={selectedImage.fileName}
                                    className="w-full max-h-[60vh] object-contain rounded-lg"
                                />
                            )}
                            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                <div className="bg-base-300 p-3 rounded-lg">
                                    <p className="text-slate-400">Original</p>
                                    <p className="font-medium">
                                        {selectedImage.originalResolution.width}×{selectedImage.originalResolution.height}
                                    </p>
                                    <p className="text-slate-400">{formatBytes(selectedImage.originalSize)}</p>
                                </div>
                                <div className="bg-base-300 p-3 rounded-lg">
                                    <p className="text-slate-400">Processed</p>
                                    <p className="font-medium">
                                        {selectedImage.processedResolution
                                            ? `${selectedImage.processedResolution.width}×${selectedImage.processedResolution.height}`
                                            : 'N/A'}
                                    </p>
                                    <p className="text-slate-400">
                                        {selectedImage.processedSize ? formatBytes(selectedImage.processedSize) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            {selectedImage.processedUrl && (
                                <a
                                    href={selectedImage.processedUrl}
                                    download={`processed_${selectedImage.fileName}`}
                                    className="btn btn-primary w-full mt-4"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                    Download Processed Image
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
