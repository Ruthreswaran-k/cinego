import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps { isOpen: boolean; onClose: () => void; children: React.ReactNode; title?: string; }

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        />

        {/* Centering Flex Container */}
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg glass-card rounded-2xl border border-white/10 p-6 sm:p-7 shadow-2xl text-left my-auto overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              {title ? (
                <h2 className="text-xl font-display font-semibold text-white">{title}</h2>
              ) : (
                <div />
              )}
              <button
                onClick={onClose}
                className="rounded-full p-1.5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      </div>
    )}
  </AnimatePresence>
);
