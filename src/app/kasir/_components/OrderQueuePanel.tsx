"use client";

import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "../../_utils/timeUtils";
import type { Order } from "../page";
import {
  Banknote,
  Zap,
  Clock,
  ScanLine,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Timer,
} from "lucide-react";

interface OrderQueuePanelProps {
  orders: Order[];
  activeOrderId: string | null;
  filterStatus: string;
  onFilterChange: (s: string) => void;
  onSelectOrder: (id: string) => void;
  onOpenCamera: () => void;
  loading: boolean;
  totalActive: number;
  width: number;
}

const FILTER_TABS = [
  { key: "ACTIVE", label: "Semua aktif" },
  { key: "PENDING_PAYMENT", label: "Belum bayar" },
  { key: "PROCESSING", label: "Proses" },
  { key: "COMPLETED", label: "Selesai" },
];

function StatusBadge({ order }: { order: Order }) {
  const { status, paymentMethod, paymentStatus } = order;

  if (status === "COMPLETED") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-container-high)] text-[var(--muted-text)]">
        <CheckCircle2 size={10} /> Selesai
      </span>
    );
  }
  if (status === "CANCELLED") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--error-container)] text-[var(--error)]">
        Batal
      </span>
    );
  }
  if (status === "PROCESSING") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
        <Loader2 size={10} className="animate-spin" /> Proses
      </span>
    );
  }
  if (status === "CONFIRMED") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)]">
        <CheckCircle2 size={10} /> Terkonfirmasi
      </span>
    );
  }
  // PENDING_PAYMENT
  if (paymentMethod === "CASH") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
        <AlertCircle size={10} /> Tunggu Cash
      </span>
    );
  }
  // QRIS pending
  return (
    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
      <Clock size={10} className="animate-pulse" /> Tunggu QRIS
    </span>
  );
}

function PaymentBadge({ method }: { method: "CASH" | "QRIS" }) {
  return method === "CASH" ? (
    <span className="flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]">
      <Banknote size={10} /> Cash
    </span>
  ) : (
    <span className="flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
      <Zap size={10} /> QRIS
    </span>
  );
}

function OrderTimer({ createdAt }: { createdAt: string }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const calc = () => {
      const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
      setElapsed(diff);
    };
    calc();
    const iv = setInterval(calc, 1000);
    return () => clearInterval(iv);
  }, [createdAt]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const color =
    mins < 5 ? "text-[var(--tertiary)]" : mins < 10 ? "text-orange-500" : "text-[var(--error)]";

  return (
    <span className={`flex items-center gap-0.5 text-[10px] font-mono font-bold ${color}`}>
      <Timer size={10} />
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </span>
  );
}

export default function OrderQueuePanel({
  orders,
  activeOrderId,
  filterStatus,
  onFilterChange,
  onSelectOrder,
  onOpenCamera,
  loading,
  totalActive,
  width,
}: OrderQueuePanelProps) {
  return (
    <div 
      style={{ width: `${width}px` }} 
      className="shrink-0 flex flex-col border-r border-[var(--outline-variant)] bg-white overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[var(--outline-variant)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--on-surface)]">Live Orders</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--primary)] text-white">
              {totalActive}
            </span>
          </div>
          <button
            onClick={onOpenCamera}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-container)] hover:bg-[var(--primary-container)] hover:text-[var(--primary)] transition-colors text-[var(--on-surface-variant)]"
          >
            <ScanLine size={14} />
            Scan QR
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onFilterChange(tab.key)}
              className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                filterStatus === tab.key
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface-container)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 size={20} className="animate-spin text-[var(--muted-text)]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center gap-2">
            <CheckCircle2 size={28} className="text-[var(--outline-variant)]" />
            <p className="text-xs text-[var(--muted-text)]">Tidak ada pesanan aktif</p>
          </div>
        ) : (
          (() => {
            // Filter pembagian khusus jika filter status adalah ACTIVE (Semua Aktif)
            if (filterStatus === "ACTIVE") {
              const cashUnpaid = orders.filter(
                (o) => o.paymentMethod === "CASH" && o.paymentStatus === "UNPAID"
              );
              const otherOrders = orders.filter(
                (o) => !(o.paymentMethod === "CASH" && o.paymentStatus === "UNPAID")
              );

              return (
                <div className="space-y-4">
                  {/* Kelompok A: Tunggu Pembayaran Cash */}
                  {cashUnpaid.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                          Menunggu Uang Cash ({cashUnpaid.length})
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      </div>
                      {cashUnpaid.map((order) => renderOrderCard(order))}
                    </div>
                  )}

                  {/* Separator jika kedua grup ada */}
                  {cashUnpaid.length > 0 && otherOrders.length > 0 && (
                    <div className="relative py-1">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-dashed border-[var(--outline-variant)]"></div>
                      </div>
                      <div className="relative flex justify-center text-[9px] uppercase">
                        <span className="bg-white px-2 text-[var(--muted-text)] font-semibold">Proses & Lainnya</span>
                      </div>
                    </div>
                  )}

                  {/* Kelompok B: Pesanan Diproses & Lunas */}
                  {otherOrders.length > 0 && (
                    <div className="space-y-2">
                      {cashUnpaid.length > 0 && (
                        <div className="px-1">
                          <span className="text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-wider">
                            Pesanan Aktif ({otherOrders.length})
                          </span>
                        </div>
                      )}
                      {otherOrders.map((order) => renderOrderCard(order))}
                    </div>
                  )}
                </div>
              );
            }

            // Default render untuk tab filter lain
            return orders.map((order) => renderOrderCard(order));
          })()
        )}
      </div>
    </div>
  );

  // Helper render kartu pesanan agar kodenya reusable dan rapi
  function renderOrderCard(order: Order) {
    const isActive = order.id === activeOrderId;
    const needsAction =
      order.paymentMethod === "CASH" && order.paymentStatus === "UNPAID";
    const previewItems = order.orderItems
      .slice(0, 2)
      .map((i) => `${i.quantity}× ${i.menuItem.name}`)
      .join(", ");

    return (
      <button
        key={order.id}
        onClick={() => onSelectOrder(order.id)}
        className={`w-full text-left p-3 rounded-xl border transition-all duration-150 ${
          isActive
            ? "border-[var(--primary)] bg-[var(--primary-container)] shadow-sm font-medium"
            : needsAction
            ? "border-orange-200 bg-orange-50/70 hover:border-orange-300"
            : "border-[var(--outline-variant)] bg-white hover:bg-[var(--surface-container-low)]"
        }`}
      >
        <div className="flex items-start justify-between gap-1 mb-1.5">
          <span className="text-xs font-bold text-[var(--on-surface)]">#{order.id}</span>
          <StatusBadge order={order} />
        </div>

        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <PaymentBadge method={order.paymentMethod} />
            <span className="text-[10px] text-[var(--muted-text)]">
              Meja {order.table.tableNumber}
            </span>
          </div>
          {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
            <OrderTimer createdAt={order.createdAt} />
          )}
        </div>

        <p className="text-[11px] text-[var(--on-surface-variant)] truncate">
          {previewItems}
          {order.orderItems.length > 2 && ` +${order.orderItems.length - 2} lainnya`}
        </p>
      </button>
    );
  }
}
