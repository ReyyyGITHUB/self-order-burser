"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowUpRight, Check, Utensils, Plus, Minus, ShoppingBag, X, Flame, MessageSquare, ChevronDown, LogOut } from "lucide-react";

// Hardcoded Menu Data
const MENU_ITEMS = [
  {
    id: "1",
    name: "Mie Dok Dok",
    description: "Mie soup khas burjo dengan bumbu gurih kental, telur orak-arik, sayuran segar, dan kuah hangat nikmat.",
    price: 15000,
    category: "Makanan",
    hasSpicy: true,
    hasNotes: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaXctnCpXa9SsX1UUUvcWzipjtw_MSj6POf1WGxJ3NlJ8gptVSpLqX1dCxs5rWo0sKtzcu8lW4pGA50f4TyG_evAjx6EzHNNSb6sZHfSVlGn1VcI8paZAzAXDBuPm62s_P4wfRVediR1E6jzwawhPOeUUIN2s4D7RRo2cDis2C2HVSrbOcZ_qjlTrmFsIHkcohPLQeODB4Xn9aHC-zvp4e2SUCTHmo_rLlo_USWV-E3S-AOxfLezKt-ScQDFJ15sTCbXPwIBpLvrF2"
  },
  {
    id: "2",
    name: "Nasi Gila Burjo",
    description: "Nasi hangat bertabur tumisan sosis, bakso, telur dengan bumbu manis pedas gurih ala Burjo Semarang.",
    price: 16000,
    category: "Makanan",
    hasSpicy: true,
    hasNotes: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcAh5dbOT5X0_Ct7TRMW4EK-AUm6a2oFyPrhfru5ARdYMJq3JBK0elVSIPWbe_2CbudgQReT0w4-jMmOmP0BuBq_XHcVwdDhAbQmQJtZ8Ro8z5dQBvjwFoGNeS6dgsgS--MrZ-_ZtgvezN8YwIZpcoK8jphHo96sMZhgw2vbFiIchw1bYx-laVeYGzPlvK-QZtHrDufTUXc3BHqg3L1xa2Gg7N_9ps7XkbFcvmIuUdDpAU0YG74GU3wEpGddA16afAG89HndVMt7PF"
  },
  {
    id: "3",
    name: "Intel Rebus (Indomie Telur)",
    description: "Indomie rebus hangat disajikan dengan telur rebus setengah matang, sawi hijau, dan taburan bawang goreng.",
    price: 12000,
    category: "Makanan",
    hasSpicy: true,
    hasNotes: true,
    image: "https://lh3.googleusercontent.com/aida/ADBb0ujJZwC405KohpKlRRL8AktY3CJ-4zju7BbjO6kGYBhsLNb91RgKGI6hIqLT8smd7Ld6yOgpPiL0vhDztklGh4mS-7i1QPy4mpzNy-YfB_DvOLkUmdykQsw1DuKDJDdixzZa73y-KuBu104EOX1pcSqeTkOl3uDhEXoH_1UvY-BOLp3ZBiwHD36stiIaSYIx_Uw2o4IQPLpMmaFIMOvJNkoZJeroNfvUCNr0p3cU_BmEXD72mlqdflZGT8UW"
  },
  {
    id: "4",
    name: "Bubur Kacang Ijo",
    description: "Bubur kacang hijau manis legit disiram santan gurih kental dan susu kental manis.",
    price: 10000,
    category: "Makanan",
    hasSpicy: false,
    hasNotes: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcAh5dbOT5X0_Ct7TRMW4EK-AUm6a2oFyPrhfru5ARdYMJq3JBK0elVSIPWbe_2CbudgQReT0w4-jMmOmP0BuBq_XHcVwdDhAbQmQJtZ8Ro8z5dQBvjwFoGNeS6dgsgS--MrZ-_ZtgvezN8YwIZpcoK8jphHo96sMZhgw2vbFiIchw1bYx-laVeYGzPlvK-QZtHrDufTUXc3BHqg3L1xa2Gg7N_9ps7XkbFcvmIuUdDpAU0YG74GU3wEpGddA16afAG89HndVMt7PF"
  },
  {
    id: "5",
    name: "Es Teh Manis",
    description: "Teh seduh khas burjo manis dingin menyegarkan tenggorokan.",
    price: 4000,
    category: "Minuman",
    hasSpicy: false,
    hasNotes: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcAh5dbOT5X0_Ct7TRMW4EK-AUm6a2oFyPrhfru5ARdYMJq3JBK0elVSIPWbe_2CbudgQReT0w4-jMmOmP0BuBq_XHcVwdDhAbQmQJtZ8Ro8z5dQBvjwFoGNeS6dgsgS--MrZ-_ZtgvezN8YwIZpcoK8jphHo96sMZhgw2vbFiIchw1bYx-laVeYGzPlvK-QZtHrDufTUXc3BHqg3L1xa2Gg7N_9ps7XkbFcvmIuUdDpAU0YG74GU3wEpGddA16afAG89HndVMt7PF"
  },
  {
    id: "6",
    name: "Es Jeruk Peras",
    description: "Jeruk peras asli segar kaya vitamin C disajikan dingin.",
    price: 6000,
    category: "Minuman",
    hasSpicy: false,
    hasNotes: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcAh5dbOT5X0_Ct7TRMW4EK-AUm6a2oFyPrhfru5ARdYMJq3JBK0elVSIPWbe_2CbudgQReT0w4-jMmOmP0BuBq_XHcVwdDhAbQmQJtZ8Ro8z5dQBvjwFoGNeS6dgsgS--MrZ-_ZtgvezN8YwIZpcoK8jphHo96sMZhgw2vbFiIchw1bYx-laVeYGzPlvK-QZtHrDufTUXc3BHqg3L1xa2Gg7N_9ps7XkbFcvmIuUdDpAU0YG74GU3wEpGddA16afAG89HndVMt7PF"
  }
];

const CATEGORIES = ["Semua", "Makanan", "Minuman"];

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  spicyLevel?: number;
  notes?: string;
  image?: string;
}

export default function TablePage() {
  const params = useParams();
  const tableId = params?.id;

  const [mounted, setMounted] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [inputName, setInputName] = useState("");

  // Menu List states
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [cart, setCart] = useState<CartItem[]>([]);

  // Bottom Sheet customization states
  const [selectedItem, setSelectedItem] = useState<typeof MENU_ITEMS[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [customSpicyLevel, setCustomSpicyLevel] = useState(1); // 0: Ori, 1: Sedang, 2: Pedas, 3: Gila
  const [customNotes, setCustomNotes] = useState("");
  const [customQuantity, setCustomQuantity] = useState(1);
  const [showDesc, setShowDesc] = useState(false);

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

  const handleOpenCustomization = (item: typeof MENU_ITEMS[0]) => {
    setSelectedItem(item);
    setCustomSpicyLevel(item.hasSpicy ? 1 : 0);
    setCustomNotes("");
    setCustomQuantity(1);
    setShowDesc(false);
    setSheetOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const newItem: CartItem = {
      menuItemId: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: customQuantity,
      spicyLevel: selectedItem.hasSpicy ? customSpicyLevel : undefined,
      notes: customNotes.trim() ? customNotes.trim() : undefined,
      image: selectedItem.image
    };

    // Cari item yang sama persis kustomisasinya di keranjang
    const existingIndex = cart.findIndex(
      (item) =>
        item.menuItemId === newItem.menuItemId &&
        item.spicyLevel === newItem.spicyLevel &&
        item.notes === newItem.notes
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += newItem.quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, newItem]);
    }

    setSheetOpen(false);
    setSelectedItem(null);
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalCartPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const filteredMenuItems = selectedCategory === "Semua"
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-cta border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // View 1: ONBOARDING VIEW
  if (!isRegistered) {
    return (
      <div className="bg-surface h-[100dvh] max-h-screen overflow-hidden flex flex-col font-sans antialiased text-on-surface w-full max-w-md mx-auto shadow-md">
        {/* Top: Magazine-style framed image */}
        <div className="w-full px-6 pt-5 pb-1 flex-shrink-0 max-h-[30vh]">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl shadow-sm bg-surface-container-high h-full">
            <img
              alt="Appetizing bowl of warm Burjo Order noodles"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaXctnCpXa9SsX1UUUvcWzipjtw_MSj6POf1WGxJ3NlJ8gptVSpLqX1dCxs5rWo0sKtzcu8lW4pGA50f4TyG_evAjx6EzHNNSb6sZHfSVlGn1VcI8paZAzAXDBuPm62s_P4wfRVediR1E6jzwawhPOeUUIN2s4D7RRo2cDis2C2HVSrbOcZ_qjlTrmFsIHkcohPLQeODB4Xn9aHC-zvp4e2SUCTHmo_rLlo_USWV-E3S-AOxfLezKt-ScQDFJ15sTCbXPwIBpLvrF2"
            />
          </div>
        </div>

        {/* Bottom: Content & Form */}
        <div className="flex-1 flex flex-col justify-center px-8 pb-8 z-10 bg-surface overflow-hidden gap-8">
          {/* Editorial Header Text */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs tracking-widest uppercase text-primary-cta font-semibold">MEJA {tableId}</span>
              <Utensils className="w-3.5 h-3.5 text-primary-cta" />
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
              <label className="font-mono text-[10px] tracking-widest text-outline" htmlFor="namaLengkap">
                Nama Lengkap
              </label>
              <div className="relative group">
                <input
                  className="w-full bg-transparent border-0 border-b-2 border-border-subtle py-2 px-0 font-sans text-base sm:text-lg text-on-surface placeholder:text-muted-text/30 focus:ring-0 focus:border-primary focus:outline-none transition-all rounded-none"
                  id="namaLengkap"
                  placeholder="Masukkan nama"
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

  // View 2: MAIN MENU & HOME PAGE (AFTER ONBOARDING)
  return (
    <div className="bg-page-bg min-h-screen flex flex-col font-sans text-on-surface w-full max-w-md mx-auto shadow-lg relative overflow-x-hidden">
      
      {/* Dimming overlay when Bottom Sheet is open */}
      {sheetOpen && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSheetOpen(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-border-subtle px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div>
          <h2 className="font-bold text-base text-primary-cta flex items-center gap-1.5">
            <Utensils className="w-4 h-4" />
            Burjo Semarang
          </h2>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] bg-primary-cta/10 text-primary-cta font-semibold px-2 py-0.5 rounded-full">Meja {tableId}</span>
            <span className="text-xs text-muted-text">· Halo, {customerName}</span>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("customer_name");
            setIsRegistered(false);
            setCart([]);
          }}
          className="p-2 text-secondary-cta hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
          title="Keluar"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      </header>

      {/* Main Body Container */}
      <main className="flex-1 px-6 pt-5 pb-24 overflow-y-auto">
        {/* Banner Promo */}
        <div className="bg-primary-cta text-white rounded-2xl p-4 mb-6 shadow-sm flex justify-between items-center relative overflow-hidden">
          <div className="z-10 max-w-[70%]">
            <span className="font-mono text-[9px] uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">PROMO SPESIAL</span>
            <h3 className="font-bold text-lg leading-tight mt-2">Mie Dok Dok Terfavorit!</h3>
            <p className="text-xs text-white/80 mt-1">Hanya Rp 15.000 dengan rasa khas Semarang.</p>
          </div>
          <Flame className="w-20 h-20 text-white/10 absolute -right-4 -bottom-4 transform rotate-12" />
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none sticky top-[68px] bg-page-bg z-20">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? "bg-primary-cta border-primary-cta text-white shadow-sm"
                  : "bg-white border-border-subtle text-muted-text hover:border-primary-cta/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="bg-card-bg border border-border-subtle rounded-2xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                {/* Product Image */}
                {item.image && (
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 relative shadow-sm border border-border-light mb-2.5">
                    <img
                      alt={item.name}
                      src={item.image}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Product Info */}
                <h4 className="font-bold text-sm text-text-primary line-clamp-1">{item.name}</h4>
              </div>

              <div className="flex flex-col gap-2 mt-3 w-full">
                <span className="font-bold text-[14px] text-primary-cta">
                  Rp {item.price.toLocaleString("id-ID")}
                </span>
                <button
                  onClick={() => handleOpenCustomization(item)}
                  className="w-full bg-primary-cta/10 text-primary-cta hover:bg-primary-cta hover:text-white py-2 rounded-xl text-xs font-bold transition-all active:scale-95 duration-100 flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Summary Bar (if cart has items) */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-4 z-30 bg-gradient-to-t from-page-bg via-page-bg/95 to-transparent">
          <button className="w-full bg-primary-cta text-white py-3.5 px-4 rounded-xl shadow-lg hover:bg-primary-cta/95 transition-all active:scale-[0.98] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 text-white p-2 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs text-white/90 font-medium">{getTotalCartItems()} pesanan</p>
                <p className="text-sm font-semibold text-white mt-0.5">Rp {getTotalCartPrice().toLocaleString("id-ID")}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/20 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors hover:bg-white/30">
              <span>Pesan sekarang</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}
      {/* Bottom Sheet Customization */}
      {selectedItem && (
        <div
          className={`fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white rounded-t-2xl z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out border-t border-border-light ${
            sheetOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Header Drag Handle */}
          <div className="w-full flex justify-center py-2.5 cursor-pointer" onClick={() => setSheetOpen(false)}>
            <div className="w-12 h-1 bg-zinc-300 rounded-full" />
          </div>

          {/* Item Meta info */}
          <div className="px-6 py-4 flex gap-4 border-b border-border-subtle items-center">
            {selectedItem.image && (
              <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0 border border-border-light">
                <img
                  alt={selectedItem.name}
                  src={selectedItem.image}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-text-primary">{selectedItem.name}</h3>
              <p className="font-bold text-sm text-primary-cta mt-0.5">Rp {selectedItem.price.toLocaleString("id-ID")}</p>
              
              {/* Description Toggle */}
              {selectedItem.description && (
                <button
                  type="button"
                  onClick={() => setShowDesc(!showDesc)}
                  className="flex items-center gap-1 mt-1 text-[10px] text-primary-cta font-bold hover:underline focus:outline-none"
                >
                  <span>{showDesc ? "Sembunyikan Detail" : "Lihat Detail Makanan"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transform transition-transform duration-200 ${showDesc ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>
          </div>

          {/* Collapsible Description Box */}
          {showDesc && selectedItem.description && (
            <div className="px-6 py-3 bg-zinc-50 border-b border-border-subtle text-[11px] text-muted-text leading-relaxed">
              {selectedItem.description}
            </div>
          )}

          <div className="px-6 py-4 overflow-y-auto max-h-[40vh] gap-5 flex flex-col">
            {/* Spicy Customization (if applicable) */}
            {selectedItem.hasSpicy && (
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Flame className="w-3.5 h-3.5 text-secondary-cta" />
                  <h4 className="font-bold text-xs text-text-primary uppercase tracking-wider font-mono">Level Pedas</h4>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((lvl) => {
                    const title = lvl === 0 ? "Ori" : lvl === 1 ? "Sedang" : lvl === 2 ? "Pedas" : "Gila";
                    const label = lvl === 0 ? "Lvl 0" : lvl === 1 ? "Lvl 1" : lvl === 2 ? "Lvl 2" : "Lvl 3";
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setCustomSpicyLevel(lvl)}
                        className={`flex-1 py-2 px-1 rounded-xl text-center border transition-all ${
                          customSpicyLevel === lvl
                            ? "bg-primary-cta/15 border-primary-cta text-primary-cta shadow-sm font-bold scale-[1.02]"
                            : "bg-card-bg border-border-subtle text-muted-text hover:border-primary-cta/50"
                        }`}
                      >
                        <div className="text-xs font-bold leading-none">{title}</div>
                        <div className="text-[9px] opacity-70 mt-1 leading-none">{label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Notes */}
            {selectedItem.hasNotes && (
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <MessageSquare className="w-3.5 h-3.5 text-primary-cta" />
                  <h4 className="font-bold text-xs text-text-primary uppercase tracking-wider font-mono">
                    Catatan Khusus <span className="text-[10px] text-muted-text font-normal lowercase">(opsional)</span>
                  </h4>
                </div>
                <textarea
                  className="w-full bg-card-bg border border-border-subtle rounded-xl p-3 text-xs text-text-primary placeholder:text-muted-text/30 focus:border-primary-cta focus:outline-none resize-none transition-colors shadow-inner"
                  placeholder="Contoh: tanpa sawi, telur setengah matang..."
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Sticky Action Footer: Quantity Selector and Add CTA */}
          <div className="px-6 py-4 border-t border-border-subtle bg-white rounded-b-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-xs uppercase tracking-wider font-mono text-text-primary">Jumlah</span>
              <div className="flex items-center bg-card-bg border border-border-subtle rounded-xl shadow-sm">
                <button
                  type="button"
                  onClick={() => setCustomQuantity(Math.max(1, customQuantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-muted-text hover:text-primary-cta transition-colors focus:outline-none"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-bold text-xs text-text-primary">{customQuantity}</span>
                <button
                  type="button"
                  onClick={() => setCustomQuantity(customQuantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-primary-cta hover:text-primary-cta/80 transition-colors focus:outline-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary-cta text-white py-3.5 px-5 rounded-xl font-bold shadow-md hover:bg-primary-cta/95 transition-all active:scale-[0.98] flex items-center justify-between text-sm"
            >
              <span>Tambah ke Keranjang</span>
              <span>Rp {(selectedItem.price * customQuantity).toLocaleString("id-ID")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
