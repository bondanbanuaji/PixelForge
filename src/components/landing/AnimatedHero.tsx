'use client';

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ParticleBackground } from '../ui/ParticleBackground';
import { AnimatedButton } from '../ui/AnimatedButton';
// Using correct camelCase imports
import { fadeIn, slideUp, staggerContainer } from '@/lib/variants';
import { ArrowRight, Sparkles } from 'lucide-react';

const ThreeDBackground = dynamic(() => import('./ThreeDBackground').then(mod => mod.ThreeDBackground), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-black" />
});

export const AnimatedHero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Backgrounds */}
            <ThreeDBackground />
            <ParticleBackground />

            {/* Glowing Orbs for ambiance */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-600/10 rounded-full blur-[120px]" />

            {/* Content */}
            <motion.div
                className="container mx-auto px-4 relative z-10 text-center"
                variants={staggerContainer} // Use imported variant
                initial="hidden"
                animate="show"
            >
                {/* Badge */}
                <motion.div variants={slideUp} className="flex justify-center mb-6">
                    <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2 text-sm text-indigo-300 font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Image Enhancement</span>
                    </div>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    variants={slideUp}
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8"
                >
                    <span className="block text-white mb-2">Transform Your</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
                        Digital Reality
                    </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    variants={slideUp}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Upscale, restore, and enhance your images with next-generation AI.
                    Experience distinct clarity and detail with our cutting-edge processing engine.
                </motion.p>

                {/* Buttons */}
                <motion.div variants={slideUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <AnimatedButton className="w-full sm:w-auto text-lg px-8 py-4">
                        Start Creating <ArrowRight className="w-5 h-5" />
                    </AnimatedButton>
                    <AnimatedButton variant="outline" className="w-full sm:w-auto text-lg px-8 py-4">
                        View Showcase
                    </AnimatedButton>
                </motion.div>

                {/* Stats or Trusted By */}
                <motion.div variants={fadeIn} className="mt-20 pt-10 border-t border-white/5 mx-auto max-w-4xl">
                    <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider">Trusted by creators worldwide</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Acme Inc', 'PixelLab', 'Visionary', 'Studio X'].map((brand) => (
                            <span key={brand} className="text-xl font-bold text-white/40">{brand}</span>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};
