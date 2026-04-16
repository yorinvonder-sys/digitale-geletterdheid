import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface MilestoneToastProps {
    show: boolean;
    completedCount: number;
    totalCount: number;
}

export const MilestoneToast: React.FC<MilestoneToastProps> = ({ show, completedCount, totalCount }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] px-4 py-2 rounded-full text-sm font-bold"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                ✓ {completedCount}/{totalCount} voltooid!
            </motion.div>
        )}
    </AnimatePresence>
);
