"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import KasirSidebar from "./_components/KasirSidebar";
import KasirTopbar from "./_components/KasirTopbar";
import { ChefHat, Lock, User, Eye, EyeOff, AlertCircle, DollarSign, Wallet, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";

export default function KasirLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  
  // Login & Shift State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = loading
  const [shiftStep, setShiftStep] = useState<"login" | "open_shift" | "close_shift" | "shift_summary">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Shift Form Inputs
  const [kasirName, setKasirName] = useState("");
  const [startingCash, setStartingCash] = useState("100000");
  const [endingCash, setEndingCash] = useState("");
  
  // Active Shift Data
  const [activeShiftId, setActiveShiftId] = useState<string | null>(null);
  const [activeShift, setActiveShift] = useState<any>(null);
  const [shiftSummary, setShiftSummary] = useState<any>(null);

  // Check active shift on mount
  useEffect(() => {
    async function checkActiveShift() {
      try {
        const res = await fetch("/api/kasir/shift/active");
        const data = await res.json();
        
        const loginFlag = sessionStorage.getItem("kasir_logged_in");
        
        if (data.active) {
          // Ada shift aktif di database, bypass login
          sessionStorage.setItem("kasir_logged_in", "true");
          sessionStorage.setItem("kasir_username", "kasir");
          sessionStorage.setItem("kasir_name", data.shift.kasirName);
          sessionStorage.setItem("kasir_role", "KASIR");
          sessionStorage.setItem("kasir_shift_id", data.shift.id);
          
          setActiveShiftId(data.shift.id);
          setActiveShift(data.shift);
          setIsLoggedIn(true);
          setShiftStep("login"); // Already logged in, no modal needed
        } else {
          // Tidak ada shift aktif
          if (loginFlag === "true") {
            // Sudah login kredensial, tapi belum buka shift
            setIsLoggedIn(false);
            setShiftStep("open_shift");
          } else {
            setIsLoggedIn(false);
            setShiftStep("login");
          }
        }
      } catch (err) {
        console.error(err);
        setIsLoggedIn(false);
      }
    }

    checkActiveShift();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen to global logout event
    const handleLogoutTrigger = () => {
      const currentShiftId = sessionStorage.getItem("kasir_shift_id");
      if (currentShiftId) {
        setActiveShiftId(currentShiftId);
        setShiftStep("close_shift");
      } else {
        // Fallback jika tidak ada shift ID
        handleDirectLogout();
      }
    };
    window.addEventListener("trigger-kasir-logout", handleLogoutTrigger);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("trigger-kasir-logout", handleLogoutTrigger);
    };
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      if (username === "kasir" && password === "kasir123") {
        sessionStorage.setItem("kasir_logged_in", "true");
        sessionStorage.setItem("kasir_username", "kasir");
        sessionStorage.setItem("kasir_role", "KASIR");
        
        // Go to open shift step
        setShiftStep("open_shift");
      } else {
        setErrorMsg("Username atau Password salah!");
      }
      setLoading(false);
    }, 600);
  };

  const handleOpenShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!kasirName.trim()) {
      setErrorMsg("Nama kasir wajib diisi!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/kasir/shift/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kasirName,
          startingCash: Number(startingCash) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuka shift");

      sessionStorage.setItem("kasir_name", kasirName);
      sessionStorage.setItem("kasir_shift_id", data.shift.id);
      setActiveShiftId(data.shift.id);
      setActiveShift(data.shift);
      setIsLoggedIn(true);
      setShiftStep("login"); // Clear modal, enter POS
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (endingCash === "") {
      setErrorMsg("Masukkan uang kas fisik di laci saat ini!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/kasir/shift/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shiftId: activeShiftId,
          endingCash: Number(endingCash) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menutup shift");

      setShiftSummary(data.summary);
      setShiftStep("shift_summary");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menutup shift");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectLogout = () => {
    sessionStorage.removeItem("kasir_logged_in");
    sessionStorage.removeItem("kasir_username");
    sessionStorage.removeItem("kasir_name");
    sessionStorage.removeItem("kasir_role");
    sessionStorage.removeItem("kasir_shift_id");
    
    setIsLoggedIn(false);
    setActiveShiftId(null);
    setActiveShift(null);
    setShiftStep("login");
    setUsername("");
    setPassword("");
    setKasirName("");
    setStartingCash("100000");
    setEndingCash("");
    setShiftSummary(null);
    router.push("/kasir");
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Loading screen
  if (isLoggedIn === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafaf9]">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. Render Login Screen
  if (!isLoggedIn && shiftStep === "login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafaf9] p-6 font-sans select-none">
        <div className="w-full max-w-sm flex flex-col gap-8">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary)] flex items-center justify-center shrink-0 mb-1 shadow-sm">
              <ChefHat size={22} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Masuk ke POS Kasir</h2>
            <p className="text-xs text-zinc-500">
              Burjo Semarang Vol 2 · Masukkan kredensial Anda.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            {errorMsg && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-100 text-xs font-medium">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-700">Username</label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all bg-white text-zinc-900"
                required
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all bg-white text-zinc-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[var(--primary)] hover:bg-[var(--secondary)] text-white py-3 rounded-lg text-sm font-semibold shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-sans cursor-pointer animate-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Render Open Shift Prompt Screen
  if (!isLoggedIn && shiftStep === "open_shift") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafaf9] p-6 font-sans select-none">
        <div className="w-full max-w-sm flex flex-col gap-8">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary)] flex items-center justify-center shrink-0 mb-1 shadow-sm">
              <Wallet size={22} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Buka Shift Baru</h2>
            <p className="text-xs text-zinc-500">
              Silakan masukkan nama Anda dan uang kas modal awal.
            </p>
          </div>

          <form onSubmit={handleOpenShiftSubmit} className="flex flex-col gap-4">
            {errorMsg && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-100 text-xs font-medium">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-700">Nama Kasir Bertugas</label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={kasirName}
                onChange={(e) => setKasirName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all bg-white text-zinc-900"
                required
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-700">Uang Kas Modal Awal (Laci)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-semibold">Rp</span>
                <input
                  type="number"
                  placeholder="100000"
                  value={startingCash}
                  onChange={(e) => setStartingCash(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all bg-white text-zinc-900 font-semibold"
                  required
                />
              </div>
              <p className="text-[10px] text-zinc-400">Biasanya berupa uang pecahan kembalian awal.</p>
            </div>

            <div className="flex gap-2.5 mt-4">
              <button
                type="button"
                onClick={handleDirectLogout}
                className="w-1/3 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer text-center"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-[var(--primary)] hover:bg-[var(--secondary)] text-white py-3 rounded-lg text-sm font-semibold shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="flex items-center gap-1.5">Buka Shift <ArrowRight size={15} /></span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 3. Render POS Main View & Handle Tutup Shift Modals
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--surface-container-low)] font-sans relative">
      <KasirSidebar currentPath={pathname} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <KasirTopbar isOnline={isOnline} />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>

      {/* 4. MODAL: Tutup Shift Prompt */}
      {shiftStep === "close_shift" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl flex flex-col gap-6 animate-scale-up">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mb-1">
                <Wallet size={22} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Konfirmasi Tutup Shift</h3>
              <p className="text-xs text-zinc-500 px-4">
                Sebelum logout, lakukan hitung uang kas fisik laci kasir saat ini untuk rekonsiliasi sistem.
              </p>
            </div>

            <form onSubmit={handleCloseShiftSubmit} className="flex flex-col gap-4">
              {errorMsg && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-100 text-xs font-medium">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-700">Total Uang Fisik Aktual di Laci</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-semibold">Rp</span>
                  <input
                    type="number"
                    placeholder="Hitung manual uang di laci"
                    value={endingCash}
                    onChange={(e) => setEndingCash(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all bg-white text-zinc-900 font-semibold"
                    required
                    autoFocus
                  />
                </div>
                <p className="text-[10px] text-zinc-400">Gabungkan modal awal + semua penjualan tunai.</p>
              </div>

              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setShiftStep("login")}
                  className="w-1/3 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer text-center"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg text-sm font-semibold shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Tutup Shift & Keluar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: Shift Summary (Hasil Rekonsiliasi) */}
      {shiftStep === "shift_summary" && shiftSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-6 animate-scale-up">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mb-1">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Shift Berhasil Ditutup</h3>
              <p className="text-xs text-zinc-500">
                Berikut adalah ringkasan pembukuan laci kasir Anda.
              </p>
            </div>

            {/* Summary Card */}
            <div className="border border-zinc-100 rounded-xl bg-zinc-50/50 p-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Nama Kasir</span>
                <span className="font-semibold text-zinc-800">{sessionStorage.getItem("kasir_name")}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-zinc-500">Uang Modal Awal</span>
                <span className="font-semibold text-zinc-800">{formatRupiah(shiftSummary.startingCash)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-zinc-500">Penjualan Tunai Masuk</span>
                <span className="font-semibold text-zinc-800">{formatRupiah(shiftSummary.totalCashSales)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100 text-zinc-600">
                <span className="font-medium">Ekspektasi Total Kas (Sistem)</span>
                <span className="font-bold">{formatRupiah(shiftSummary.expectedCash)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Total Uang Fisik (Laci)</span>
                <span className="font-bold text-zinc-900">{formatRupiah(shiftSummary.endingCash)}</span>
              </div>
              <div className="flex justify-between py-1 items-center">
                <span className="font-medium text-zinc-600">Selisih Kas</span>
                {shiftSummary.discrepancy === 0 ? (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">Cocok (Rp 0)</span>
                ) : shiftSummary.discrepancy > 0 ? (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-sky-100 text-sky-800">Surplus (+{formatRupiah(shiftSummary.discrepancy)})</span>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-800">Kurang ({formatRupiah(shiftSummary.discrepancy)})</span>
                )}
              </div>
            </div>

            <button
              onClick={handleDirectLogout}
              className="w-full bg-[var(--primary)] hover:bg-[var(--secondary)] text-white py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer text-center"
            >
              Selesai & Keluar POS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
