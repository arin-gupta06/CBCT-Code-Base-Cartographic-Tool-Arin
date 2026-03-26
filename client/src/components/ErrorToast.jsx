import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useStore } from '../store/useStore';

/**
 * Global error toast that displays async API errors
 * from the Zustand store's apiError state.
 */
export default function ErrorToast() {
  const { apiError, clearApiError } = useStore();

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!apiError) return;
    const timer = setTimeout(() => clearApiError(), 8000);
    return () => clearTimeout(timer);
  }, [apiError, clearApiError]);

  return (
    <AnimatePresence>
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-md"
        >
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-4 shadow-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-red-400 mb-0.5">Error</h4>
              <p className="text-xs text-red-300/80 break-words">{apiError}</p>
            </div>
            <button
              onClick={clearApiError}
              className="p-1 hover:bg-white/10 rounded-lg text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
