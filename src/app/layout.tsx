import type { Metadata } from "next";
import { ClerkProviderWrapper } from "@/components/ClerkProviderWrapper";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
    title: "PixelForge - AI-Powered Image Resolution Transformation",
    description: "Transform your images with AI precision. Upscale, downscale, and enhance images with zero-cost local processing.",
    keywords: ["image upscaling", "AI image enhancement", "image processing", "resolution transformation"],
    authors: [{ name: "PixelForge Team" }],
    openGraph: {
        title: "PixelForge - AI-Powered Image Resolution Transformation",
        description: "Transform your images with AI precision",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProviderWrapper>
            <html lang="en" data-theme="pixelforge" className="dark" suppressHydrationWarning>
                <head>
                    {/* Blanket override to hide ALL Clerk branding/internal elements */}
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .cl-footer, 
                        .cl-internal-ph678c, 
                        .cl-internal-1au7fio,
                        .cl-internal-607372,
                        [data-clerk-branding] {
                            display: none !important;
                        }
                    ` }} />
                </head>
                <body className="antialiased">
                    <Providers>
                        {children}
                    </Providers>
                </body>
            </html>
        </ClerkProviderWrapper>
    );
}
