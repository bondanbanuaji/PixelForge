'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Keep recursive usage safe by defining it locally if reused or import from generic

interface ProcessingLoaderProps {
    progress: number; // 0 to 100
    status?: string;
}

export const ProcessingLoader: React.FC<ProcessingLoaderProps> = ({ progress, status = 'Processing...' }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-6 p-8 glass-card rounded-2xl w-full max-w-md mx-auto">
            {/* Circle Loader */}
            <div className="relative w-32 h-32">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-800"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress / 100 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                        style={{
                            strokeDasharray: 377, // 2 * PI * 60
                            strokeDashoffset: 377 - (377 * progress) / 100
                        }}
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center Percentage */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        {Math.round(progress)}%
                    </span>
                </div>

                {/* Glow Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-indigo-500/30"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Status Text with Typing/Pulse effect */}
            <motion.div
                className="text-center space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 className="text-xl font-medium text-white tracking-wide">{status}</h3>
                <div className="flex gap-1 justify-center">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-indigo-500"
                            animate={{
                                y: [0, -6, 0],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
