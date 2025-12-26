'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import {
    ArrowLeftIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    PaintBrushIcon,
    ServerStackIcon,
    TrashIcon,
    CheckIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useProcessingStore, type ScaleFactor, type QualityMode, type Algorithm } from '@/stores/processing';
import { formatBytes, cn } from '@/lib/utils';

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

                // Sync with Zustand store
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
    }, [setConfig]);

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

            // Sync with Zustand store
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
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="spinner w-12 h-12"></div>
                    <p className="text-slate-400">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100">
            {/* Header */}
            <header className="glass sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="btn btn-ghost btn-sm gap-2">
                                <ArrowLeftIcon className="w-4 h-4" />
                                Dashboard
                            </Link>
                        </div>
                        <h1 className="text-lg font-bold">Settings</h1>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !hasChanges}
                            className={cn(
                                "btn btn-sm gap-2",
                                hasChanges ? "btn-primary" : "btn-ghost"
                            )}
                        >
                            {isSaving ? (
                                <>
                                    <span className="loading loading-spinner loading-xs"></span>
                                    Saving...
                                </>
                            ) : showSaved ? (
                                <>
                                    <CheckIcon className="w-4 h-4" />
                                    Saved!
                                </>
                            ) : (
                                'Save'
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Error Alert */}
                {error && (
                    <div className="alert alert-error">
                        <ExclamationTriangleIcon className="w-5 h-5" />
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="btn btn-ghost btn-xs">
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Profile Section */}
                <section className="bg-base-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <UserCircleIcon className="w-6 h-6 text-primary-400" />
                        <h2 className="text-lg font-bold">Profile</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold">
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
                        <div className="flex-1 space-y-3">
                            <div>
                                <label className="text-sm text-slate-400 block mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => {
                                        setFullName(e.target.value);
                                        setHasChanges(true);
                                    }}
                                    placeholder="Enter your name"
                                    className="input input-bordered w-full bg-base-300"
                                />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <span>{userData?.email}</span>
                                <span className="badge badge-primary badge-sm">{userData?.tier || 'FREE'}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="badge badge-outline">{userData?.totalProcessed || 0} processed</span>
                                <span className="badge badge-outline">{formatBytes(userData?.storageUsedBytes || 0)} used</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Default Preferences */}
                <section className="bg-base-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Cog6ToothIcon className="w-6 h-6 text-primary-400" />
                        <h2 className="text-lg font-bold">Default Preferences</h2>
                    </div>
                    <div className="space-y-6">
                        {/* Default Scale Factor */}
                        <div>
                            <label className="text-sm text-slate-400 block mb-3">Default Scale Factor</label>
                            <div className="grid grid-cols-3 gap-3">
                                {([2, 4, 8] as const).map((factor) => (
                                    <button
                                        key={factor}
                                        onClick={() => updatePreferences({ defaultScaleFactor: factor })}
                                        className={cn(
                                            'p-3 rounded-xl border-2 font-bold text-lg transition-all',
                                            preferences.defaultScaleFactor === factor
                                                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                                : 'border-slate-700 hover:border-slate-600'
                                        )}
                                    >
                                        {factor}x
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Default Quality Mode */}
                        <div>
                            <label className="text-sm text-slate-400 block mb-3">Default Quality Mode</label>
                            <select
                                value={preferences.defaultQualityMode}
                                onChange={(e) => updatePreferences({ defaultQualityMode: e.target.value as UserPreferences['defaultQualityMode'] })}
                                className="select select-bordered w-full bg-base-300"
                            >
                                <option value="fast">Fast - Lower quality, faster processing</option>
                                <option value="balanced">Balanced - Good quality and speed</option>
                                <option value="quality">Quality - Best quality, slower</option>
                            </select>
                        </div>

                        {/* Default Algorithm */}
                        <div>
                            <label className="text-sm text-slate-400 block mb-3">Default Algorithm</label>
                            <select
                                value={preferences.defaultAlgorithm}
                                onChange={(e) => updatePreferences({ defaultAlgorithm: e.target.value as UserPreferences['defaultAlgorithm'] })}
                                className="select select-bordered w-full bg-base-300"
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
                <section className="bg-base-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <PaintBrushIcon className="w-6 h-6 text-primary-400" />
                        <h2 className="text-lg font-bold">Appearance</h2>
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 block mb-3">Theme</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['dark', 'light', 'system'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => updatePreferences({ theme: t })}
                                    className={cn(
                                        'p-3 rounded-xl border-2 font-medium capitalize transition-all',
                                        preferences.theme === t
                                            ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                            : 'border-slate-700 hover:border-slate-600'
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 mt-2">
                            Note: Theme preference will be applied on next page load
                        </p>
                    </div>
                </section>

                {/* Storage Management */}
                <section className="bg-base-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <ServerStackIcon className="w-6 h-6 text-primary-400" />
                        <h2 className="text-lg font-bold">Storage</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Storage Used</span>
                            <span className="font-medium">{formatBytes(userData?.storageUsedBytes || 0)}</span>
                        </div>
                        <div className="w-full h-3 bg-base-300 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, ((userData?.storageUsedBytes || 0) / (1024 * 1024 * 100)) * 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>{formatBytes(userData?.storageUsedBytes || 0)} of 100 MB</span>
                            <span>{userData?.tier === 'FREE' ? 'Free Tier' : userData?.tier}</span>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <TrashIcon className="w-6 h-6 text-red-400" />
                        <h2 className="text-lg font-bold text-red-400">Danger Zone</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Clear History</h3>
                                <p className="text-sm text-slate-400">Delete all processing history and reset storage</p>
                            </div>
                            <button
                                onClick={handleClearHistory}
                                className="btn btn-outline btn-error"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
