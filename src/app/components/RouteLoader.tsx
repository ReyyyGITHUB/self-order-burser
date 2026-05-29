'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function RouteLoaderContent() {
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
    </div>
  );
}

export default function RouteLoader() {
  return (
    <Suspense fallback={null}>
      <RouteLoaderContent />
    </Suspense>
  );
}
