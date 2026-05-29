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

  // Render Premium Login Screen jika belum login
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--surface-container-low)] to-[var(--surface-container-high)] p-4 font-sans select-none">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[var(--outline-variant)] overflow-hidden">
          {/* Top Brand Banner */}
          <div className="bg-[var(--surface-container-high)] p-8 text-center flex flex-col items-center gap-3 border-b border-[var(--outline-variant)]">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/10 animate-bounce">
              <ChefHat size={32} className="text-white" />
            </div>
            <div>
              <h2 className="font-headline font-black text-xl text-[var(--on-surface)]">Burser POS Kasir</h2>
              <p className="text-xs text-[var(--muted-text)] mt-0.5">Burjo Semarang Vol 2 · Sistem Kasir</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 flex flex-col gap-5">
            {errorMsg && (
              <div className="flex items-center gap-2 px-4 py-3 bg-[var(--error-container)] text-[var(--error)] rounded-xl border border-red-100 text-xs font-semibold animate-shake">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-wider">Username</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-text)]">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[var(--outline-variant)] focus:outline-none focus:border-[var(--primary)] transition-all bg-[var(--surface-container-low)]"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-text)]">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border border-[var(--outline-variant)] focus:outline-none focus:border-[var(--primary)] transition-all bg-[var(--surface-container-low)]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-text)] hover:text-[var(--on-surface)] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[var(--primary)] text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:bg-[var(--secondary)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Masuk ke POS"
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
