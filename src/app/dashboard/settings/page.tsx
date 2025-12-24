'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    PaintBrushIcon,
    ServerStackIcon,
    TrashIcon,
    CheckIcon,
} from '@heroicons/react/24/outline';
import { useProcessingStore, type ScaleFactor, type QualityMode, type Algorithm } from '@/stores/processing';
import { formatBytes, cn } from '@/lib/utils';

export default function SettingsPage() {
    const { config, setConfig, storageUsed, totalProcessed, clearHistory } = useProcessingStore();
    const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
    const [showSaved, setShowSaved] = useState(false);

    const handleSave = () => {
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
    };

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
                        <button onClick={handleSave} className="btn btn-primary btn-sm gap-2">
                            {showSaved ? (
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
                {/* Profile Section */}
                <section className="bg-base-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <UserCircleIcon className="w-6 h-6 text-primary-400" />
                        <h2 className="text-lg font-bold">Profile</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold">
                            PF
                        </div>
                        <div>
                            <h3 className="text-xl font-medium">PixelForge User</h3>
                            <p className="text-slate-400">Free Tier</p>
                            <div className="mt-2 flex gap-2">
                                <span className="badge badge-primary">{totalProcessed} processed</span>
                                <span className="badge badge-secondary">{formatBytes(storageUsed)} used</span>
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
                                {([2, 4, 8] as ScaleFactor[]).map((factor) => (
                                    <button
                                        key={factor}
                                        onClick={() => setConfig({ scaleFactor: factor })}
                                        className={cn(
                                            'p-3 rounded-xl border-2 font-bold text-lg transition-all',
                                            config.scaleFactor === factor
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
                                value={config.qualityMode}
                                onChange={(e) => setConfig({ qualityMode: e.target.value as QualityMode })}
                                className="select select-bordered w-full bg-base-300"
                            >
                                <option value="fast">Fast - Lower quality, faster processing</option>
                                <option value="balanced">Balanced - Good quality and speed</option>
                                <option value="quality">Quality - Best quality, slower</option>
                            </select>
                        </div>

                        {/* Default Algorithm */}
                        <div>
                            <label className="text-sm text-slate-400 block mb-3">Default Downscale Algorithm</label>
                            <select
                                value={config.algorithm}
                                onChange={(e) => setConfig({ algorithm: e.target.value as Algorithm })}
                                className="select select-bordered w-full bg-base-300"
                            >
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
                                    onClick={() => setTheme(t)}
                                    className={cn(
                                        'p-3 rounded-xl border-2 font-medium capitalize transition-all',
                                        theme === t
                                            ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                            : 'border-slate-700 hover:border-slate-600'
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 mt-2">
                            Note: Currently only dark theme is available
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
                            <span className="font-medium">{formatBytes(storageUsed)}</span>
                        </div>
                        <div className="w-full h-3 bg-base-300 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                                style={{ width: `${Math.min(100, (storageUsed / (1024 * 1024 * 100)) * 100)}%` }}
                            />
                        </div>
                        <p className="text-sm text-slate-500">Using local browser storage</p>
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
                                <p className="text-sm text-slate-400">Delete all processing history</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure? This cannot be undone.')) {
                                        clearHistory();
                                    }
                                }}
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
