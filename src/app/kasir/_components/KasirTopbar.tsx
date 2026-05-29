import { useState, useEffect } from "react";
import { Wifi, WifiOff, ChevronDown } from "lucide-react";

interface KasirTopbarProps {
  isOnline: boolean;
}

const now = new Date();
const dateLabel = now.toLocaleDateString("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function KasirTopbar({ isOnline }: KasirTopbarProps) {
  const [userName, setUserName] = useState("Kasir");

  useEffect(() => {
    const savedName = sessionStorage.getItem("kasir_name");
    if (savedName) setUserName(savedName);
  }, []);

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-[var(--outline-variant)] bg-white shrink-0">
      <div>
        <p className="text-sm font-semibold text-[var(--on-surface)]">Cabang Utama — Kasir 1</p>
        <p className="text-xs text-[var(--muted-text)]">{dateLabel}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Status Koneksi */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            isOnline
              ? "bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)] border-[var(--tertiary-fixed-dim)]"
              : "bg-[var(--error-container)] text-[var(--on-error-container)] border-[var(--error-container)]"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-[var(--tertiary)] animate-pulse" : "bg-[var(--error)]"}`}
          />
          {isOnline ? "Online" : "Offline"}
          {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
        </div>

        {/* Avatar */}
        <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-[var(--surface-container)] transition-colors">
          <div className="w-7 h-7 rounded-full bg-[var(--primary-container)] flex items-center justify-center">
            <span className="text-xs font-bold text-[var(--primary)]">{userName[0]}</span>
          </div>
          <span className="text-sm font-medium text-[var(--on-surface)]">{userName}</span>
          <ChevronDown size={14} className="text-[var(--muted-text)]" />
        </button>
      </div>
    </header>
  );
}
