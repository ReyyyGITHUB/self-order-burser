"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, Check, Timer, RefreshCw } from "lucide-react";

export default function QrisPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params?.id || "03";

  const [mounted, setMounted] = useState(false);
  const [customerName, setCustomerName] = useState("Pelanggan");
  const [totalAmount, setTotalAmount] = useState(25000);
  const [orderId, setOrderId] = useState("BJR-082");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [showToast, setShowToast] = useState(false);
  
  const [transactionId, setTransactionId] = useState("");
  const [qrString, setQrString] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [changingMethod, setChangingMethod] = useState(false);

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  useEffect(() => {
    setMounted(true);
    
    // SECURITY GUARD: Jika transaksi sudah selesai, jangan biarkan kembali ke halaman pembayaran
    const paymentCompletedFlag = localStorage.getItem("payment_completed_flag");
    if (paymentCompletedFlag === "true") {
      router.replace(`/table/${tableId}/payment/receipt`);
      return;
    }
    
    // Load pending order details
    let currentAmount = 25000;
    let currentOrderId = "BJR-082";
    let currentCustomerName = "Pelanggan";

    const pendingOrderStr = localStorage.getItem("pending_order_mitigation");
    if (pendingOrderStr) {
      try {
        const pendingOrder = JSON.parse(pendingOrderStr);
        currentAmount = pendingOrder.total || 25000;
        currentOrderId = pendingOrder.orderId || `BJR-${Date.now().toString().slice(-3)}`;
        setTotalAmount(currentAmount);
        setOrderId(currentOrderId);

        // OPTIMASI: Reuse data QRIS dari halaman checkout langsung!
        if (pendingOrder.qrisData) {
          const qData = pendingOrder.qrisData;
          setTransactionId(qData.transaction?.id || qData.id);
          setQrString(qData.payment?.qr_string || qData.qr_string || "");
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Error parsing pending order:", e);
      }
    }
    
    const savedName = localStorage.getItem("customer_name");
    if (savedName) {
      currentCustomerName = savedName;
      setCustomerName(currentCustomerName);
    }

    // Cek cache transaksi QRIS aktif
    const cacheStr = localStorage.getItem(`qris_cache_${currentOrderId}`);
    if (cacheStr) {
      try {
        const cache = JSON.parse(cacheStr);
        const elapsed = Math.floor((Date.now() - cache.createdAt) / 1000);
        const remaining = cache.duration - elapsed;

        // Jika sisa waktu timer > 10 detik dan nominal belanjanya sama, gunakan QR lama
        if (remaining > 10 && cache.amount === currentAmount) {
          setTransactionId(cache.transactionId);
          setQrString(cache.qrString);
          setTotalAmount(cache.amount);
          setTimeLeft(remaining);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Gagal membaca cache QRIS:", e);
      }
    }

    // Jika tidak ada cache valid, panggil API Louvin
    createTransaction(currentAmount, currentCustomerName, currentOrderId);
  }, []);

  // Live Payment Polling when NOT in Demo Mode
  useEffect(() => {
    if (!transactionId || paymentSuccess || loading || isDemoMode) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status?id=${transactionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.transaction.status === "settled") {
            localStorage.removeItem("cart_items");
            router.push(`/table/${tableId}/payment/receipt`);
          }
        }
      } catch (e) {
        console.error("Error polling payment status:", e);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(pollInterval);
  }, [transactionId, paymentSuccess, loading, isDemoMode]);

  const createTransaction = async (amount: number, name: string, ref: string) => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch("/api/payment/qris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          customerName: name,
          description: `Order #${ref} Meja ${tableId}`,
          reference: ref
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Gagal memproses transaksi QRIS Louvin");
      }

      const data = await res.json();
      if (data.success) {
        const finalAmount = data.payment.total_payment || data.transaction.amount || amount;
        
        setTransactionId(data.transaction.id);
        setQrString(data.payment.qr_string);
        setTotalAmount(finalAmount);

        // Simpan ke cache agar saat di-refresh tidak generate QR baru
        const cachePayload = {
          transactionId: data.transaction.id,
          qrString: data.payment.qr_string,
          amount: finalAmount,
          createdAt: Date.now(),
          duration: 300 // 5 menit
        };
        localStorage.setItem(`qris_cache_${ref}`, JSON.stringify(cachePayload));
      } else {
        throw new Error(data.error || "Gagal membuat kode QRIS");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft <= 0 || loading) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSaveQR = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Manually check/force payment for demo mode
  const handleDemoConfirmPayment = async () => {
    setCheckingPayment(true);
    setTimeout(() => {
      setCheckingPayment(false);
      localStorage.removeItem("cart_items");
      router.push(`/table/${tableId}/payment/receipt`);
    }, 1500);
  };
  const handleChangePaymentMethod = async () => {
    if (changingMethod) return;
    const confirmChange = window.confirm("Apakah Anda ingin mengganti metode pembayaran menjadi Tunai/Kasir?");
    if (!confirmChange) return;

    setChangingMethod(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod: "CASH" })
      });

      if (res.ok) {
        // Update local session
        const pendingOrderStr = localStorage.getItem("pending_order_mitigation");
        if (pendingOrderStr) {
          const pendingOrder = JSON.parse(pendingOrderStr);
          pendingOrder.paymentMethod = "cash";
          localStorage.setItem("pending_order_mitigation", JSON.stringify(pendingOrder));
        }
        
        // Redirect ke Receipt Page untuk Cash
        router.push(`/table/${tableId}/payment/receipt`);
      } else {
        alert("Gagal mengganti metode pembayaran. Silakan hubungi kasir.");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setChangingMethod(false);
    }
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

      {/* Header (No Back & Cart Buttons to prevent exit spam) */}
      <header className="bg-white border-b border-border-subtle px-6 py-3.5 flex items-center sticky top-0 z-30 shadow-sm justify-center flex-shrink-0">
        <h2 className="font-bold text-sm text-text-primary text-center">Pembayaran QRIS</h2>
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
            <p className="font-bold text-xs text-[#825429] font-mono">
              {loading ? "--:--" : formatTime(timeLeft)}
            </p>
          </div>
        </section>

        {/* QRIS Display Card */}
        <section className="bg-white border border-border-subtle rounded-2xl p-4 flex flex-col items-center gap-3 shadow-sm flex-grow justify-center min-h-0">
          {errorMsg ? (
            <div className="text-center p-4 flex flex-col gap-2.5">
              <p className="text-xs text-error font-medium">{errorMsg}</p>
              <button
                onClick={() => createTransaction(totalAmount, customerName, orderId)}
                className="text-xs bg-primary-cta text-white px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 justify-center"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Coba Lagi
              </button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="w-8 h-8 border-4 border-[#825429] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[11px] text-text-secondary">Menyiapkan QRIS dari Louvin...</p>
            </div>
          ) : (
            <>
              <div className="text-center flex-shrink-0">
                <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Total Bayar</p>
                <p className="text-xl font-bold text-[#825429] mt-0.5 font-mono">Rp {totalAmount.toLocaleString("id-ID")}</p>
              </div>

              {/* QR Code Container (Highly optimized sizing & larger QR for scan UX) */}
              <div className="relative w-56 h-56 bg-white border border-border-subtle rounded-xl p-1 flex flex-col items-center justify-center shadow-inner group flex-shrink min-h-0 aspect-square">
                {/* Tiny QRIS label */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full border border-border-subtle text-[7px] font-bold text-zinc-400 tracking-wider flex items-center justify-center">
                  QRIS
                </div>

                {/* Scannable Dynamic QR from Louvin API qr_string using qrserver.com */}
                {qrString ? (
                  <img
                    alt="QRIS Code Louvin"
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrString)}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center text-[10px] text-text-secondary">Gagal memuat QR</div>
                )}
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveQR}
                className="flex items-center gap-1.5 border border-border-subtle bg-white hover:bg-zinc-50 text-text-primary px-4 py-1.5 rounded-lg font-semibold text-[10px] shadow-sm transition-all active:scale-[0.98] flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-text-secondary" />
                <span>Simpan QR</span>
              </button>

              {/* Tombol Ganti Metode Pembayaran (Teks saja) */}
              <button
                onClick={handleChangePaymentMethod}
                disabled={changingMethod || loading}
                className="text-[10px] text-primary-cta underline font-bold mt-1.5 transition-all disabled:opacity-50 cursor-pointer flex-shrink-0"
              >
                {changingMethod ? "Memproses..." : "Ganti Metode Pembayaran (Tunai)"}
              </button>

              {/* Info Petunjuk Scan langsung di bawah Tombol Ganti Metode */}
              <p className="text-[9px] text-text-secondary leading-relaxed text-center max-w-[260px] mt-1 flex-shrink-0">
                Scan QR menggunakan aplikasi <strong className="text-text-primary font-semibold">Gopay, OVO, ShopeePay, dll</strong>
              </p>
            </>
          )}
        </section>

        {/* Demo Mode Secret Clickable Banner OR Automated Real-Time Verification Status */}
        {isDemoMode ? (
          <button
            onClick={handleDemoConfirmPayment}
            disabled={checkingPayment || loading || !!errorMsg}
            className="w-full py-3.5 px-4 flex items-center justify-center gap-2.5 text-text-secondary text-xs font-semibold bg-zinc-50 border border-border-subtle rounded-xl flex-shrink-0 shadow-sm cursor-pointer hover:bg-zinc-100/50 active:scale-[0.99] transition-all"
          >
            {checkingPayment ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-cta border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                <span className="text-center leading-none">Memverifikasi Pembayaran...</span>
              </>
            ) : (
              <>
                <div className="w-4 h-4 border-2 border-primary-cta border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                <span className="text-center leading-none">Menunggu pembayaran otomatis terkonfirmasi...</span>
              </>
            )}
          </button>
        ) : (
          <div className="w-full py-3.5 px-4 flex items-center justify-center gap-2.5 text-text-secondary text-xs font-semibold bg-zinc-50 border border-border-subtle rounded-xl flex-shrink-0 shadow-sm">
            <div className="w-4 h-4 border-2 border-primary-cta border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
            <span className="text-center leading-none">Menunggu pembayaran otomatis terkonfirmasi...</span>
          </div>
        )}
      </main>
    </div>
  );
}
