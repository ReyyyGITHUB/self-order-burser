"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowUpRight, Check, Utensils } from "lucide-react";

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
      <div className="bg-surface h-[100dvh] max-h-screen overflow-hidden flex flex-col font-sans antialiased text-on-surface w-full max-w-md mx-auto shadow-md">
        {/* Top: Magazine-style framed image */}
        <div className="w-full px-6 pt-5 pb-1 flex-shrink-0 max-h-[30vh]">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl shadow-sm bg-surface-container-high h-full">
            <img
              alt="Appetizing bowl of warm Burjo Order noodles"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/ADBb0ujJZwC405KohpKlRRL8AktY3CJ-4zju7BbjO6kGYBhsLNb91RgKGI6hIqLT8smd7Ld6yOgpPiL0vhDztklGh4mS-7i1QPy4mpzNy-YfB_DvOLkUmdykQsw1DuKDJDdixzZa73y-KuBu104EOX1pcSqeTkOl3uDhEXoH_1UvY-BOLp3ZBiwHD36stiIaSYIx_Uw2o4IQPLpMmaFIMOvJNkoZJeroNfvUCNr0p3cU_BmEXD72mlqdflZGT8UW"
            />
          </div>
        </div>

        {/* Bottom: Content & Form */}
        <div className="flex-1 flex flex-col justify-center px-8 pb-8 z-10 bg-surface overflow-hidden gap-8">
          {/* Editorial Header Text */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs tracking-widest uppercase text-primary/85 font-semibold">MEJA {tableId}</span>
              <Utensils className="w-3.5 h-3.5 text-primary/85" />
            </div>
            <h1 className="font-sans text-[40px] leading-[1.1] tracking-tight text-on-surface font-bold">
              Selamat<br />Datang.
            </h1>
            <p className="font-sans text-sm text-muted-text max-w-[280px] leading-relaxed">
              Yuk, kenalan dulu sebelum mulai pesan makanan favoritmu.
            </p>
          </div>

          {/* Input Field & Action */}
          <form onSubmit={handleStartOrder} className="flex flex-col gap-8">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] tracking-widest uppercase text-outline" htmlFor="namaLengkap">
                Nama Lengkap
              </label>
              <div className="relative group">
                <input
                  className="w-full bg-transparent border-0 border-b-2 border-border-subtle py-2 px-0 font-sans text-base sm:text-lg text-on-surface placeholder:text-muted-text/30 focus:ring-0 focus:border-primary focus:outline-none transition-all rounded-none"
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
              className="w-full bg-primary-cta text-white font-sans font-semibold py-4 px-6 rounded-lg shadow-sm hover:bg-primary-cta/95 transition-all active:scale-[0.98] duration-150 flex items-center justify-between group disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>Mulai Pesan</span>
              <ArrowUpRight className="w-5 h-5 text-white transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Jika sudah terdaftar, tampilkan halaman menu sementara
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
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success animate-pulse mb-2">
          <Check className="w-8 h-8" />
        </div>
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
