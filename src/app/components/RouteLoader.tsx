'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function RouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Matikan loading spinner begitu route selesai berpindah/dirender
    setIsLoading(false);
  }, [pathname, searchParams]);

  // Kita bisa intersep klik pada tag <a> untuk memicu loading secara manual
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor) {
        const href = anchor.getAttribute('href');
        const targetAttr = anchor.getAttribute('target');

        // Pastikan link valid, internal, dan bukan link kosong/hash
        if (
          href &&
          href.startsWith('/') &&
          !href.startsWith('#') &&
          targetAttr !== '_blank'
        ) {
          const currentUrl = window.location.pathname + window.location.search;
          const targetUrl = href.split('#')[0];

          // Hanya jalankan loading jika rute tujuan berbeda dengan rute saat ini
          if (currentUrl !== targetUrl) {
            setIsLoading(true);
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-300">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-5 shadow-2xl dark:bg-zinc-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 animate-pulse">
          Memuat halaman...
        </p>
      </div>
    </div>
  );
}
