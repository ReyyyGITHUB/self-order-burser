"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MonitorCheck,
  History,
  LayoutDashboard,
  BarChart3,
  UtensilsCrossed,
  QrCode,
  Users,
  Settings2,
  ChefHat,
  LogOut,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  adminOnly?: boolean;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "POS",
    items: [
      { icon: MonitorCheck, label: "Live Orders", href: "/kasir" },
      { icon: History, label: "Riwayat Shift", href: "/kasir/riwayat" },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard", adminOnly: true },
      { icon: BarChart3, label: "Laporan", href: "/admin/laporan", adminOnly: true },
      { icon: UtensilsCrossed, label: "Menu", href: "/admin/menu", adminOnly: true },
      { icon: QrCode, label: "Meja & QR", href: "/admin/tables", adminOnly: true },
      { icon: Users, label: "Tim", href: "/admin/users", adminOnly: true },
      { icon: Settings2, label: "Pengaturan", href: "/admin/settings", adminOnly: true },
    ],
  },
];

export default function KasirSidebar({ currentPath }: { currentPath: string }) {
  const [userName, setUserName] = useState("Kasir");
  const [userRole, setUserRole] = useState("KASIR");

  useEffect(() => {
    const savedName = sessionStorage.getItem("kasir_name");
    const savedRole = sessionStorage.getItem("kasir_role");
    if (savedName) setUserName(savedName);
    if (savedRole) setUserRole(savedRole);
  }, []);

  const isActive = (href: string) => {
    if (href === "/kasir") return currentPath === "/kasir";
    return currentPath.startsWith(href);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("kasir_logged_in");
    sessionStorage.removeItem("kasir_username");
    sessionStorage.removeItem("kasir_name");
    sessionStorage.removeItem("kasir_role");
    window.location.href = "/kasir";
  };

  return (
    <aside className="flex flex-col w-[220px] shrink-0 h-full border-r border-[var(--outline-variant)] bg-white overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--outline-variant)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
          <ChefHat size={18} className="text-white" />
        </div>
        <div>
          <p className="font-headline font-800 text-sm text-[var(--on-surface)] leading-tight">Burser POS</p>
          <p className="text-[10px] text-[var(--muted-text)] leading-tight">v1.0.0</p>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {navGroups.map((group) => {
          const visibleItems = userRole === "ADMIN"
            ? group.items
            : group.items.filter((i) => !i.adminOnly);

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label}>
              <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-text)]">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {visibleItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                          active
                            ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]"
                            : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)]"
                        }`}
                      >
                        <item.icon size={17} className={active ? "text-[var(--primary)]" : ""} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-[var(--outline-variant)] px-3 py-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-[var(--primary-container)] flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-[var(--primary)]">{userName[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--on-surface)] truncate">{userName}</p>
            <p className="text-[10px] text-[var(--muted-text)]">{userRole === "ADMIN" ? "Owner" : "Kasir"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-[var(--muted-text)] hover:text-[var(--error)] hover:bg-[var(--error-container)] transition-colors"
            title="Keluar"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
