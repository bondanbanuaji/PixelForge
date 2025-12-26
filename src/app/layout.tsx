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
                <body className="antialiased">
                    <Providers>
                        {children}
                    </Providers>
                </body>
            </html>
        </ClerkProviderWrapper>
    );
}
