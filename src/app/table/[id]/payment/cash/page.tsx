"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Copy, CreditCard, Check, RefreshCw } from "lucide-react";

export default function CashPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params?.id || "03";

  const [mounted, setMounted] = useState(false);
  const [customerName, setCustomerName] = useState("Pelanggan");
  const [totalAmount, setTotalAmount] = useState(25000);
  const [orderId, setOrderId] = useState("BJR-082");
  const [showToast, setShowToast] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load pending order
    const pendingOrderStr = localStorage.getItem("pending_order_mitigation");
    if (pendingOrderStr) {
      try {
        const pendingOrder = JSON.parse(pendingOrderStr);
        setTotalAmount(pendingOrder.total || 25000);
        setOrderId(pendingOrder.orderId || `BJR-${Date.now().toString().slice(-3)}`);
      } catch (e) {
        console.error("Error parsing pending order:", e);
      }
    }
    
    const savedName = localStorage.getItem("customer_name");
    if (savedName) {
      setCustomerName(savedName);
    }
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(orderId);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleConfirmKasir = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setConfirmed(true);
      // Clean up order
      localStorage.removeItem("cart_items");
    }, 2000);
  };

  if (!mounted) {
    return (
      <div className="flex-grow flex items-center justify-center bg-page-bg min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-cta border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="bg-page-bg min-h-screen flex flex-col font-sans text-on-surface w-full max-w-md mx-auto shadow-lg justify-center p-8 text-center gap-6">
        <div className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center text-success mx-auto animate-bounce">
          <Check className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Pembayaran Diterima!</h2>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">
            Pembayaran tunai sebesar <strong>Rp {totalAmount.toLocaleString("id-ID")}</strong> telah dikonfirmasi oleh kasir. Pesananmu sedang disiapkan.
          </p>
        </div>
        <button
          onClick={() => router.push(`/table/${tableId}`)}
          className="bg-primary-cta text-white py-3.5 px-6 rounded-xl font-bold shadow-md hover:bg-primary-cta/95 transition-all mt-4"
        >
          Kembali ke Menu Utama
        </button>
      </div>
    );
  }

  return (
    <div className="bg-page-bg min-h-screen flex flex-col font-sans text-on-surface w-full max-w-md mx-auto shadow-lg relative pb-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-neutral-800 text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-toast-in">
          <Check className="w-4 h-4 text-success" />
          <span>ID Pesanan berhasil disalin!</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-border-subtle px-6 py-4 flex items-center sticky top-0 z-30 shadow-sm justify-center flex-shrink-0">
        <h2 className="font-bold text-lg text-text-primary text-center">Pembayaran Tunai</h2>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 flex flex-col gap-6 items-center">
        {/* Wallet Circle Icon & Status */}
        <div className="flex flex-col items-center mt-4 gap-3">
          <div className="w-20 h-20 bg-[#ffdcc2] rounded-full flex items-center justify-center text-[#825429] shadow-sm">
            <CreditCard className="w-9 h-9" />
          </div>
          <span className="font-bold text-base text-text-primary tracking-wide">Segera Bayar</span>
        </div>

        {/* Info Card */}
        <section className="w-full bg-[#f6f9f8] border border-border-subtle rounded-2xl p-5 flex flex-col gap-4 shadow-sm mt-2">
          {/* Order ID */}
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ID PESANAN</span>
            <div className="flex justify-between items-center mt-1">
              <span className="font-extrabold text-xl text-text-primary font-mono tracking-wide">#{orderId}</span>
              <button
                onClick={handleCopyId}
                className="p-2 hover:bg-zinc-100 rounded-xl text-text-secondary transition-colors"
                title="Salin ID Pesanan"
              >
                <Copy className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          <hr className="border-border-subtle" />

          {/* Total Bayar */}
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">TOTAL BAYAR</span>
            <p className="text-xl font-extrabold text-[#6b9cc4] mt-1 font-mono">Rp {totalAmount.toLocaleString("id-ID")}</p>
          </div>
        </section>

        {/* Kasir Instruction Card */}
        <section className="w-full bg-[#fdf4ed] border border-[#f8e5d6] rounded-2xl p-5 flex gap-4 shadow-sm">
          <div className="mt-0.5">
            <CreditCard className="w-5 h-5 text-[#825429]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h4 className="font-bold text-sm text-[#825429]">Bayar di Kasir</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Tunjukkan ID Pesanan ke kasir untuk membayar tunai. Simpan struk sebagai bukti bayar.
            </p>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="w-full mt-auto flex flex-col gap-4 items-center">
          {/* Pesan Lagi button */}
          <button
            onClick={() => router.push(`/table/${tableId}`)}
            className="w-full bg-zinc-200 text-text-primary py-3.5 rounded-xl font-bold text-sm hover:bg-zinc-300 transition-all flex items-center justify-center"
          >
            Pesan Lagi
          </button>

          {/* Real cashier status checking simulator styled as a premium centered status card */}
          <button
            onClick={handleConfirmKasir}
            disabled={confirming}
            className="w-full py-3.5 px-4 flex items-center justify-center gap-2.5 text-xs font-semibold text-text-secondary bg-zinc-50 hover:bg-zinc-100 border border-border-subtle rounded-xl shadow-sm transition-all active:scale-[0.99] disabled:opacity-80"
          >
            <div className="w-4 h-4 border-2 border-[#825429] border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
            <span className="text-center leading-none">
              {confirming ? "Mengecek konfirmasi..." : "Menunggu konfirmasi kasir (Klik untuk Demo)"}
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
