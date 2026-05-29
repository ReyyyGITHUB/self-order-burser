"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, Clock, Calendar, Hash, Receipt, ArrowRight, Utensils } from "lucide-react";

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  spicyLevel?: number;
  notes?: string;
}

export default function ReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params?.id || "03";

  const [mounted, setMounted] = useState(false);
  const [customerName, setCustomerName] = useState("Pelanggan");
  const [totalAmount, setTotalAmount] = useState(25000);
  const [orderId, setOrderId] = useState("BJR-082");
  const [paymentMethod, setPaymentMethod] = useState("QRIS");
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderTime, setOrderTime] = useState("");
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Set current date & time
    const now = new Date();
    setOrderTime(now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }) + " WIB");

    // Load paid order details from historical session cache
    const pendingOrderStr = localStorage.getItem("pending_order_mitigation");
    const activeCacheStr = localStorage.getItem("pending_order_mitigation"); // We keep it in cache for verification

    if (!pendingOrderStr) {
      // Jika tidak ada data transaksi aktif di cache, usir langsung ke menu
      console.warn("Akses ditolak: Tidak ada detail transaksi.");
      router.push(`/table/${tableId}`);
      return;
    }

    try {
      const pendingOrder = JSON.parse(pendingOrderStr);
      const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
      const txId = pendingOrder.orderId;

      // Ambil cache QRIS untuk verifikasi ID transaksi asli Louvin
      let louvinTxId = "";
      const qrisCacheStr = localStorage.getItem(`qris_cache_${txId}`);
      if (qrisCacheStr) {
        const qrisCache = JSON.parse(qrisCacheStr);
        louvinTxId = qrisCache.transactionId;
      }

      // MILITARY-GRADE GUARD: Validasi langsung status pembayaran di server gateway!
      const verifyPaymentOnServer = async () => {
        try {
          // Jika mode demo aktif, selalu loloskan verifikasi struk untuk kelancaran testing
          if (isDemoMode) {
            setVerifying(false);
            return;
          }

          if (!louvinTxId) {
            throw new Error("ID Transaksi Louvin tidak ditemukan di cache.");
          }

          const res = await fetch(`/api/payment/status?id=${louvinTxId}`);
          if (!res.ok) throw new Error("Gagal verifikasi pembayaran di server.");

          const data = await res.json();
          if (data.success && data.transaction.status === "settled") {
            // Sukses bayar! Loloskan verifikasi
            setVerifying(false);
          } else {
            throw new Error("Transaksi belum lunas di server.");
          }
        } catch (err) {
          console.error("Payment Guard Blocked Access:", err);
          // Hancurkan semua sesi karena terdeteksi fraud/bypass ilegal
          localStorage.removeItem("cart_items");
          localStorage.removeItem("pending_order_mitigation");
          if (qrisCacheStr) localStorage.removeItem(`qris_cache_${txId}`);
          
          alert("Akses Ditolak: Pembayaran Anda belum terverifikasi secara sah di server.");
          router.push(`/table/${tableId}`);
        }
      };

      verifyPaymentOnServer();

      setTotalAmount(pendingOrder.total || 25000);
      setOrderId(pendingOrder.orderId || `BJR-${Date.now().toString().slice(-3)}`);
      setPaymentMethod(pendingOrder.paymentMethod === "qris" ? "QRIS / E-Wallet" : "Kasir (Tunai)");
      setItems(pendingOrder.items || []);

      const savedName = localStorage.getItem("customer_name");
      if (savedName) {
        setCustomerName(savedName);
      }

      // Pasang flag sukses untuk mengaktifkan Cart Force-Purge Guard di halaman lain
      localStorage.setItem("payment_completed_flag", "true");

    } catch (e) {
      console.error("Error parsing pending order:", e);
      router.push(`/table/${tableId}`);
    }
  }, []);

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTax = () => {
    return 0; // Pajak gratis (dicoret di UI)
  };

  // Bersihkan cache keranjang saat user menekan tombol "Pesan Lagi" untuk keluar dari halaman struk
  const handleExitReceipt = () => {
    localStorage.removeItem("cart_items");
    localStorage.removeItem("pending_order_mitigation");
    localStorage.removeItem("payment_completed_flag");
    router.push(`/table/${tableId}`);
  };

  if (!mounted || verifying) {
    return (
      <div className="flex-grow flex items-center justify-center bg-page-bg min-h-screen flex-col gap-3">
        <div className="w-8 h-8 border-4 border-[#825429] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-text-secondary font-semibold font-mono animate-pulse">Memverifikasi keamanan struk...</p>
      </div>
    );
  }

  return (
    <div className="bg-page-bg min-h-screen flex flex-col font-sans text-on-surface w-full max-w-md mx-auto shadow-lg relative overflow-y-auto pb-8">
      {/* Header Success Animation (Harmonized, Transparent, Earthy beige backdrop) */}
      <section className="p-6 pt-8 flex flex-col items-center text-center gap-3 flex-shrink-0">
        <div className="w-14 h-14 bg-[#4a7c6d]/10 border border-[#4a7c6d]/20 rounded-full flex items-center justify-center text-[#4a7c6d] animate-bounce shadow-sm">
          <Check className="w-7 h-7 stroke-[3]" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold text-text-primary">Pembayaran Berhasil!</h2>
          <p className="text-[10px] text-muted-text uppercase tracking-widest font-mono">Meja {tableId} · {customerName}</p>
        </div>
      </section>

      {/* Modern Minimalist Receipt Paper */}
      <main className="px-4 flex flex-col gap-4">
        {/* Receipt Container */}
        <section className="bg-white border border-border-subtle rounded-3xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden">
          {/* Decorative receipt dashed borders */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

          {/* Struk Meta Info */}
          <div className="flex flex-col gap-2.5">
            {/* Resto Identity */}
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-primary-cta flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5" />
                Burjo Semarang Vol 2
              </span>
              <span className="text-[9px] bg-[#4a7c6d]/10 border border-[#4a7c6d]/20 text-[#4a7c6d] font-bold px-2.5 py-0.5 rounded-full font-sans tracking-wide">
                LUNAS
              </span>
            </div>

            <hr className="border-border-subtle border-dashed" />

            {/* Receipt Details Grid */}
            <div className="grid grid-cols-2 gap-y-2.5 text-[10px] text-text-secondary font-medium">
              <div className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-zinc-400" />
                <span>ID Pesanan</span>
              </div>
              <div className="text-right font-extrabold text-text-primary font-mono text-[11px]">#{orderId}</div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Waktu Order</span>
              </div>
              <div className="text-right text-text-primary font-mono">{orderTime}</div>

              <div className="flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-zinc-400" />
                <span>Metode Bayar</span>
              </div>
              <div className="text-right text-text-primary font-mono">{paymentMethod}</div>
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Cooking Estimation Card (Earthy Soft Sage Green) */}
          <div className="bg-[#4a7c6d]/5 border border-[#4a7c6d]/10 rounded-xl p-3 flex gap-3 items-center">
            <div className="w-8 h-8 bg-[#4a7c6d]/15 rounded-full flex items-center justify-center text-[#4a7c6d] flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-text-secondary">Estimasi Waktu Penyajian</p>
              <p className="text-xs font-bold text-text-primary mt-0.5">~10 - 15 Menit</p>
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Order Items Table list */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Daftar Menu</span>
            
            <div className="flex flex-col gap-3.5">
              {items.map((item, idx) => (
                <div key={`${item.menuItemId}-${idx}`} className="flex justify-between items-start text-xs gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-text-primary truncate">{item.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.spicyLevel !== undefined && (
                        <span className="bg-[#ffdcc2] text-[#825429] px-1.5 py-0.5 rounded text-[8px] font-bold font-sans">
                          Lvl {item.spicyLevel}
                        </span>
                      )}
                      {item.notes && (
                        <span className="bg-zinc-100 text-muted-text px-1.5 py-0.5 rounded text-[8px] font-medium font-sans">
                          "{item.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-text-primary">x{item.quantity}</p>
                    <p className="font-mono text-[10px] text-muted-text mt-0.5">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-border-subtle border-dashed" />

          {/* Pricing Calculation Summary */}
          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between items-center text-text-secondary text-[11px]">
              <span>Subtotal</span>
              <span className="font-mono">Rp {getSubtotal().toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-text-secondary text-[11px]">
               <span className="line-through opacity-50">Pajak (11%)</span>
               <span className="font-mono text-[#128260] font-bold flex items-center gap-1.5">
                 <span className="line-through text-muted-text/50 font-normal text-[10px]">Rp {Math.round(getSubtotal() * 0.11).toLocaleString("id-ID")}</span>
                 <span>Rp 0</span>
               </span>
             </div>
            <div className="flex justify-between items-center border-t border-border-subtle pt-2.5">
              <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-text-primary">Total Bayar</span>
              <span className="font-mono text-base font-extrabold text-primary-cta">Rp {totalAmount.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </section>

        {/* Action Button: Back to Main Menu */}
        <button
          onClick={handleExitReceipt}
          className="w-full bg-[#825429] text-white py-3.5 rounded-xl font-bold text-xs shadow-md hover:bg-[#825429]/95 transition-all flex items-center justify-center gap-1.5 group mt-2"
        >
          <span>Pesan Lagi</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      </main>
    </div>
  );
}
