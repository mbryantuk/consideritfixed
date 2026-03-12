'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminShortcuts({ isAdmin }: { isAdmin?: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      // Quick Nav: G + [key]
      if (e.key.toLowerCase() === 'd') router.push('/admin');
      if (e.key.toLowerCase() === 's') router.push('/admin/stock');
      if (e.key.toLowerCase() === 't') router.push('/admin/testimonials');
      if (e.key.toLowerCase() === 'h') router.push('/');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, router]);

  return null; // Invisible helper
}