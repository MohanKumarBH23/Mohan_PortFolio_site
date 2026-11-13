import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind utility class names deterministically.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

