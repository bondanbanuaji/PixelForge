'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, CheckCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { cn, formatBytes, getImageDimensions } from '@/lib/utils';
import { useProcessingStore } from '@/stores/processing';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export const ImageUploadZone = () => {
    const { currentFile, setCurrentFile } = useProcessingStore();
    const [preview, setPreview] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
    const [isHovering, setIsHovering] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Success confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#a855f7', '#06b6d4']
        });

        toast.success("Image uploaded successfully!");

        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        try {
            const dims = await getImageDimensions(file);
            setDimensions(dims);
            setCurrentFile(file);
        } catch (error) {
            console.error('Failed to get dimensions', error);
            toast.error("Failed to read image dimensions");
        }
    }, [setCurrentFile]);

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setDimensions(null);
        setCurrentFile(null);
    };

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
        maxSize: 50 * 1024 * 1024,
        multiple: false,
    });

    return (
        <div className="w-full max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
                {!currentFile ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative group"
                    >
                        {/* Glow effect */}
                        <div className={cn(
                            "absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-20 blur transition-opacity duration-500",
                            (isDragActive || isHovering) ? "opacity-100" : "opacity-20"
                        )} />

                        <div
                            {...getRootProps()}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            className={cn(
                                "relative rounded-2xl border-2 border-dashed transition-all duration-300 min-h-[300px] flex flex-col items-center justify-center p-10 cursor-pointer overflow-hidden",
                                isDragActive ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" : "border-white/10 bg-black/40 hover:bg-black/60 hover:border-white/20"
                            )}
                        >
                            <input {...getInputProps()} />

                            {/* Floating Icons Background */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                                <motion.div
                                    animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-10 left-10"
                                >
                                    <FileImage className="w-12 h-12 text-indigo-500" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-10 right-10"
                                >
                                    <Sparkles className="w-8 h-8 text-purple-500" />
                                </motion.div>
                            </div>

                            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                                <motion.div
                                    animate={{
                                        scale: isDragActive ? 1.2 : 1,
                                        rotate: isDragActive ? 180 : 0
                                    }}
                                    className={cn(
                                        "w-20 h-20 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/20",
                                        isDragActive ? "bg-indigo-500 text-white" : "bg-white/5 text-indigo-400"
                                    )}
                                >
                                    <Upload className="w-8 h-8" />
                                </motion.div>

                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {isDragActive ? "Drop it like it's hot!" : "Upload Image"}
                                    </h3>
                                    <p className="text-gray-400 max-w-sm mx-auto">
                                        Drag & drop your image here, or click to browse.
                                        Supports JPG, PNG, WebP up to 50MB.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative rounded-2xl overflow-hidden glass-card border-white/10 group"
                    >
                        {/* Header Bar */}
                        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-20 flex justify-between items-start">
                            <div className="flex gap-2">
                                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                    Ready
                                </div>
                                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                                    {dimensions ? `${dimensions.width}×${dimensions.height}` : 'Loading...'}
                                </div>
                            </div>
                            <button
                                onClick={clearFile}
                                className="p-2 rounded-full bg-black/60 text-white hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row h-full min-h-[400px]">
                            {/* Image Preview Area */}
                            <div className="flex-1 bg-black/40 flex items-center justify-center p-8 relative overflow-hidden">
                                {preview && (
                                    <motion.img
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        src={preview}
                                        alt="Preview"
                                        className="max-w-full max-h-[400px] object-contain shadow-2xl rounded-lg"
                                    />
                                )}
                            </div>

                            {/* Info Sidebar */}
                            <div className="w-full md:w-80 bg-black/60 border-l border-white/10 p-6 flex flex-col justify-center space-y-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-1">File Name</h4>
                                    <p className="text-white font-medium truncate" title={currentFile.name}>{currentFile.name}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-1">Size</h4>
                                    <p className="text-white font-medium">{formatBytes(currentFile.size)}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-1">Type</h4>
                                    <p className="text-white font-medium uppercase">{currentFile.type.split('/')[1]}</p>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-indigo-400" />
                                        <span className="text-sm font-semibold text-indigo-300">AI Analysis</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Image is ready for enhancement. Our algorithms will automatically detect the best upscale model for this content type.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
