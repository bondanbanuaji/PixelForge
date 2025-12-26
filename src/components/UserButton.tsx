'use client';

import { UserButton as ClerkUserButton, useUser } from "@clerk/nextjs";

export function UserButton() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 animate-pulse" />
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{user.fullName || user.username}</p>
                <p className="text-xs text-slate-400">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
            <ClerkUserButton
                appearance={{
                    elements: {
                        avatarBox: "w-8 h-8",
                        userButtonPopoverCard: "bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl",
                        userButtonPopoverActionButton: "hover:bg-white/5",
                        userButtonPopoverActionButtonText: "text-gray-300",
                        userButtonPopoverFooter: "hidden",
                    },
                }}
                afterSignOutUrl="/"
            />
        </div>
    );
}
