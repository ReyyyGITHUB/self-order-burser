"use client";

import { useEffect, useState } from "react";
import type { Order } from "../page";
import {
  Banknote,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
  Receipt,
} from "lucide-react";

export default function RiwayatPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders?status=COMPLETED")
      .then((r) => r.json())
      .then((data: Order[]) => {
        const today = new Date().toDateString();
        setOrders(data.filter((o) => new Date(o.createdAt).toDateString() === today));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((s, o) => s + Number(o.totalAmount), 0);

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-headline font-bold text-[var(--on-surface)]">Riwayat Shift</h1>
          <p className="text-sm text-[var(--muted-text)]">
            Transaksi hari ini ·{" "}
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Total Transaksi",
              value: orders.length,
              unit: "pesanan",
              color: "text-[var(--primary)]",
            },
            {
              label: "Total Pendapatan",
              value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
              unit: "",
              color: "text-[var(--tertiary)]",
            },
            {
              label: "Pembayaran Cash",
              value: orders.filter((o) => o.paymentMethod === "CASH").length,
              unit: "transaksi",
              color: "text-orange-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl border border-[var(--outline-variant)] px-5 py-4"
            >
              <p className="text-xs text-[var(--muted-text)] mb-1">{item.label}</p>
              <p className={`text-xl font-bold font-headline ${item.color}`}>{item.value}</p>
              {item.unit && <p className="text-[10px] text-[var(--muted-text)]">{item.unit}</p>}
            </div>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-[var(--outline-variant)] overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_6rem_6rem_6rem] gap-3 px-5 py-3 bg-[var(--surface-container)] text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">
            <span>Order</span>
            <span>Pelanggan</span>
            <span>Bayar</span>
            <span className="text-right">Total</span>
            <span className="text-right">Status</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 size={20} className="animate-spin text-[var(--muted-text)]" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <Receipt size={24} className="text-[var(--outline-variant)]" />
              <p className="text-xs text-[var(--muted-text)]">Belum ada transaksi hari ini</p>
            </div>
          ) : (
            orders.map((order, idx) => (
              <div
                key={order.id}
                className={`grid grid-cols-[1fr_1fr_6rem_6rem_6rem] gap-3 px-5 py-3.5 items-center text-sm ${
                  idx < orders.length - 1 ? "border-b border-[var(--outline-variant)]" : ""
                }`}
              >
                <div>
                  <p className="font-bold text-[var(--on-surface)]">#{order.id}</p>
                  <p className="text-[10px] text-[var(--muted-text)]">Meja {order.table.tableNumber}</p>
                </div>
                <p className="text-xs text-[var(--on-surface-variant)] truncate">{order.customerName}</p>
                <div className="flex items-center gap-1">
                  {order.paymentMethod === "CASH" ? (
                    <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 font-medium">
                      <Banknote size={10} /> Cash
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">
                      <Zap size={10} /> QRIS
                    </span>
                  )}
                </div>
                <p className="text-right text-xs font-semibold text-[var(--on-surface)]">
                  Rp {Number(order.totalAmount).toLocaleString("id-ID")}
                </p>
                <div className="flex justify-end">
                  {order.status === "COMPLETED" ? (
                    <span className="flex items-center gap-0.5 text-[10px] font-medium text-[var(--tertiary)]">
                      <CheckCircle2 size={10} /> Selesai
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-[10px] font-medium text-[var(--error)]">
                      <XCircle size={10} /> Batal
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
