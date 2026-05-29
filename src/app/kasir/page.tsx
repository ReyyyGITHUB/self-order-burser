"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import OrderQueuePanel from "./_components/OrderQueuePanel";
import OrderDetailPanel from "./_components/OrderDetailPanel";
import QuickAddPanel from "./_components/QuickAddPanel";
import CameraModal from "./_components/CameraModal";
import CashPaymentModal from "./_components/CashPaymentModal";

export type OrderStatus = "PENDING_PAYMENT" | "CONFIRMED" | "PROCESSING" | "COMPLETED" | "CANCELLED";
export type PaymentMethod = "CASH" | "QRIS";
export type PaymentStatus = "UNPAID" | "PAID";

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  spicyLevel: number;
  notes: string;
  subtotal: number;
  menuItem: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
}

export interface Order {
  id: string;
  tableId: string;
  kasirId: string | null;
  customerName: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  pgTransactionId: string | null;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  table: { tableNumber: number };
  orderItems: OrderItem[];
}

export default function KasirPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ACTIVE");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [queueWidth, setQueueWidth] = useState(300); // Lebar antrean dinamis

  const activeOrder = orders.find((o) => o.id === activeOrderId) ?? null;

  // Handler resize mouse drag
  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startWidth = queueWidth;
    const startX = mouseDownEvent.clientX;

    const doDrag = (mouseMoveEvent: MouseEvent) => {
      const newWidth = startWidth + (mouseMoveEvent.clientX - startX);
      if (newWidth >= 240 && newWidth <= 480) {
        setQueueWidth(newWidth);
      }
    };

    const stopDrag = () => {
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };



  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) return;
      const data: Order[] = await res.json();
      setOrders(data);
      if (!activeOrderId && data.length > 0) {
        const first = data.find(
          (o) => o.status !== "COMPLETED" && o.status !== "CANCELLED"
        );
        if (first) setActiveOrderId(first.id);
      }
    } catch (err) {
      console.error("Gagal fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [activeOrderId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders();
          // Play notification sound on INSERT
          try {
            const audio = new Audio("/sounds/new-order.mp3");
            audio.volume = 0.6;
            audio.play().catch(() => {});
          } catch {}
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  // QR scan result handler
  const handleQRScan = (orderId: string) => {
    setIsCameraOpen(false);
    setActiveOrderId(orderId);
    const scannedOrder = orders.find((o) => o.id === orderId);
    if (
      scannedOrder &&
      scannedOrder.paymentMethod === "CASH" &&
      scannedOrder.paymentStatus === "UNPAID"
    ) {
      setTimeout(() => setIsCashModalOpen(true), 300);
    }
  };

  // Update order status
  const updateOrderStatus = async (
    orderId: string,
    updates: Partial<Pick<Order, "status" | "paymentStatus" | "kasirId">>
  ) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      await fetchOrders();
    } catch (err) {
      console.error("Gagal update order:", err);
    }
  };

  // Filter orders for display
  const filteredOrders = orders.filter((o) => {
    if (filterStatus === "ACTIVE") return o.status !== "COMPLETED" && o.status !== "CANCELLED";
    if (filterStatus === "PENDING_PAYMENT") return o.paymentStatus === "UNPAID";
    if (filterStatus === "PROCESSING") return o.status === "PROCESSING";
    if (filterStatus === "COMPLETED") return o.status === "COMPLETED";
    return true;
  });

  return (
    <div className="flex h-full w-full overflow-hidden select-none">
      {/* Panel Kiri: Queue */}
      <OrderQueuePanel
        orders={filteredOrders}
        activeOrderId={activeOrderId}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onSelectOrder={setActiveOrderId}
        onOpenCamera={() => setIsCameraOpen(true)}
        loading={loading}
        totalActive={orders.filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED").length}
        width={queueWidth}
      />

      {/* Resize Handle Splitter */}
      <div
        onMouseDown={startResizing}
        className="w-1.5 shrink-0 bg-transparent hover:bg-[var(--primary)] active:bg-[var(--primary)] cursor-col-resize transition-colors relative z-10 flex items-center justify-center group"
      >
        <div className="w-[2px] h-8 bg-[var(--outline-variant)] group-hover:bg-white group-active:bg-white rounded" />
      </div>

      {/* Panel Tengah: Detail */}
      <OrderDetailPanel
        order={activeOrder}
        onUpdateStatus={updateOrderStatus}
        onOpenCashModal={() => setIsCashModalOpen(true)}
      />

      {/* Panel Kanan: Quick Add */}
      <QuickAddPanel 
        onOrderCreated={fetchOrders} 
        isOpen={isQuickAddOpen}
        onToggle={() => setIsQuickAddOpen(!isQuickAddOpen)}
      />

      {/* Modal Kamera */}
      {isCameraOpen && (
        <CameraModal
          onClose={() => setIsCameraOpen(false)}
          onScan={handleQRScan}
        />
      )}

      {/* Modal Bayar Cash */}
      {isCashModalOpen && activeOrder && (
        <CashPaymentModal
          order={activeOrder}
          onClose={() => setIsCashModalOpen(false)}
          onConfirm={async () => {
            await updateOrderStatus(activeOrder.id, {
              paymentStatus: "PAID",
              status: "CONFIRMED",
              kasirId: "kasir-placeholder-id",
            });
            setIsCashModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
