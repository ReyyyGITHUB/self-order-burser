"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, X, Plus, Minus, QrCode, CreditCard, ChevronRight, Check, Banknote } from "lucide-react";

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  spicyLevel?: number;
  notes?: string;
  image?: string;
}

export default function CartPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params?.id;

  const [mounted, setMounted] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "cash">("qris");
  const [orderNotes, setOrderNotes] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNotesText, setEditingNotesText] = useState("");

  useEffect(() => {
    setMounted(true);

    // Cart Force-Purge Guard & Security Redirect - Jika transaksi sudah lunas, lempar kembali ke halaman struk
    const paymentCompletedFlag = localStorage.getItem("payment_completed_flag");
    if (paymentCompletedFlag === "true") {
      router.replace(`/table/${tableId}/payment/receipt`);
      return;
    }

    // Cek transaksi pending aktif untuk auto-redirect (Solusi 3 & Lock)
    const pendingOrderStr = localStorage.getItem("pending_order_mitigation");
    if (pendingOrderStr) {
      try {
        const pendingOrder = JSON.parse(pendingOrderStr);
        const elapsed = Date.now() - pendingOrder.timestamp;
        if (elapsed < 300000) { // 5 menit
          router.push(`/table/${tableId}/payment/${pendingOrder.paymentMethod}`);
          return;
        }
      } catch (e) {
        console.error("Gagal auto-redirect:", e);
      }
    }

    const savedName = localStorage.getItem("customer_name");
    const sessionTime = localStorage.getItem("session_created_at");
    
    // Sesi kedaluwarsa setelah 2 jam (7.200.000 ms)
    const isSessionExpired = sessionTime ? (Date.now() - Number(sessionTime) > 7200000) : true;

    if (savedName && !isSessionExpired) {
      setCustomerName(savedName);
      
      const savedCart = localStorage.getItem("cart_items");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } else {
      localStorage.removeItem("customer_name");
      localStorage.removeItem("session_created_at");
      localStorage.removeItem("cart_items");
      router.push(`/table/${tableId}`);
    }
  }, []);

  const startEditingNotes = (index: number, text: string) => {
    setEditingIndex(index);
    setEditingNotesText(text);
  };

  const saveInlineNotes = (index: number) => {
    const updatedCart = [...cart];
    updatedCart[index].notes = editingNotesText;
    setCart(updatedCart);
    setEditingIndex(null);
  };

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart_items", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      removeItem(index);
      return;
    }
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQty;
    setCart(updatedCart);
  };

  const removeItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTax = () => {
    return 0; // Pajak gratis (dicoret di UI)
  };

  const getTotal = () => {
    return getSubtotal(); // Total hanya subtotal
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);

    try {
      const dbTableId = localStorage.getItem("table_id") || String(tableId);
      
      const payload = {
        tableId: dbTableId,
        customerName: customerName,
        paymentMethod: paymentMethod.toUpperCase(), // 'QRIS' atau 'CASH'
        items: cart.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          spicyLevel: item.spicyLevel || 0,
          notes: item.notes || ""
        }))
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Gagal membuat pesanan. Silakan coba lagi.");
        setIsOrdering(false);
        return;
      }

      const data = await res.json();
      const order = data.order;

      // Simpan rincian pesanan asli ke local storage untuk tracking
      const pendingOrder = {
        orderId: order.id,
        items: cart,
        total: Number(order.totalAmount),
        paymentMethod: paymentMethod, // 'qris' atau 'cash'
        timestamp: Date.now(),
        qrisData: order.qrisData // Simpan data string QRIS dari Louvin
      };
      localStorage.setItem("pending_order_mitigation", JSON.stringify(pendingOrder));

      // Hapus keranjang setelah pesanan berhasil dibuat
      localStorage.removeItem("cart_items");

      // Redirect ke route pembayaran masing-masing
      router.push(`/table/${tableId}/payment/${paymentMethod}`);
    } catch (error) {
      console.error("Gagal melakukan checkout:", error);
      alert("Terjadi kesalahan koneksi. Silakan coba lagi.");
      setIsOrdering(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-cta border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="bg-page-bg min-h-screen flex flex-col font-sans text-on-surface w-full max-w-md mx-auto shadow-lg justify-center p-8 text-center gap-6">
        <div className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center text-success mx-auto animate-bounce">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Pesanan Terkirim!</h2>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">
            Terima kasih, <strong>{customerName}</strong>. Pesananmu telah terkirim ke dapur. Silakan melakukan pembayaran melalui kasir atau instruksi QRIS yang diberikan.
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
    <div className="bg-page-bg min-h-screen flex flex-col font-sans text-on-surface w-full max-w-md mx-auto shadow-lg relative pb-32">
      {/* Header */}
      <header className="bg-white border-b border-border-subtle px-6 py-4 flex items-center sticky top-0 z-30 shadow-sm gap-4">
        <button
          onClick={() => router.push(`/table/${tableId}`)}
          className="p-2 hover:bg-zinc-100 rounded-full text-text-primary transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-bold text-base text-text-primary">Keranjang Belanja</h2>
          <p className="text-[10px] text-muted-text font-mono uppercase tracking-wider mt-0.5">Meja {tableId} · {customerName}</p>
        </div>
      </header>

      {/* Main Cart Items */}
      <main className="flex-grow p-6 flex flex-col gap-6 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 bg-zinc-200/50 rounded-full flex items-center justify-center text-muted-text">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary">Keranjang Kosong</h3>
              <p className="text-xs text-muted-text mt-1 max-w-[200px] leading-relaxed">
                Belum ada makanan terpilih. Kembali ke menu untuk memilih hidangan.
              </p>
            </div>
            <button
              onClick={() => router.push(`/table/${tableId}`)}
              className="mt-2 text-xs font-bold text-primary-cta hover:underline"
            >
              Lihat Menu Utama
            </button>
          </div>
        ) : (
          <>
            {/* Cart list section */}
            <section className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-muted-text font-sans">Pesanan Anda</h3>
              <div className="flex flex-col gap-3">
                {cart.map((item, idx) => (
                  <article
                    key={`${item.menuItemId}-${idx}`}
                    className="bg-card-bg border border-border-subtle rounded-2xl p-4 flex gap-4 shadow-sm relative items-start"
                  >
                    {/* Item Image */}
                    {item.image && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0 border border-border-light">
                        <img
                          alt={item.name}
                          src={item.image}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Item Info */}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm text-text-primary truncate">{item.name}</h4>
                        <button
                          onClick={() => removeItem(idx)}
                          className="p-1 hover:bg-zinc-100 rounded-full text-muted-text hover:text-secondary-cta transition-colors flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-mono text-xs text-primary-cta mt-0.5">Rp {item.price.toLocaleString("id-ID")}</p>
                      
                      {/* Spicy & Notes badge tags with inline editor */}
                      {editingIndex === idx ? (
                        <div className="flex gap-1.5 items-center mt-2 w-full">
                          <input
                            type="text"
                            className="bg-white border border-primary-cta rounded-lg px-2.5 py-1 text-xs text-text-primary flex-grow min-w-0 focus:outline-none focus:ring-1 focus:ring-primary-cta"
                            value={editingNotesText}
                            onChange={(e) => setEditingNotesText(e.target.value)}
                            placeholder="Catatan porsi ini..."
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveInlineNotes(idx);
                              if (e.key === "Escape") setEditingIndex(null);
                            }}
                          />
                          <button
                            onClick={() => saveInlineNotes(idx)}
                            className="bg-primary-cta text-white p-1.5 rounded-lg hover:bg-primary-cta/90 transition-colors flex items-center justify-center flex-shrink-0"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="bg-zinc-200 text-text-primary p-1.5 rounded-lg hover:bg-zinc-300 transition-colors flex items-center justify-center flex-shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.spicyLevel !== undefined && (
                            <span className="bg-secondary-cta/10 text-secondary-cta px-2 py-0.5 rounded-md font-mono text-[9px] font-bold">
                              Lvl {item.spicyLevel} ({item.spicyLevel === 0 ? "Ori" : item.spicyLevel === 1 ? "Sedang" : item.spicyLevel === 2 ? "Pedas" : "Gila"})
                            </span>
                          )}
                          <button
                            onClick={() => startEditingNotes(idx, item.notes || "")}
                            className="bg-zinc-100 hover:bg-zinc-200 text-muted-text px-2 py-0.5 rounded-md text-[9px] font-semibold flex items-center gap-1 transition-colors group"
                            title="Edit catatan porsi ini"
                          >
                            <span className="truncate max-w-[150px]">{item.notes ? `"${item.notes}"` : "+ Tambah catatan"}</span>
                          </button>
                        </div>
                      )}

                      {/* Quantity counter inside card */}
                      <div className="flex justify-end mt-3">
                        <div className="flex items-center bg-zinc-50 border border-border-subtle rounded-lg shadow-sm">
                          <button
                            onClick={() => updateQuantity(idx, item.quantity - 1)}
                            className="px-2.5 py-1.5 hover:bg-zinc-100 text-muted-text transition-colors flex items-center justify-center focus:outline-none"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs px-2.5 text-center min-w-[28px] font-bold text-text-primary">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(idx, item.quantity + 1)}
                            className="px-2.5 py-1.5 hover:bg-zinc-100 text-primary-cta transition-colors flex items-center justify-center focus:outline-none"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Payment Selector section */}
            <section className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-muted-text font-sans">Metode Pembayaran</h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative cursor-pointer">
                  <input
                    checked={paymentMethod === "qris"}
                    onChange={() => setPaymentMethod("qris")}
                    className="peer sr-only"
                    name="payment_method"
                    type="radio"
                    value="qris"
                  />
                  <div className="p-4 rounded-2xl border border-border-subtle bg-white flex flex-col items-center justify-center gap-2 transition-all peer-checked:border-primary-cta peer-checked:bg-primary-cta/5 peer-checked:shadow-sm">
                    <QrCode className="w-7 h-7 text-primary-cta" />
                    <span className="font-bold text-xs text-text-primary">QRIS</span>
                  </div>
                  <div className="absolute top-2 right-2 hidden peer-checked:flex text-primary-cta">
                    <Check className="w-4 h-4 bg-primary-cta text-white rounded-full p-0.5" />
                  </div>
                </label>

                <label className="relative cursor-pointer">
                  <input
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    className="peer sr-only"
                    name="payment_method"
                    type="radio"
                    value="cash"
                  />
                  <div className="p-4 rounded-2xl border border-border-subtle bg-white flex flex-col items-center justify-center gap-2 transition-all peer-checked:border-primary-cta peer-checked:bg-primary-cta/5 peer-checked:shadow-sm">
                    <Banknote className="w-7 h-7 text-muted-text peer-checked:text-primary-cta" />
                    <span className="font-bold text-xs text-text-primary">Tunai / Kasir</span>
                  </div>
                  <div className="absolute top-2 right-2 hidden peer-checked:flex text-primary-cta">
                    <Check className="w-4 h-4 bg-primary-cta text-white rounded-full p-0.5" />
                  </div>
                </label>
              </div>
            </section>

            {/* Notes Section */}
            <section className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-muted-text font-sans">Instruksi Tambahan untuk Meja</h3>
              <textarea
                className="w-full bg-white border border-border-subtle rounded-2xl p-4 text-xs text-text-primary placeholder:text-muted-text/30 focus:border-primary-cta focus:outline-none resize-none transition-colors shadow-sm"
                placeholder="Contoh: minta sendok tambahan 2, minuman disajikan belakangan..."
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
            </section>

            {/* Price Calculations */}
            <section className="bg-card-bg border border-border-subtle rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
              <div className="flex justify-between items-center text-xs text-muted-text font-medium">
                <span>Subtotal</span>
                <span className="font-mono text-text-primary">Rp {getSubtotal().toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-text font-medium">
                <span className="line-through opacity-50">Pajak (11%)</span>
                <span className="font-mono text-success font-semibold flex items-center gap-1.5">
                  <span className="line-through text-muted-text/50 font-normal text-[10px]">Rp {Math.round(getSubtotal() * 0.11).toLocaleString("id-ID")}</span>
                  <span>Rp 0</span>
                </span>
              </div>
              <hr className="border-border-subtle my-1" />
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs uppercase tracking-wider font-bold text-text-primary">Total Pembayaran</span>
                <span className="font-mono text-lg font-bold text-primary-cta">Rp {getTotal().toLocaleString("id-ID")}</span>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Sticky Bottom Action */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-4 z-30 bg-gradient-to-t from-page-bg via-page-bg/95 to-transparent">
          <button
            onClick={handlePlaceOrder}
            disabled={isOrdering}
            className="w-full bg-primary-cta text-white py-4 px-5 rounded-xl font-bold shadow-lg hover:bg-primary-cta/95 transition-all active:scale-[0.98] flex items-center justify-between text-sm disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4.5 h-4.5" />
              <span>{isOrdering ? "Memproses..." : "Pesan Sekarang"}</span>
            </span>
            <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-lg">
              <span>Rp {getTotal().toLocaleString("id-ID")}</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
