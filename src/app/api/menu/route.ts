import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/menu - Mengambil daftar menu aktif & kategori langsung dari Supabase
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" }
    });

    const menuItems = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      include: {
        category: true
      },
      orderBy: {
        name: "asc"
      }
    });

    return NextResponse.json({
      success: true,
      categories: categories,
      menuItems: menuItems
    });
  } catch (error: any) {
    console.error("Gagal mengambil menu:", error);
    return NextResponse.json({ error: error.message || "Gagal mengambil data menu" }, { status: 500 });
  }
}
