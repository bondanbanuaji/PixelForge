'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    aspectRatio?: string; // e.g. "16/9"
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
    beforeImage,
    afterImage,
    aspectRatio = "16/9"
}) => {
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const width = useMotionValue(0);

    // Percentage from 0 to 100
    const [sliderPosition, setSliderPosition] = useState(50);

    useEffect(() => {
        if (containerRef.current) {
            width.set(containerRef.current.getBoundingClientRect().width);
        }

        const handleResize = () => {
            if (containerRef.current) {
                width.set(containerRef.current.getBoundingClientRect().width);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [width]);

    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const newPos = Math.max(0, Math.min(100, (mouseX / rect.width) * 100));
        setSliderPosition(newPos);
    };

    const handleMouseDown = () => setIsResizing(true);
    const handleMouseUp = () => setIsResizing(false);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove as any);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove as any);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove as any);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden rounded-2xl select-none group shadow-2xl border border-white/10"
            style={{ aspectRatio }}
            onMouseMove={(e) => !isResizing && handleMouseMove(e)}
        >
            {/* After Image (Background) */}
            <div className="absolute inset-0">
                <img
                    src={afterImage}
                    alt="After"
                    className="w-full h-full object-cover"
                />
                <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                    After
                </span>
            </div>

            {/* Before Image (Clipped) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={beforeImage}
                    alt="Before"
                    className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                    Before
                </span>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center transition-transform duration-100 ease-out"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
            >
                <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center transform active:scale-90 transition-transform">
                    <GripVertical className="w-4 h-4 text-gray-800" />
                </div>
            </div>

            {/* Hover instruction */}
            <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur text-white text-xs px-3 py-1 rounded-full pointer-events-none"
            >
                Drag to compare
            </motion.div>
        </div>
    );
};
