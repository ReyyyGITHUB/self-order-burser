"use client";

import { useState, useCallback } from "react";
import type { Order } from "../page";
import { Banknote, X, RotateCcw, Delete } from "lucide-react";

interface CashPaymentModalProps {
  order: Order;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

interface DenomEntry {
  value: number;
  count: number;
}

const DENOMINATIONS = [1000, 2000, 5000, 10000, 20000, 50000, 100000];

function formatRp(val: number): string {
  if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}jt`;
  if (val >= 1000) return `Rp ${val / 1000}rb`;
  return `Rp ${val}`;
}

export default function CashPaymentModal({ order, onClose, onConfirm }: CashPaymentModalProps) {
  const [stack, setStack] = useState<DenomEntry[]>([]);
  const [confirming, setConfirming] = useState(false);

  const totalTagihan = Number(order.totalAmount);
  const totalDiterima = stack.reduce((s, e) => s + e.value * e.count, 0);
  const kembalian = totalDiterima - totalTagihan;
  const cukup = totalDiterima >= totalTagihan;

  const pushDenom = useCallback((val: number) => {
    setStack((prev) => {
      const existing = prev.find((e) => e.value === val);
      if (existing) {
        return prev.map((e) => (e.value === val ? { ...e, count: e.count + 1 } : e));
      }
      return [...prev, { value: val, count: 1 }];
    });
  }, []);

  const popLast = useCallback(() => {
    setStack((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last.count > 1) {
        return prev.map((e, i) => (i === prev.length - 1 ? { ...e, count: e.count - 1 } : e));
      }
      return prev.slice(0, -1);
    });
  }, []);

  const handleConfirm = async () => {
    if (!cukup) return;
    setConfirming(true);
    await onConfirm();
    setConfirming(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[var(--outline-variant)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary-container)] flex items-center justify-center">
              <Banknote size={16} className="text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--on-surface)]">Konfirmasi Pembayaran Cash</p>
              <p className="text-[10px] text-[var(--muted-text)]">
                #{order.id} · Meja {order.table.tableNumber} · {order.customerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--muted-text)] hover:bg-[var(--surface-container-high)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Summary */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[var(--surface-container)]">
            <div>
              <p className="text-[10px] text-[var(--muted-text)]">Total tagihan</p>
              <p className="text-xl font-headline font-bold text-[var(--on-surface)]">
                Rp {totalTagihan.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[var(--muted-text)]">Uang diterima</p>
              <p className={`text-xl font-headline font-bold ${cukup ? "text-[var(--tertiary)]" : "text-[var(--error)]"}`}>
                Rp {totalDiterima.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Kembalian */}
          <div
            className={`flex items-center justify-between mt-2 px-4 py-2.5 rounded-xl border ${
              cukup
                ? "border-[var(--tertiary-fixed-dim)] bg-[var(--tertiary-container)]"
                : "border-orange-200 bg-orange-50"
            }`}
          >
            <span className={`text-xs font-semibold ${cukup ? "text-[var(--on-tertiary-container)]" : "text-orange-700"}`}>
              {cukup ? "✓ Kembalian" : `⚠ Kurang`}
            </span>
            <span className={`text-base font-bold font-headline ${cukup ? "text-[var(--on-tertiary-container)]" : "text-orange-700"}`}>
              {cukup
                ? `Rp ${kembalian.toLocaleString("id-ID")}`
                : `Rp ${Math.abs(kembalian).toLocaleString("id-ID")}`}
            </span>
          </div>
        </div>

        {/* Denomination Buttons */}
        <div className="px-6 py-3">
          <p className="text-[10px] font-semibold text-[var(--muted-text)] uppercase tracking-widest mb-2">
            Nominal Uang
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DENOMINATIONS.slice(0, 6).map((val) => (
              <button
                key={val}
                onClick={() => pushDenom(val)}
                className="py-2.5 rounded-xl text-xs font-bold border border-[var(--outline-variant)] bg-white hover:bg-[var(--primary-container)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all active:scale-95"
              >
                {formatRp(val)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => pushDenom(100000)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-[var(--outline-variant)] bg-white hover:bg-[var(--primary-container)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all active:scale-95"
            >
              Rp 100rb
            </button>
            <button
              onClick={popLast}
              className="flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--outline-variant)] text-[var(--muted-text)] hover:bg-[var(--error-container)] hover:text-[var(--error)] hover:border-[var(--error)] transition-all active:scale-95"
            >
              <Delete size={13} /> Hapus
            </button>
            <button
              onClick={() => setStack([])}
              className="flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--outline-variant)] text-[var(--muted-text)] hover:bg-[var(--surface-container-high)] transition-all active:scale-95"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        </div>

        {/* Stack Display */}
        <div className="px-6 pb-3 min-h-[2.5rem]">
          {stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-[var(--muted-text)]">Dimasukkan:</span>
              {stack.map((entry) => (
                <span
                  key={entry.value}
                  className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-[var(--primary-container)] text-[var(--primary)]"
                >
                  {formatRp(entry.value)}
                  {entry.count > 1 && ` ×${entry.count}`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold border border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] transition-colors"
          >
            Batalkan
          </button>
          <button
            onClick={handleConfirm}
            disabled={!cukup || confirming}
            className={`flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-sm ${
              cukup
                ? "bg-[var(--tertiary)] hover:bg-[var(--on-tertiary-fixed-variant)] active:scale-[0.98]"
                : "bg-[var(--outline-variant)] cursor-not-allowed"
            } disabled:opacity-60`}
          >
            {confirming ? "Memproses..." : "✓ Konfirmasi & Cetak"}
          </button>
        </div>
      </div>
    </div>
  );
}
