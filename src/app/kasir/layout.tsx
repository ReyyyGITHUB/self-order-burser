"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import KasirSidebar from "./_components/KasirSidebar";
import KasirTopbar from "./_components/KasirTopbar";

export default function KasirLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--surface-container-low)] font-sans">
      <KasirSidebar currentPath={pathname} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <KasirTopbar isOnline={isOnline} />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
