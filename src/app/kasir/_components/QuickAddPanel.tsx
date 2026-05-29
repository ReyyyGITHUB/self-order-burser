"use client";

import { useEffect, useState } from "react";
import { Search, Plus, ShoppingCart, Trash2, Banknote, Zap, Loader2 } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  category: { name: string };
}

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Table {
  id: string;
  tableNumber: number;
}

interface QuickAddPanelProps {
  onOrderCreated: () => void;
}

const CATEGORIES = ["Semua", "Makanan", "Minuman", "Snack"];

export default function QuickAddPanel({ onOrderCreated }: QuickAddPanelProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedTableId, setSelectedTableId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "QRIS">("CASH");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/menu").then((r) => r.json()).then((data) => setMenuItems(data.menuItems || [])).catch(() => {});
    fetch("/api/tables").then((r) => r.json()).then(setTables).catch(() => {});
  }, []);

  const filtered = menuItems.filter(
    (m) =>
      m.isAvailable &&
      (activeCategory === "Semua" || m.category.name.toLowerCase().includes(activeCategory.toLowerCase())) &&
      m.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) return prev.map((c) => c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId: string) => setCart((p) => p.filter((c) => c.menuItemId !== menuItemId));

  const totalAmount = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  const handleSubmit = async () => {
    if (!selectedTableId || !customerName || cart.length === 0) return;
    setSubmitting(true);
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId: selectedTableId,
          customerName,
          paymentMethod,
          items: cart.map((c) => ({ menuItemId: c.menuItemId, quantity: c.quantity })),
        }),
      });
      setCart([]);
      setCustomerName("");
      setSelectedTableId("");
      onOrderCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-[300px] shrink-0 flex flex-col border-l border-[var(--outline-variant)] bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[var(--outline-variant)]">
        <p className="text-sm font-semibold text-[var(--on-surface)] mb-3">Tambah Pesanan Manual</p>

        {/* Search */}
        <div className="relative mb-2">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari menu..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface-container)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="grid grid-cols-2 gap-2">
          {filtered.slice(0, 12).map((item) => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="flex flex-col items-start p-2.5 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] hover:bg-[var(--primary-container)] hover:border-[var(--primary)] transition-all active:scale-95 text-left group"
            >
              <span className="text-[11px] font-medium text-[var(--on-surface)] group-hover:text-[var(--primary)] leading-tight mb-1">
                {item.name}
              </span>
              <span className="text-[10px] font-bold text-[var(--primary)]">
                Rp {Number(item.price).toLocaleString("id-ID")}
              </span>
              <div className="mt-1.5 w-full flex justify-end">
                <div className="w-5 h-5 rounded-full bg-[var(--primary-container)] group-hover:bg-[var(--primary)] flex items-center justify-center transition-colors">
                  <Plus size={11} className="text-[var(--primary)] group-hover:text-white" />
                </div>
              </div>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-xs text-[var(--muted-text)]">Menu tidak ditemukan</div>
        )}
      </div>

      {/* Cart & Order Form */}
      <div className="border-t border-[var(--outline-variant)] px-4 py-3">
        {/* Cart Items */}
        {cart.length > 0 && (
          <div className="mb-3 space-y-1.5">
            {cart.map((c) => (
              <div key={c.menuItemId} className="flex items-center justify-between text-xs">
                <span className="text-[var(--on-surface-variant)] truncate flex-1">
                  {c.quantity}× {c.name}
                </span>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="font-semibold text-[var(--on-surface)]">
                    Rp {(c.price * c.quantity).toLocaleString("id-ID")}
                  </span>
                  <button onClick={() => removeFromCart(c.menuItemId)} className="text-[var(--muted-text)] hover:text-[var(--error)] transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-[var(--outline-variant)]">
              <span>Total</span>
              <span className="text-[var(--primary)]">Rp {totalAmount.toLocaleString("id-ID")}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-2">
          <select
            value={selectedTableId}
            onChange={(e) => setSelectedTableId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          >
            <option value="">Pilih meja...</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>Meja {t.tableNumber}</option>
            ))}
          </select>

          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama pemesan..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />

          {/* Payment method toggle */}
          <div className="flex gap-1.5">
            <button
              onClick={() => setPaymentMethod("CASH")}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                paymentMethod === "CASH"
                  ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                  : "border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]"
              }`}
            >
              <Banknote size={12} /> Cash
            </button>
            <button
              onClick={() => setPaymentMethod("QRIS")}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                paymentMethod === "QRIS"
                  ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                  : "border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]"
              }`}
            >
              <Zap size={12} /> QRIS
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedTableId || !customerName || cart.length === 0 || submitting}
            className="w-full py-2.5 rounded-xl text-sm font-bold bg-[var(--primary)] text-white hover:bg-[var(--secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
            Buat Pesanan
          </button>
        </div>
      </div>
    </div>
  );
}
