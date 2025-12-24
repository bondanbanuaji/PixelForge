'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn, formatBytes, getImageDimensions } from '@/lib/utils';
import { useProcessingStore } from '@/stores/processing';

interface UploadZoneProps {
    onFileSelect?: (file: File, dimensions: { width: number; height: number }) => void;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
    const { currentFile, setCurrentFile } = useProcessingStore();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        // Get dimensions
        try {
            const dims = await getImageDimensions(file);
            setDimensions(dims);
            setCurrentFile(file);
            onFileSelect?.(file, dims);
        } catch (error) {
            console.error('Failed to get image dimensions:', error);
        }
    }, [setCurrentFile, onFileSelect]);

    const clearFile = () => {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setDimensions(null);
        setCurrentFile(null);
    };

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
        maxSize: 50 * 1024 * 1024, // 50MB
        multiple: false,
    });

    if (preview && currentFile) {
        return (
            <div className="relative rounded-2xl overflow-hidden bg-base-200 border border-slate-700">
                <button
                    onClick={clearFile}
                    className="absolute top-4 right-4 z-10 btn btn-circle btn-sm btn-ghost bg-base-100/80"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        {/* Preview Image */}
                        <div className="relative w-full md:w-1/2 aspect-video rounded-lg overflow-hidden bg-base-300">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* File Info */}
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div>
                                <h3 className="font-semibold text-lg truncate max-w-xs">{currentFile.name}</h3>
                                <p className="text-slate-400 text-sm">Ready for processing</p>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <div className="badge badge-lg badge-primary gap-2">
                                    <PhotoIcon className="w-4 h-4" />
                                    {dimensions ? `${dimensions.width} × ${dimensions.height}` : 'Loading...'}
                                </div>
                                <div className="badge badge-lg badge-secondary">
                                    {formatBytes(currentFile.size)}
                                </div>
                            </div>

                            <p className="text-sm text-slate-500">
                                Type: {currentFile.type || 'Unknown'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                'dropzone cursor-pointer text-center',
                isDragActive && 'active',
                isDragAccept && 'accept',
                isDragReject && 'reject'
            )}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center gap-4 py-8">
                <div className={cn(
                    'w-20 h-20 rounded-full flex items-center justify-center transition-colors',
                    isDragActive ? 'bg-primary-500/20' : 'bg-slate-800'
                )}>
                    <CloudArrowUpIcon className={cn(
                        'w-10 h-10 transition-colors',
                        isDragActive ? 'text-primary-400' : 'text-slate-500'
                    )} />
                </div>

                <div>
                    <p className="text-lg font-medium">
                        {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                        or click to browse files
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-2">
                    <span className="badge badge-outline">JPG</span>
                    <span className="badge badge-outline">PNG</span>
                    <span className="badge badge-outline">WebP</span>
                    <span className="badge badge-ghost text-slate-500">Max 50MB</span>
                </div>
            </div>
        </div>
    );
}
