import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import type { ToastState } from '../../hooks/usePortfolioServices';

export interface ToastBannerProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

/**
 * Anchored bottom-right rubric confirmation notice styled as an archival stamped slip.
 */
export function ToastBanner({ toast, onDismiss }: ToastBannerProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18 }}
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 border border-[#0F100F] bg-[#F8F5E8] px-4 py-3"
        >
          <span
            className={`h-[8px] w-[8px] shrink-0 ${
              toast.tone === 'error' ? 'bg-[#7D2412]' : 'bg-[#B3371E]'
            }`}
            aria-hidden="true"
          />
          <span
            className="font-mono text-[12px] text-[#0F100F]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {toast.message}
          </span>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="cursor-pointer ml-1 inline-flex h-[24px] w-[24px] items-center justify-center border border-[#C5C2B9] bg-transparent text-[#434440] hover:border-[#0F100F] hover:text-[#0F100F] transition-colors"
          >
            <X size={12} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
