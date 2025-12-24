'use client';

import { UserButton as ClerkUserButton, useUser } from "@clerk/nextjs";

export function UserButton() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <div className="w-8 h-8 rounded-full bg-base-300 animate-pulse" />
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
                        userButtonPopoverCard: "bg-base-200 border border-slate-700",
                        userButtonPopoverActionButton: "hover:bg-base-300",
                        userButtonPopoverActionButtonText: "text-slate-300",
                        userButtonPopoverFooter: "hidden",
                    },
                }}
                afterSignOutUrl="/"
            />
        </div>
    );
}
