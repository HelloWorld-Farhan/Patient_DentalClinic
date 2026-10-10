import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastNotificationProps {
  message: string | null;
  onClose: () => void;
  type?: 'success' | 'info' | 'error';
}

export default function ToastNotification({ message, onClose, type = 'success' }: ToastNotificationProps) {
  if (!message || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[10000] max-w-md bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-teal-500/30 flex items-center justify-between gap-3 pointer-events-auto"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
              <span className="material-symbols-outlined text-[20px]">
                {type === 'error' ? 'error' : 'task_alt'}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-100 leading-snug break-words">
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss notification"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
