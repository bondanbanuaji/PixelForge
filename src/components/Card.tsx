'use client'
import { motion } from 'framer-motion'

export function Card() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-surface border border-border shadow-lg hover:shadow-xl"
        >
            <h2 className="text-2xl font-bold text-text-primary mb-2">
                Upscale Image
            </h2>
            <p className="text-text-secondary mb-4">
                Upload your image to get started
            </p>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium shadow-md"
            >
                Upload Image
            </motion.button>
        </motion.div>
    )
}
