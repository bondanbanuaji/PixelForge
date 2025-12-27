'use client';

import { SignUp } from "@clerk/nextjs";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden p-4 md:p-10">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-6xl relative z-10 flex flex-wrap items-center justify-center gap-10 md:gap-20 animate-in fade-in zoom-in-95 duration-1000">
                {/* Branding Section */}
                <div className="flex-1 min-w-[300px] max-w-[450px] text-center md:text-left">
                    <Link href="/" className="inline-flex flex-col items-center md:items-start gap-6 group">
                        <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.5)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                            <Zap className="w-12 h-12 text-white" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                                Pixel<span className="text-indigo-500">Forge</span>
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-md leading-relaxed">
                                Join the elite community of creators. <span className="text-indigo-400">Scale without limits</span> and transform your vision today.
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Auth Section */}
                <div className="w-full max-w-[480px] shadow-2xl">
                    <SignUp
                        routing="path"
                        path="/sign-up"
                    />
                </div>
            </div>

            {/* Global style override to hide Clerk branding footer and force container width */}
            <style jsx global>{`
                .cl-rootBox {
                    width: 100%;
                }
                .cl-card {
                    width: 100% !important;
                    max-width: none !important;
                    background: rgba(0, 0, 0, 0.7) !important;
                    backdrop-filter: blur(20px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                }
                .cl-footer, .cl-internal-ph678c, .cl-internal-1au7fio {
                    display: none !important;
                }
            `}</style>
        </div>
    );
}
