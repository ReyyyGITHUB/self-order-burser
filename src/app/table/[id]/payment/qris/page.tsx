"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Download, Check, Timer } from "lucide-react";

export default function QrisPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params?.id || "03";

  const [mounted, setMounted] = useState(false);
  const [customerName, setCustomerName] = useState("Pelanggan");
  const [totalAmount, setTotalAmount] = useState(25000);
  const [orderId, setOrderId] = useState("BJR-082");
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [showToast, setShowToast] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSaveQR = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const checkPaymentStatus = () => {
    setCheckingPayment(true);
    setTimeout(() => {
      setCheckingPayment(false);
      setPaymentSuccess(true);
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

  if (paymentSuccess) {
    return (
      <div className="bg-page-bg h-screen max-h-screen flex flex-col font-sans text-on-surface w-full max-w-md mx-auto shadow-lg justify-center p-6 text-center gap-4 overflow-hidden">
        <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center text-success mx-auto animate-bounce">
          <Check className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">Pembayaran Sukses!</h2>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed px-4">
            Pembayaran QRIS senilai <strong>Rp {totalAmount.toLocaleString("id-ID")}</strong> berhasil diverifikasi. Pesananmu sedang diproses di dapur.
          </p>
        </div>
        <button
          onClick={() => router.push(`/table/${tableId}`)}
          className="bg-primary-cta text-white py-3 px-6 rounded-xl font-bold shadow-md hover:bg-primary-cta/95 transition-all mt-2 text-xs"
        >
          Kembali ke Menu Utama
        </button>
      </div>
    );
  }

  return (
    <div className="bg-page-bg h-screen max-h-screen flex flex-col font-sans text-on-surface w-full max-w-md mx-auto shadow-lg relative overflow-hidden">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-neutral-800 text-white text-[10px] px-3.5 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5 animate-toast-in">
          <Check className="w-3.5 h-3.5 text-success" />
          <span>QR Code berhasil disimpan</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-border-subtle px-4 py-2.5 flex items-center sticky top-0 z-30 shadow-sm justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/table/${tableId}/cart`)}
            className="p-1.5 hover:bg-zinc-100 rounded-full text-text-primary transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <h2 className="font-bold text-sm text-text-primary">Pembayaran QRIS</h2>
        </div>
        <button
          onClick={() => router.push(`/table/${tableId}/cart`)}
          className="p-1.5 hover:bg-zinc-100 rounded-full text-text-primary transition-colors flex items-center justify-center"
        >
          <ShoppingCart className="w-4.5 h-4.5" />
        </button>
      </header>

      {/* Main Content (Scroll-free) */}
      <main className="flex-grow p-4 flex flex-col gap-3.5 overflow-hidden justify-between">
        {/* Timer Box */}
        <section className="bg-[#fdf4ed] border border-[#f8e5d6] rounded-xl py-2 px-3 flex items-center gap-2.5 shadow-sm flex-shrink-0">
          <div className="w-7 h-7 bg-[#f7ba86]/20 rounded-full flex items-center justify-center text-primary-cta flex-shrink-0">
            <Timer className="w-4 h-4 animate-pulse" />
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-[10px] text-text-secondary">Selesaikan pembayaran dalam</p>
            <p className="font-bold text-xs text-[#825429] font-mono">{formatTime(timeLeft)}</p>
          </div>
        </section>

        {/* QRIS Display Card */}
        <section className="bg-white border border-border-subtle rounded-2xl p-4 flex flex-col items-center gap-3 shadow-sm flex-grow justify-center min-h-0">
          <div className="text-center flex-shrink-0">
            <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Total Bayar</p>
            <p className="text-xl font-bold text-[#825429] mt-0.5 font-mono">Rp {totalAmount.toLocaleString("id-ID")}</p>
          </div>

          {/* QR Code Container (Highly optimized sizing) */}
          <div className="relative w-40 h-40 bg-white border border-border-subtle rounded-xl p-2.5 flex flex-col items-center justify-center shadow-inner group flex-shrink min-h-0 aspect-square">
            {/* Tiny QRIS label */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full border border-border-subtle text-[7px] font-bold text-zinc-400 tracking-wider flex items-center justify-center">
              QRIS
            </div>

            {/* Stylized QR SVG */}
            <svg
              className="w-full h-full text-text-primary"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="5" y="5" width="22" height="22" stroke="currentColor" strokeWidth="4" />
              <rect x="9" y="9" width="14" height="14" fill="currentColor" />
              
              <rect x="73" y="5" width="22" height="22" stroke="currentColor" strokeWidth="4" />
              <rect x="77" y="9" width="14" height="14" fill="currentColor" />
              
              <rect x="5" y="73" width="22" height="22" stroke="currentColor" strokeWidth="4" />
              <rect x="9" y="77" width="14" height="14" fill="currentColor" />

              <rect x="77" y="77" width="10" height="10" stroke="currentColor" strokeWidth="2" />
              <rect x="81" y="81" width="2" height="2" fill="currentColor" />

              <rect x="40" y="40" width="20" height="20" rx="4" fill="#825429" />
              <rect x="44" y="44" width="12" height="12" rx="2" fill="white" />
              <path d="M47 50C47 48.3431 48.3431 47 50 47C51.6569 47 53 48.3431 53 50C53 51.6569 51.6569 53 50 53" stroke="#825429" strokeWidth="2" strokeLinecap="round" />

              <path d="M35 8H65M35 14H50M35 20H45M60 20H65M35 26H55M35 32H65M5 32H15M73 32H95M5 38H35M45 38H55M65 38H95M5 44H20M25 44H35M65 44H75M80 44H95M5 50H25M75 50H95M5 56H35M45 56H55M65 56H95M5 62H15M25 62H35M65 62H75M80 62H95M35 68H55M60 68H65M35 74H50M35 80H45M60 80H65M35 86H55M35 92H65" stroke="currentColor" strokeWidth="2" strokeDasharray="2 3" />
            </svg>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveQR}
            className="flex items-center gap-1.5 border border-border-subtle bg-white hover:bg-zinc-50 text-text-primary px-4 py-1.5 rounded-lg font-semibold text-[10px] shadow-sm transition-all active:scale-[0.98] flex-shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-text-secondary" />
            <span>Simpan QR</span>
          </button>

          {/* Compact Instructions */}
          <p className="text-[10px] text-text-secondary leading-relaxed text-center max-w-[260px] flex-shrink-0">
            Scan QR menggunakan aplikasi <strong className="text-text-primary font-semibold">Gopay, OVO, ShopeePay, dll</strong>
          </p>
        </section>

        {/* Verification Check Status Button */}
        <button
          onClick={checkPaymentStatus}
          disabled={checkingPayment}
          className="w-full bg-[#825429] text-white py-3 rounded-xl font-bold text-xs shadow-sm hover:bg-[#825429]/95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-75 flex-shrink-0"
        >
          {checkingPayment ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Memverifikasi Pembayaran...</span>
            </>
          ) : (
            <span>Saya Sudah Bayar</span>
          )}
        </button>
      </main>
    </div>
  );
}
