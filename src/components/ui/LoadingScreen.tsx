"use client";

import { motion } from 'framer-motion';

interface LoadingScreenProps {
  show?: boolean;
}

export default function LoadingScreen({ show = true }: LoadingScreenProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-white tracking-wider"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          LUXE
        </motion.h1>
        
        <motion.div
          className="mt-4 w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}
