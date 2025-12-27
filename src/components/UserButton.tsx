'use client';

import { useUser, useClerk } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    LogOut,
    Settings,
    ChevronDown,
    Mail,
    ShieldCheck,
    LayoutDashboard,
    History
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user";

export function UserButton() {
    const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
    const { signOut, openUserProfile } = useClerk();
    const { fullName, avatarUrl, tier, isLoaded: isStoreLoaded, fetchUser } = useUserStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Fetch database-synced user on mount
    useEffect(() => {
        if (isClerkLoaded && clerkUser) {
            fetchUser();
        }
    }, [isClerkLoaded, clerkUser, fetchUser]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isClerkLoaded || !isStoreLoaded) {
        return (
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 animate-pulse" />
        );
    }

    if (!clerkUser) return null;

    // Use DB data with fallbacks to Clerk data
    const displayName = fullName || clerkUser.fullName || clerkUser.username || "User";
    const displayAvatar = avatarUrl || clerkUser.imageUrl;
    const displayTier = tier || "FREE";

    const menuItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            type: "link"
        },
        {
            label: "History",
            icon: History,
            href: "/dashboard/history",
            type: "link"
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/dashboard/settings",
            type: "link"
        },
        {
            label: "Manage Account",
            icon: User,
            onClick: () => {
                openUserProfile();
                setIsOpen(false);
            },
            type: "button"
        },
        {
            label: "Sign Out",
            icon: LogOut,
            onClick: () => signOut(() => router.push("/")),
            type: "button",
            danger: true
        }
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10 group"
            >
                <div className="relative w-9 h-9">
                    <img
                        src={displayAvatar}
                        alt={displayName}
                        className="w-full h-full rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-500/50 transition-all duration-300"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black" />
                </div>

                <div className="hidden sm:block text-left mr-1">
                    <p className="text-sm font-semibold text-white truncate max-w-[120px]">
                        {displayName}
                    </p>
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{displayTier} Plan</span>
                        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-64 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]"
                    >
                        {/* User Profile Summary */}
                        <div className="p-4 border-b border-white/5 bg-white/5">
                            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">Connected Account</p>
                            <div className="flex items-center gap-3">
                                <img
                                    src={displayAvatar}
                                    alt={displayName}
                                    className="w-10 h-10 rounded-full border border-white/10"
                                />
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-white truncate">
                                        {displayName}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        {clerkUser.primaryEmailAddress?.emailAddress}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                            {menuItems.map((item, index) => (
                                <div key={index}>
                                    {item.type === "link" ? (
                                        <Link
                                            href={item.href!}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
                                        >
                                            <item.icon className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={item.onClick}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                                                ${item.danger
                                                    ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <item.icon className={`w-4 h-4 transition-colors
                                                ${item.danger
                                                    ? 'text-red-400 group-hover:text-red-300'
                                                    : 'text-gray-400 group-hover:text-indigo-400'
                                                }`}
                                            />
                                            {item.label}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer / Badge */}
                        <div className="px-5 py-3 bg-indigo-500/10 flex items-center justify-between border-t border-indigo-500/20">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                                <span className="text-[10px] font-bold text-indigo-300 uppercase">PixelForge Verified</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
