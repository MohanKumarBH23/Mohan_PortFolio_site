import { useEffect } from 'react';

/**
 * Shared accessible dialog lifecycle hook handling Escape key dismissal,
 * background scroll locking, and focus restoration upon close.
 */
export function useModalLifecycle(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);
}

