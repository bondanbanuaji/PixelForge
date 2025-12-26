'use client'
// import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
    // Since we are enforcing dark mode only via data-theme in layout.tsx,
    // we don't strictly need next-themes provider wrapping for now.
    // We just return children to keep the structure if we add context later.
    return (
        <>
            {children}
        </>
    )
}
