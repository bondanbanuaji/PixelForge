import React, { Suspense } from 'react';
import { SmoothScroll } from '@/components/ui/SmoothScroll';
import { Navigation } from '@/components/ui/Navigation';
import { AnimatedHero } from '@/components/landing/AnimatedHero';
import { ImageUploadZone } from '@/components/upload/ImageUploadZone';
import { BeforeAfterSlider } from '@/components/results/BeforeAfterSlider';
import { Sparkles, Zap, Shield, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

// Example images for comparison
const BEFORE_IMAGE = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop";
const AFTER_IMAGE = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop";

export default function LandingPage() {
    return (
        <SmoothScroll>
            <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
                <Navigation />

                <main>
                    {/* Hero Section */}
                    <AnimatedHero />

                    {/* Upload Section */}
                    <section id="demo" className="py-24 relative z-10 px-4">
                        <div className="container mx-auto max-w-5xl">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                    Start Creating Magic
                                </h2>
                                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                    Drag and drop your low-resolution images below and watch our AI engine bring them to life instantly.
                                </p>
                            </div>

                            <ImageUploadZone />
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section id="features" className="py-24 bg-zinc-900/30 relative">
                        <div className="container mx-auto px-4">
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    {
                                        icon: Zap,
                                        title: "Lightning Fast",
                                        desc: "Powered by WebAssembly for near-native performance right in your browser."
                                    },
                                    {
                                        icon: Shield,
                                        title: "100% Privacy",
                                        desc: "All processing happens locally. Your photos never leave your device."
                                    },
                                    {
                                        icon: Cpu,
                                        title: "AI Precision",
                                        desc: "State-of-the-art Real-ESRGAN models for superior detail reconstruction."
                                    }
                                ].map((feature, i) => (
                                    <div
                                        key={i}
                                        className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                                            <feature.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                        <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Comparison Showcase */}
                    <section id="showcase" className="py-24 relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/10 pointer-events-none" />
                        <div className="container mx-auto px-4 max-w-6xl relative z-10">
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Real Results</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">See the Difference</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-bold">Unmatched Clarity</h3>
                                    <p className="text-gray-400 leading-relaxed text-lg">
                                        Our AI algorithms analyze every pixel to reconstruct missing details, textures, and sharpness.
                                        The result is a crystal-clear image that looks like it was shot on a high-end camera.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-gray-300">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                            <span>Remove compression artifacts</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-gray-300">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                            <span>Sharpen blurry edges</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-gray-300">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                            <span>Restore natural textures</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <Suspense fallback={<div className="aspect-[4/3] bg-white/5 rounded-2xl animate-pulse" />}>
                                        <BeforeAfterSlider
                                            beforeImage={BEFORE_IMAGE}
                                            afterImage={AFTER_IMAGE}
                                            aspectRatio="4/3"
                                        />
                                    </Suspense>

                                    {/* Decorative elements */}
                                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-indigo-500/30 rounded-full blur-xl" />
                                    <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-purple-500/20 rounded-full blur-xl" />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="py-12 border-t border-white/5 bg-zinc-950">
                    <div className="container mx-auto px-4 text-center text-gray-500">
                        <p>&copy; {new Date().getFullYear()} PixelForge. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </SmoothScroll>
    );
}

