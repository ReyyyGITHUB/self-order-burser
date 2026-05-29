"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import KasirSidebar from "./_components/KasirSidebar";
import KasirTopbar from "./_components/KasirTopbar";
import { ChefHat, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function KasirLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null means loading state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in (sessionStorage)
    const loginFlag = sessionStorage.getItem("kasir_logged_in");
    setIsLoggedIn(loginFlag === "true");

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      // KEAMANAN MUTLAK: Saat unmount (keluar dari layout/route /kasir), langsung hapus status login!
      sessionStorage.removeItem("kasir_logged_in");
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      if (username === "kasir" && password === "kasir123") {
        sessionStorage.setItem("kasir_logged_in", "true");
        setIsLoggedIn(true);
      } else {
        setErrorMsg("Username atau Password salah!");
      }
      setLoading(false);
    }, 600); // Micro-animation delay
  };

  const handleLogout = () => {
    sessionStorage.removeItem("kasir_logged_in");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    router.push("/kasir");
  };

  // Loading screen (cegah flickering saat cek sessionStorage)
  if (isLoggedIn === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--surface-container-low)]">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render Minimalist & Professional Login Screen jika belum login
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafaf9] p-6 font-sans select-none">
        <div className="w-full max-w-sm flex flex-col gap-8">
          {/* Minimal Header (Centered & Branded) */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary)] flex items-center justify-center shrink-0 mb-1 shadow-sm">
              <ChefHat size={22} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Masuk ke POS Kasir</h2>
            <p className="text-xs text-zinc-500">
              Burjo Semarang Vol 2 · Masukkan kredensial Anda.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {errorMsg && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-100 text-xs font-medium">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Username Input */}
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

            {/* Password Input */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[var(--primary)] hover:bg-[var(--secondary)] text-white py-3 rounded-lg text-sm font-semibold shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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

  // Render POS Dashboard jika sudah sukses login
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--surface-container-low)] font-sans">
      <KasirSidebar currentPath={pathname} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <KasirTopbar isOnline={isOnline} />
        <main className="flex-1 overflow-hidden">
          {/* Membagikan fungsi logout ke context children jika diperlukan, atau trigger logout normal */}
          {children}
        </main>
      </div>
    </div>
  );
}
