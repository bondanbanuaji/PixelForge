import Link from "next/link";
import {
    ArrowUpIcon,
    ArrowDownIcon,
    BoltIcon,
    ShieldCheckIcon,
    SparklesIcon,
    PhotoIcon
} from "@heroicons/react/24/outline";

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <SparklesIcon className="w-8 h-8 text-primary-500" />
                            <span className="text-xl font-bold">PixelForge</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="hover:text-primary-400 transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-primary-400 transition-colors">How It Works</a>
                            <Link href="/dashboard" className="btn btn-primary btn-sm">
                                Get Started
                            </Link>
                        </div>
                        <Link href="/dashboard" className="md:hidden btn btn-primary btn-sm">
                            Start
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-gradient min-h-screen flex items-center justify-center pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 mb-8">
                            <SparklesIcon className="w-5 h-5 text-primary-400" />
                            <span className="text-sm text-primary-300">AI-Powered Image Processing</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            Transform Images with
                            <span className="block text-gradient bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500 bg-clip-text text-transparent">
                                AI Precision
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10">
                            Enterprise-grade image resolution transformation. Upscale with AI or downscale with classical algorithms.
                            Zero-cost, unlimited processing, 100% privacy-focused local execution.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/dashboard" className="btn btn-primary btn-lg gap-2 glow">
                                <BoltIcon className="w-5 h-5" />
                                Get Started Free
                            </Link>
                            <a href="#features" className="btn btn-outline btn-lg">
                                Learn More
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: "∞", label: "Unlimited Processing" },
                                { value: "$0", label: "Zero Cost" },
                                { value: "100%", label: "Local & Private" },
                                { value: "8x", label: "Max Upscale" },
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-primary-400">{stat.value}</div>
                                    <div className="text-sm text-slate-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-base-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Everything you need to transform your images with professional-grade quality
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* AI Upscaling */}
                        <div className="card bg-base-100 shadow-xl card-hover">
                            <div className="card-body">
                                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
                                    <ArrowUpIcon className="w-7 h-7 text-primary-400" />
                                </div>
                                <h3 className="card-title text-xl">AI Upscaling</h3>
                                <p className="text-slate-400">
                                    Enhance image resolution up to 8x using Real-ESRGAN AI models.
                                    Perfect for photos, artwork, and illustrations.
                                </p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="badge badge-primary badge-outline">2x</span>
                                    <span className="badge badge-primary badge-outline">4x</span>
                                    <span className="badge badge-primary badge-outline">8x</span>
                                </div>
                            </div>
                        </div>

                        {/* Fast Downscaling */}
                        <div className="card bg-base-100 shadow-xl card-hover">
                            <div className="card-body">
                                <div className="w-14 h-14 rounded-2xl bg-accent-500/10 flex items-center justify-center mb-4">
                                    <ArrowDownIcon className="w-7 h-7 text-accent-400" />
                                </div>
                                <h3 className="card-title text-xl">Fast Downscaling</h3>
                                <p className="text-slate-400">
                                    Reduce image size with high-quality algorithms like Lanczos3, Mitchell, and Cubic.
                                    Lightning-fast processing.
                                </p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="badge badge-secondary badge-outline">Lanczos3</span>
                                    <span className="badge badge-secondary badge-outline">Mitchell</span>
                                    <span className="badge badge-secondary badge-outline">Cubic</span>
                                </div>
                            </div>
                        </div>

                        {/* Privacy First */}
                        <div className="card bg-base-100 shadow-xl card-hover">
                            <div className="card-body">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                    <ShieldCheckIcon className="w-7 h-7 text-emerald-400" />
                                </div>
                                <h3 className="card-title text-xl">Privacy First</h3>
                                <p className="text-slate-400">
                                    All processing happens locally on your machine.
                                    Your images never leave your device. Zero external API calls.
                                </p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="badge badge-success badge-outline">Local</span>
                                    <span className="badge badge-success badge-outline">Secure</span>
                                    <span className="badge badge-success badge-outline">Private</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-base-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Transform your images in four simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                step: 1,
                                title: "Upload",
                                description: "Drag and drop your image or click to browse. Supports JPG, PNG, WebP up to 50MB.",
                                icon: PhotoIcon,
                            },
                            {
                                step: 2,
                                title: "Configure",
                                description: "Choose upscale or downscale, select your preferred scale factor and quality mode.",
                                icon: BoltIcon,
                            },
                            {
                                step: 3,
                                title: "Process",
                                description: "Our AI engine processes your image locally with real-time progress updates.",
                                icon: SparklesIcon,
                            },
                            {
                                step: 4,
                                title: "Download",
                                description: "Download your transformed image instantly. High quality, ready to use.",
                                icon: ArrowDownIcon,
                            },
                        ].map((item) => (
                            <div key={item.step} className="relative text-center">
                                <div className="w-16 h-16 rounded-full bg-primary-500/10 border-2 border-primary-500 flex items-center justify-center mx-auto mb-6">
                                    <span className="text-2xl font-bold text-primary-400">{item.step}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-sm">{item.description}</p>

                                {item.step < 4 && (
                                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-500/50 to-transparent" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <Link href="/dashboard" className="btn btn-primary btn-lg gap-2">
                            <SparklesIcon className="w-5 h-5" />
                            Start Transforming Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-b from-base-200 to-base-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="glass rounded-3xl p-10 md:p-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Transform Your Images?
                        </h2>
                        <p className="text-slate-400 mb-8">
                            Join thousands of users who trust PixelForge for their image processing needs.
                            No credit card required, no hidden fees.
                        </p>
                        <Link href="/dashboard" className="btn btn-primary btn-lg gap-2 glow">
                            <BoltIcon className="w-5 h-5" />
                            Get Started for Free
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 bg-base-200 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <SparklesIcon className="w-6 h-6 text-primary-500" />
                            <span className="font-bold">PixelForge</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} PixelForge. All rights reserved. Built with ❤️
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Terms</a>
                            <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Privacy</a>
                            <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
