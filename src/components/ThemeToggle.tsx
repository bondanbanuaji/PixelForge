'use client'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <motion.button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative p-3 rounded-xl bg-surface border border-border hover:scale-105 active:scale-95"
            whileHover={{ rotate: 15 }}
            whileTap={{ scale: 0.9 }}
        >
            <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                    <motion.div
                        key="moon"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <Moon className="w-5 h-5 text-primary" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <Sun className="w-5 h-5 text-primary" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    )
}
