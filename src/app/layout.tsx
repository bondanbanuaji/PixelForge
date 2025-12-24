import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
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
        <ClerkProvider
            appearance={{
                variables: {
                    colorPrimary: "#3b82f6",
                    colorBackground: "#0f172a",
                    colorInputBackground: "#1e293b",
                    colorInputText: "#f1f5f9",
                    colorText: "#f1f5f9",
                    colorTextSecondary: "#94a3b8",
                },
            }}
        >
            <html lang="en" data-theme="pixelforge">
                <body className="antialiased">
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
