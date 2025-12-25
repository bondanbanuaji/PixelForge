"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

export function ClerkProviderWrapper({ children }: { children: ReactNode }) {
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
            {children}
        </ClerkProvider>
    );
}
