import { useEffect } from 'react';

/**
 * Custom hook to lock body scrolling whenever a modal or popup is active.
 * Restores original scroll behavior automatically when the modal closes.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isLocked) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow === 'hidden' ? '' : originalOverflow;
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isLocked]);
}
