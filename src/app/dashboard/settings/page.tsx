'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import {
    ArrowLeft,
    User,
    Settings,
    Palette,
    HardDrive,
    Trash2,
    Check,
    AlertTriangle,
    Save
} from 'lucide-react';
import { useProcessingStore, type ScaleFactor, type QualityMode, type Algorithm } from '@/stores/processing';
import { useUserStore } from '@/stores/user';
import { formatBytes, cn } from '@/lib/utils';
import { AnimatedButton } from '@/components/ui/AnimatedButton';

interface UserPreferences {
    defaultScaleFactor: 2 | 4 | 8;
    defaultQualityMode: 'fast' | 'balanced' | 'quality';
    defaultAlgorithm: 'lanczos3' | 'mitchell' | 'cubic' | 'realesrgan';
    theme: 'dark' | 'light' | 'system';
}

interface UserData {
    userId: string;
    email: string;
    fullName: string;
    avatarUrl: string | null;
    tier: string;
    totalProcessed: number;
    storageUsedBytes: number;
    preferences: UserPreferences;
    createdAt: string;
}

export default function SettingsPage() {
    const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
    const { config, setConfig, clearHistory } = useProcessingStore();
    const { setUserInfo } = useUserStore();

    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Local state for settings (synced with server)
    const [preferences, setPreferences] = useState<UserPreferences>({
        defaultScaleFactor: 2,
        defaultQualityMode: 'balanced',
        defaultAlgorithm: 'realesrgan',
        theme: 'dark',
    });

    const [fullName, setFullName] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    // Fetch user settings from API
    const fetchSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/settings');

            if (!response.ok) {
                throw new Error('Failed to fetch settings');
            }

            const data = await response.json();

            if (data.success && data.user) {
                setUserData(data.user);
                setPreferences(data.user.preferences);
                setFullName(data.user.fullName || '');

                // Sync with stores
                setUserInfo({
                    fullName: data.user.fullName,
                    avatarUrl: data.user.avatarUrl,
                    tier: data.user.tier,
                });

                setConfig({
                    scaleFactor: data.user.preferences.defaultScaleFactor as ScaleFactor,
                    qualityMode: data.user.preferences.defaultQualityMode as QualityMode,
                    algorithm: data.user.preferences.defaultAlgorithm as Algorithm,
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    }, [setConfig, setUserInfo]);

    useEffect(() => {
        if (isClerkLoaded) {
            fetchSettings();
        }
    }, [isClerkLoaded, fetchSettings]);

    // Update preferences and mark as changed
    const updatePreferences = (updates: Partial<UserPreferences>) => {
        setPreferences(prev => ({ ...prev, ...updates }));
        setHasChanges(true);
    };

    // Save settings to API
    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError(null);

            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    preferences,
                    fullName,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save settings');
            }

            const resData = await response.json();

            // Sync with stores immediately
            setUserInfo({ fullName });

            setConfig({
                scaleFactor: preferences.defaultScaleFactor as ScaleFactor,
                qualityMode: preferences.defaultQualityMode as QualityMode,
                algorithm: preferences.defaultAlgorithm as Algorithm,
            });

            setShowSaved(true);
            setHasChanges(false);
            setTimeout(() => setShowSaved(false), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    // Clear history
    const handleClearHistory = async () => {
        if (!confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch('/api/settings', {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to clear history');
            }

            // Clear local store
            clearHistory();

            // Refresh user data
            await fetchSettings();

            alert('History cleared successfully!');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to clear history');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-6">
                            <Link
                                href="/dashboard"
                                className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Dashboard</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <Settings className="w-5 h-5 text-indigo-400" />
                            <h1 className="text-xl font-bold">Settings</h1>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving || !hasChanges}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium",
                                hasChanges
                                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                    : "bg-white/5 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : showSaved ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    <span>Saved!</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-8">
                {/* Error Alert */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center justify-between text-red-200">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <span>{error}</span>
                        </div>
                        <button onClick={() => setError(null)} className="hover:text-white transition-colors">
                            <span className="sr-only">Dismiss</span>
                            <div className="text-xs uppercase font-bold tracking-wider">Dismiss</div>
                        </button>
                    </div>
                )}

                {/* Profile Section */}
                <section className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Profile</h2>
                            <p className="text-sm text-gray-400">Manage your account info</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-2xl shadow-indigo-500/20 border-4 border-black/50">
                            {userData?.avatarUrl || clerkUser?.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={userData?.avatarUrl || clerkUser?.imageUrl || ''}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{(fullName || userData?.email || 'U')[0].toUpperCase()}</span>
                            )}
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Display Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => {
                                        setFullName(e.target.value);
                                        setHasChanges(true);
                                    }}
                                    placeholder="Enter your name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-colors"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    {userData?.email}
                                </span>
                                <span className="text-xs font-bold bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 px-3 py-1 rounded-full uppercase tracking-wider">
                                    {userData?.tier || 'FREE'}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <div className="text-xs font-medium text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                                    {userData?.totalProcessed || 0} images processed
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Default Preferences */}
                <section className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-pink-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Preferences</h2>
                            <p className="text-sm text-gray-400">Set your default processing options</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Default Scale Factor */}
                        <div>
                            <label className="text-sm text-gray-400 block mb-3">Default Scale Factor</label>
                            <div className="grid grid-cols-3 gap-3">
                                {([2, 4, 8] as const).map((factor) => (
                                    <button
                                        key={factor}
                                        onClick={() => updatePreferences({ defaultScaleFactor: factor })}
                                        className={cn(
                                            'p-3 rounded-xl border-2 font-bold text-lg transition-all',
                                            preferences.defaultScaleFactor === factor
                                                ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                                : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'
                                        )}
                                    >
                                        {factor}x
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Default Quality Mode */}
                        <div>
                            <label className="text-sm text-gray-400 block mb-3">Default Quality Mode</label>
                            <div className="relative">
                                <select
                                    value={preferences.defaultQualityMode}
                                    onChange={(e) => updatePreferences({ defaultQualityMode: e.target.value as UserPreferences['defaultQualityMode'] })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                                >
                                    <option value="fast">Fast - Lower quality, faster processing</option>
                                    <option value="balanced">Balanced - Good quality and speed</option>
                                    <option value="quality">Quality - Best quality, slower</option>
                                </select>
                            </div>
                        </div>

                        {/* Default Algorithm */}
                        <div>
                            <label className="text-sm text-gray-400 block mb-3">Default Algorithm</label>
                            <select
                                value={preferences.defaultAlgorithm}
                                onChange={(e) => updatePreferences({ defaultAlgorithm: e.target.value as UserPreferences['defaultAlgorithm'] })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                            >
                                <option value="realesrgan">Real-ESRGAN - AI-powered upscaling (Best for photos)</option>
                                <option value="lanczos3">Lanczos3 - Best overall quality</option>
                                <option value="mitchell">Mitchell - Sharp edges, good for text</option>
                                <option value="cubic">Cubic - Smooth gradients</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Theme Settings */}
                <section className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <Palette className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Appearance</h2>
                            <p className="text-sm text-gray-400">Customize UI theme</p>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-3 gap-3">
                            {(['dark', 'light', 'system'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => updatePreferences({ theme: t })}
                                    className={cn(
                                        'p-3 rounded-xl border-2 font-medium capitalize transition-all',
                                        preferences.theme === t
                                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                            : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Theme preference will be applied via system settings
                        </p>
                    </div>
                </section>

                {/* Storage Management */}
                <section className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <HardDrive className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Storage</h2>
                            <p className="text-sm text-gray-400">Usage and limits</p>
                        </div>
                    </div>
                    <div className="space-y-5">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-bold text-white">{formatBytes(userData?.storageUsedBytes || 0)}</h3>
                                <p className="text-xs text-gray-500">used of 100 MB</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">
                                    {(Math.min(100, ((userData?.storageUsedBytes || 0) / (1024 * 1024 * 100)) * 100)).toFixed(1)}% Used
                                </span>
                            </div>
                        </div>

                        <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden border border-white/5">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                style={{ width: `${Math.min(100, ((userData?.storageUsedBytes || 0) / (1024 * 1024 * 100)) * 100)}%` }}
                            />
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="rounded-2xl p-6 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-red-200">Danger Zone</h2>
                            <p className="text-sm text-red-400/60">Irreversible actions</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-red-500/10">
                        <div>
                            <h3 className="font-medium text-white">Clear History</h3>
                            <p className="text-sm text-gray-500">Delete all processed images and reset storage</p>
                        </div>
                        <button
                            onClick={handleClearHistory}
                            className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-medium"
                        >
                            Clear All Data
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
