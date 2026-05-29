"use client";

import { useEffect, useState } from "react";
import type { Order } from "../page";
import {
  Banknote,
  Zap,
  Printer,
  ChefHat,
  CheckCircle2,
  XCircle,
  Flame,
  FileText,
  Table2,
  Timer,
  Loader2,
} from "lucide-react";

interface OrderDetailPanelProps {
  order: Order | null;
  onUpdateStatus: (id: string, updates: any) => Promise<void>;
  onOpenCashModal: () => void;
}

function ElapsedTimer({ createdAt }: { createdAt: string }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const calc = () =>
      setElapsed(Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
    calc();
    const iv = setInterval(calc, 1000);
    return () => clearInterval(iv);
  }, [createdAt]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const color =
    mins < 5 ? "text-[var(--tertiary)]" : mins < 10 ? "text-orange-500" : "text-[var(--error)]";

  return (
    <span
      className={`flex items-center gap-1 font-mono font-bold text-sm ${color} bg-[var(--surface-container)] px-2.5 py-1 rounded-lg`}
    >
      <Timer size={13} />
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </span>
  );
}

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "Menunggu Bayar",
  CONFIRMED: "Terkonfirmasi",
  PROCESSING: "Sedang Diproses",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const statusColor: Record<string, string> = {
  PENDING_PAYMENT: "bg-orange-100 text-orange-700",
  CONFIRMED: "bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)]",
  PROCESSING: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-[var(--surface-container-high)] text-[var(--muted-text)]",
  CANCELLED: "bg-[var(--error-container)] text-[var(--error)]",
};

export default function OrderDetailPanel({
  order,
  onUpdateStatus,
  onOpenCashModal,
}: OrderDetailPanelProps) {
  const [processing, setProcessing] = useState(false);

  if (!order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--surface-container-low)] text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-[var(--surface-container)] flex items-center justify-center mb-4">
          <FileText size={28} className="text-[var(--primary)]" />
        </div>
        <p className="text-sm font-bold text-[var(--on-surface)] mb-1">Tidak ada pesanan terpilih</p>
        <p className="text-xs text-[var(--muted-text)] max-w-xs leading-relaxed">
          Pilih salah satu kartu pesanan dari antrean antrean di sebelah kiri atau ketuk tombol <span className="font-semibold text-[var(--primary)]">Scan QR</span> untuk mulai memproses pembayaran.
        </p>
      </div>
    );
  }

  const handleAction = async (updates: any) => {
    setProcessing(true);
    await onUpdateStatus(order.id, updates);
    setProcessing(false);
  };

  const isCashUnpaid =
    order.paymentMethod === "CASH" && order.paymentStatus === "UNPAID";

  return (
    <div className="flex-1 flex flex-col bg-[var(--surface-container-low)] overflow-hidden">
      {/* Header Order */}
      <div className="px-5 py-4 bg-white border-b border-[var(--outline-variant)]">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-headline font-bold text-[var(--on-surface)]">
                #{order.id}
              </h2>
              <span
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusColor[order.status]}`}
              >
                {statusLabel[order.status]}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--muted-text)]">
              <span className="flex items-center gap-1">
                <Table2 size={12} />
                Meja {order.table.tableNumber}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                {order.paymentMethod === "CASH" ? (
                  <Banknote size={12} />
                ) : (
                  <Zap size={12} />
                )}
                {order.paymentMethod}
              </span>
              <span>·</span>
              <span>{order.customerName}</span>
            </div>
          </div>
          {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
            <ElapsedTimer createdAt={order.createdAt} />
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="bg-white rounded-2xl border border-[var(--outline-variant)] overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2rem_1fr_5rem_5rem] gap-2 px-4 py-2.5 bg-[var(--surface-container)] text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">
            <span>Qty</span>
            <span>Item</span>
            <span className="text-right">Harga</span>
            <span className="text-right">Total</span>
          </div>

          {/* Items */}
          {order.orderItems.map((item, idx) => (
            <div
              key={item.id}
              className={`grid grid-cols-[2rem_1fr_5rem_5rem] gap-2 px-4 py-3 text-sm items-start ${
                idx < order.orderItems.length - 1
                  ? "border-b border-[var(--outline-variant)]"
                  : ""
              }`}
            >
              <span className="font-bold text-[var(--primary)]">{item.quantity}</span>
              <div>
                <p className="font-medium text-[var(--on-surface)]">{item.menuItem.name}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {item.spicyLevel > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium">
                      <Flame size={9} />
                      {["", "Pedas", "Sedang", "Sangat Pedas"][item.spicyLevel]}
                    </span>
                  )}
                  {item.notes && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-container)] text-[var(--on-surface-variant)]">
                      {item.notes}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-right text-[var(--muted-text)] text-xs">
                Rp {Number(item.unitPrice).toLocaleString("id-ID")}
              </span>
              <span className="text-right font-semibold text-[var(--on-surface)] text-xs">
                Rp {Number(item.subtotal).toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: Total + Aksi */}
      <div className="bg-white border-t border-[var(--outline-variant)] px-5 py-4">
        {/* Total */}
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-0.5">
            <p className="text-xs text-[var(--muted-text)]">Total tagihan</p>
            <p className="text-2xl font-headline font-bold text-[var(--on-surface)]">
              Rp {Number(order.totalAmount).toLocaleString("id-ID")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[var(--muted-text)]">{order.orderItems.length} item</p>
            <p
              className={`text-xs font-semibold mt-0.5 ${
                order.paymentStatus === "PAID"
                  ? "text-[var(--tertiary)]"
                  : "text-orange-600"
              }`}
            >
              {order.paymentStatus === "PAID" ? "✓ Lunas" : "Belum Bayar"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 flex-wrap">
          {/* Cetak Bill — selalu ada */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] transition-colors"
          >
            <Printer size={15} />
            Cetak Bill
          </button>

          {/* Konfirmasi Cash */}
          {isCashUnpaid && (
            <button
              onClick={onOpenCashModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-sm"
            >
              <Banknote size={15} />
              Konfirmasi Cash
            </button>
          )}

          {/* Proses → PROCESSING */}
          {order.status === "CONFIRMED" && (
            <button
              onClick={() => handleAction({ status: "PROCESSING" })}
              disabled={processing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors shadow-sm disabled:opacity-60"
            >
              {processing ? <Loader2 size={15} className="animate-spin" /> : <ChefHat size={15} />}
              Proses
            </button>
          )}

          {/* Selesai → COMPLETED */}
          {order.status === "PROCESSING" && (
            <button
              onClick={() => handleAction({ status: "COMPLETED" })}
              disabled={processing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-[var(--tertiary)] hover:bg-[var(--on-tertiary-fixed-variant)] text-white transition-colors shadow-sm disabled:opacity-60"
            >
              {processing ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
              Selesai
            </button>
          )}

          {/* Batalkan */}
          {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
            <button
              onClick={() => handleAction({ status: "CANCELLED" })}
              disabled={processing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border border-[var(--outline-variant)] text-[var(--error)] hover:bg-[var(--error-container)] transition-colors disabled:opacity-60"
            >
              <XCircle size={15} />
              Batalkan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
