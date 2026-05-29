"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X, AlertCircle } from "lucide-react";

interface CameraModalProps {
  onClose: () => void;
  onScan: (orderId: string) => void;
}

export default function CameraModal({ onClose, onScan }: CameraModalProps) {
  const qrRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const regionId = "qr-reader";
    const html5QrCode = new Html5Qrcode(regionId);
    qrRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          // Stop scanner immediately on success
          html5QrCode.stop().catch(() => {});
          // Play beep
          try {
            const audio = new Audio("/sounds/beep.mp3");
            audio.volume = 0.8;
            audio.play().catch(() => {});
          } catch {}
          onScan(decodedText.trim());
        },
        () => {} // suppress per-frame errors
      )
      .then(() => setScanning(true))
      .catch((err) => {
        setError("Izin kamera ditolak atau tidak tersedia.");
        console.error(err);
      });

    return () => {
      if (qrRef.current?.isScanning) {
        qrRef.current.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-[var(--outline-variant)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--outline-variant)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary-container)] flex items-center justify-center">
              <Camera size={16} className="text-[var(--primary)]" />
            </div>
            <p className="text-sm font-bold text-[var(--on-surface)]">Scan QR Pelanggan</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--muted-text)] hover:bg-[var(--surface-container-high)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Camera area */}
        <div className="px-5 py-4">
          {error ? (
            <div className="flex flex-col items-center justify-center gap-3 h-48 rounded-2xl bg-[var(--error-container)] text-center">
              <AlertCircle size={28} className="text-[var(--error)]" />
              <p className="text-sm text-[var(--error)] font-medium px-4">{error}</p>
              <p className="text-xs text-[var(--muted-text)]">
                Pastikan izin kamera diaktifkan di pengaturan browser.
              </p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-black">
              {/* html5-qrcode akan render video di sini */}
              <div id="qr-reader" className="w-full" style={{ minHeight: "280px" }} />
              {!scanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="text-white text-xs animate-pulse">Mengaktifkan kamera...</div>
                </div>
              )}
            </div>
          )}
          <p className="text-center text-xs text-[var(--muted-text)] mt-3">
            Arahkan kamera ke QR Code di layar HP pelanggan
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-semibold border border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
