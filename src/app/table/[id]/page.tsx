"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TablePage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params?.id;

  const [mounted, setMounted] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [inputName, setInputName] = useState("");

  useEffect(() => {
    setMounted(true);
    const savedName = localStorage.getItem("customer_name");
    if (savedName) {
      setCustomerName(savedName);
      setIsRegistered(true);
    }
  }, []);

  const handleStartOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    localStorage.setItem("customer_name", inputName.trim());
    localStorage.setItem("table_id", String(tableId));
    setCustomerName(inputName.trim());
    setIsRegistered(true);
    
    // Nanti bisa redirect ke menu atau show menu langsung
    // Untuk sekarang tetap di halaman ini tapi view menu
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Jika belum register nama, tampilkan Onboarding Editorial Premium
  if (!isRegistered) {
    return (
      <div className="bg-surface min-h-screen flex flex-col font-sans antialiased text-on-surface w-full max-w-md mx-auto shadow-md">
        {/* Top: Magazine-style framed image */}
        <div className="w-full px-6 pt-8 pb-4 flex-shrink-0">
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-sm bg-surface-container-high">
            <img
              alt="Appetizing bowl of warm Burjo Order noodles"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/ADBb0ujJZwC405KohpKlRRL8AktY3CJ-4zju7BbjO6kGYBhsLNb91RgKGI6hIqLT8smd7Ld6yOgpPiL0vhDztklGh4mS-7i1QPy4mpzNy-YfB_DvOLkUmdykQsw1DuKDJDdixzZa73y-KuBu104EOX1pcSqeTkOl3uDhEXoH_1UvY-BOLp3ZBiwHD36stiIaSYIx_Uw2o4IQPLpMmaFIMOvJNkoZJeroNfvUCNr0p3cU_BmEXD72mlqdflZGT8UW"
            />
          </div>
        </div>

        {/* Bottom: Content & Form */}
        <div className="flex-1 flex flex-col justify-between px-8 pb-12 z-10 bg-surface">
          {/* Editorial Header Text */}
          <div className="flex flex-col gap-3 mt-6">
            <span className="font-mono text-xs tracking-widest uppercase text-primary/80">MEJA {tableId}</span>
            <h1 className="font-headline text-[40px] leading-[1.1] tracking-tight text-on-surface font-bold">
              Selamat<br />Datang.
            </h1>
            <p className="font-sans text-sm text-muted-text max-w-[280px]">
              Yuk, kenalan dulu sebelum mulai pesan makanan favoritmu.
            </p>
          </div>

          {/* Input Field & Action */}
          <form onSubmit={handleStartOrder} className="flex flex-col gap-10 mt-10">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs tracking-widest uppercase text-outline" htmlFor="namaLengkap">
                Nama Lengkap
              </label>
              <div className="relative group">
                <input
                  className="w-full bg-transparent border-0 border-b-2 border-border-subtle py-3 px-0 font-sans text-lg text-on-surface placeholder:text-muted-text/30 focus:ring-0 focus:border-primary focus:outline-none transition-all rounded-none"
                  id="namaLengkap"
                  placeholder="Contoh: Budi Santoso"
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={!inputName.trim()}
              className="w-full bg-on-surface text-surface font-sans font-semibold py-5 px-6 rounded-lg shadow-sm hover:bg-on-surface/90 transition-all active:scale-[0.98] duration-150 flex items-center justify-between mt-auto group disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>Mulai Pesan</span>
              <span className="material-symbols-outlined text-surface text-[24px] transform group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Jika sudah terdaftar, tampilkan halaman menu sementara (nanti akan dikembangkan)
  return (
    <div className="bg-page-bg min-h-screen flex flex-col font-sans text-on-surface w-full max-w-md mx-auto shadow-md">
      <header className="bg-color-header-bg text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div>
          <h2 className="font-bold text-lg text-primary-cta">Burjo Semarang</h2>
          <p className="text-xs text-zinc-400">Meja {tableId}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-400">Halo,</p>
          <p className="font-semibold text-sm">{customerName}</p>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center text-center gap-4">
        <span className="material-symbols-outlined text-[64px] text-success">
          check_circle
        </span>
        <h3 className="text-xl font-bold text-text-primary">Registrasi Berhasil!</h3>
        <p className="text-sm text-text-secondary">
          Halo <strong>{customerName}</strong>, kamu siap memesan hidangan lezat di Meja {tableId}. Menu utama akan segera hadir.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("customer_name");
            setIsRegistered(false);
            setInputName("");
          }}
          className="mt-4 px-4 py-2 border border-secondary text-secondary rounded-lg text-sm font-semibold hover:bg-secondary/10 transition-colors"
        >
          Ganti Nama
        </button>
      </main>
    </div>
  );
}
