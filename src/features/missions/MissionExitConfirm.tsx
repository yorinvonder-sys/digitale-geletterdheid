import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, ArrowLeft } from 'lucide-react';

interface MissionExitConfirmProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  hasUnsavedProgress?: boolean;
}

export const MissionExitConfirm: React.FC<MissionExitConfirmProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  hasUnsavedProgress = true,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-duck-ink/40 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl border border-duck-gray shadow-2xl w-full max-w-sm p-6 space-y-5"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-duck-bg flex items-center justify-center mx-auto">
              <LogOut size={24} className="text-duck-acid" />
            </div>

            {/* Text */}
            <div className="text-center space-y-2">
              <h3
                className="text-lg font-black text-duck-ink/60"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
              >
                Missie verlaten?
              </h3>
              <p
                className="text-sm text-duck-ink/60 leading-relaxed"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
              >
                {hasUnsavedProgress
                  ? 'Je voortgang wordt automatisch opgeslagen. Je kunt later verder waar je gebleven bent.'
                  : 'Je voortgang is opgeslagen.'}
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={onCancel}
                className="w-full py-3 bg-duck-acid hover:bg-duck-acid text-duck-ink rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Terug naar missie
              </button>
              <button
                onClick={onConfirm}
                className="w-full py-3 bg-transparent border border-duck-gray hover:bg-duck-bg text-duck-ink/60 hover:text-duck-ink/60 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98]"
              >
                Verlaten
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
