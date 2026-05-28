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
      <div className="bg-page-bg min-h-screen flex flex-col font-sans text-on-surface w-full max-w-md mx-auto shadow-lg justify-center p-8 text-center gap-6">
        <div className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center text-success mx-auto animate-bounce">
          <Check className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Pembayaran Sukses!</h2>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">
            Pembayaran QRIS senilai <strong>Rp {totalAmount.toLocaleString("id-ID")}</strong> berhasil diverifikasi. Pesananmu sedang diproses di dapur.
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
          <span>QR Code berhasil disimpan ke galeri</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-border-subtle px-6 py-4 flex items-center sticky top-0 z-30 shadow-sm justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/table/${tableId}/cart`)}
            className="p-2 hover:bg-zinc-100 rounded-full text-text-primary transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-lg text-text-primary">Pembayaran QRIS</h2>
        </div>
        <button
          onClick={() => router.push(`/table/${tableId}/cart`)}
          className="p-2 hover:bg-zinc-100 rounded-full text-text-primary transition-colors flex items-center justify-center"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Timer Box */}
        <section className="bg-[#fdf4ed] border border-[#f8e5d6] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-[#f7ba86]/20 rounded-full flex items-center justify-center text-primary-cta">
            <Timer className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-text-secondary">Selesaikan pembayaran dalam</p>
            <p className="font-bold text-sm text-[#825429] mt-0.5">{formatTime(timeLeft)}</p>
          </div>
        </section>

        {/* QRIS Display Card */}
        <section className="bg-white border border-border-subtle rounded-3xl p-6 flex flex-col items-center gap-6 shadow-sm">
          <div className="text-center">
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Total Bayar</p>
            <p className="text-2xl font-bold text-[#825429] mt-1 font-mono">Rp {totalAmount.toLocaleString("id-ID")}</p>
          </div>

          {/* QR Code Container */}
          <div className="relative w-64 h-64 bg-white border border-border-subtle rounded-2xl p-4 flex flex-col items-center justify-center shadow-inner group">
            {/* Tiny QRIS label at the top center of QR boundary */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full border border-border-subtle text-[8px] font-bold text-zinc-400 tracking-widest flex items-center justify-center">
              QRIS
            </div>

            {/* Stylized QR SVG */}
            <svg
              className="w-full h-full text-text-primary"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer corners / anchor blocks */}
              <rect x="5" y="5" width="22" height="22" stroke="currentColor" strokeWidth="4" />
              <rect x="9" y="9" width="14" height="14" fill="currentColor" />
              
              <rect x="73" y="5" width="22" height="22" stroke="currentColor" strokeWidth="4" />
              <rect x="77" y="9" width="14" height="14" fill="currentColor" />
              
              <rect x="5" y="73" width="22" height="22" stroke="currentColor" strokeWidth="4" />
              <rect x="9" y="77" width="14" height="14" fill="currentColor" />

              {/* Smaller alignment anchor bottom right */}
              <rect x="77" y="77" width="10" height="10" stroke="currentColor" strokeWidth="2" />
              <rect x="81" y="81" width="2" height="2" fill="currentColor" />

              {/* Center stylized merchant logo badge placeholder (brown-orange) */}
              <rect x="40" y="40" width="20" height="20" rx="4" fill="#825429" />
              <rect x="44" y="44" width="12" height="12" rx="2" fill="white" />
              <path d="M47 50C47 48.3431 48.3431 47 50 47C51.6569 47 53 48.3431 53 50C53 51.6569 51.6569 53 50 53" stroke="#825429" strokeWidth="2" strokeLinecap="round" />

              {/* QR Dots simulation */}
              <path d="M35 8H65M35 14H50M35 20H45M60 20H65M35 26H55M35 32H65M5 32H15M73 32H95M5 38H35M45 38H55M65 38H95M5 44H20M25 44H35M65 44H75M80 44H95M5 50H25M75 50H95M5 56H35M45 56H55M65 56H95M5 62H15M25 62H35M65 62H75M80 62H95M35 68H55M60 68H65M35 74H50M35 80H45M60 80H65M35 86H55M35 92H65" stroke="currentColor" strokeWidth="2" strokeDasharray="2 3" />
            </svg>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveQR}
            className="flex items-center gap-2 border border-border-subtle bg-white hover:bg-zinc-50 text-text-primary px-6 py-2.5 rounded-xl font-semibold text-xs shadow-sm transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4 text-text-secondary" />
            <span>Simpan QR</span>
          </button>

          <hr className="w-full border-border-subtle" />

          {/* Instruction Details */}
          <p className="text-xs text-text-secondary leading-relaxed text-center max-w-[280px]">
            Scan QR di atas menggunakan aplikasi pembayaran favoritmu <strong className="text-text-primary font-semibold">(Gopay, OVO, ShopeePay, dll)</strong>
          </p>
        </section>

        {/* Verification Check Status Button */}
        <button
          onClick={checkPaymentStatus}
          disabled={checkingPayment}
          className="w-full bg-[#825429] text-white py-4 rounded-xl font-bold text-sm shadow-md hover:bg-[#825429]/95 transition-all flex items-center justify-center gap-2 disabled:opacity-75"
        >
          {checkingPayment ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
