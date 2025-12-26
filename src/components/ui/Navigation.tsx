'use client';

import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AnimatedButton } from './AnimatedButton';
import { Menu, X, Zap } from 'lucide-react';

export const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    const navItems = ['Features', 'Showcase'];

    return (
        <>
            <motion.nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                    isScrolled
                        ? "bg-black/50 backdrop-blur-xl border-white/10 py-4"
                        : "bg-transparent border-transparent py-6"
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">PixelForge</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/sign-in"
                            className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                        >
                            Log in
                        </Link>
                        <AnimatedButton
                            variant="primary"
                            className="py-2 px-4 text-sm"
                            href="/sign-up"
                        >
                            Get Started
                        </AnimatedButton>
                    </div>

                    <button
                        className="md:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <motion.div
                className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-8"
                initial={{ opacity: 0, pointerEvents: 'none' }}
                animate={{
                    opacity: mobileMenuOpen ? 1 : 0,
                    pointerEvents: mobileMenuOpen ? 'auto' : 'none'
                }}
                transition={{ duration: 0.3 }}
            >
                {navItems.map((item, i) => (
                    <motion.a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="text-2xl font-medium text-white"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                            y: mobileMenuOpen ? 0 : 20,
                            opacity: mobileMenuOpen ? 1 : 0
                        }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {item}
                    </motion.a>
                ))}

                <div className="flex flex-col gap-4 w-full px-8">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                            y: mobileMenuOpen ? 0 : 20,
                            opacity: mobileMenuOpen ? 1 : 0
                        }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                            <button className="w-full py-3 text-lg font-medium text-white/70 hover:text-white transition-colors">
                                Log in
                            </button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                            y: mobileMenuOpen ? 0 : 20,
                            opacity: mobileMenuOpen ? 1 : 0
                        }}
                        transition={{ delay: 0.5 }}
                    >
                        <AnimatedButton
                            variant="primary"
                            className="w-full"
                            href="/sign-up"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Get Started
                        </AnimatedButton>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
};
