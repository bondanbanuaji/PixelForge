"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { clerkAppearance } from "@/lib/clerk-theme";

export function ClerkProviderWrapper({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider
            appearance={clerkAppearance}
        >
            {children}
        </ClerkProvider>
    );
}
