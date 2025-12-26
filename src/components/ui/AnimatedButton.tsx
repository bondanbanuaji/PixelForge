'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming cn utility exists, usually clsx + tailwind-merge

// --- Utility for class merging if not already existing ---
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import Link, { LinkProps } from 'next/link';

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    glow?: boolean;
    href?: string;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
    ({ className, variant = 'primary', glow = true, children, ...props }, ref) => {

        const variants = {
            primary: 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50',
            secondary: 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-500/50',
            outline: 'bg-transparent border border-white/20 text-white hover:bg-white/10',
            ghost: 'bg-transparent text-white hover:bg-white/5',
        };

        const combinedClassName = cn(
            'relative px-6 py-3 rounded-xl font-medium overflow-hidden transition-colors',
            'flex items-center justify-center gap-2',
            variants[variant],
            glow && variant !== 'ghost' && 'shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]',
            className
        );

        const content = (
            <>
                {/* Shine effect overlay */}
                <motion.div
                    className="absolute inset-0 -translate-x-[100%]"
                    initial={false}
                    whileHover={{
                        translateX: '100%',
                        transition: { duration: 0.6, ease: "easeInOut" }
                    }}
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
                    }}
                />

                {/* Content */}
                <span className="relative z-10 flex items-center gap-2">{children}</span>
            </>
        );

        if (props.href) {
            return (
                <Link href={props.href} className={combinedClassName}>
                    {content}
                </Link>
            );
        }

        return (
            <motion.button
                ref={ref}
                className={combinedClassName}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                {...props}
            >
                {content}
            </motion.button>
        );
    }
);
AnimatedButton.displayName = 'AnimatedButton';
