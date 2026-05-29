import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/reports - Mengambil ringkasan laporan penjualan untuk Owner/Admin Dashboard
export async function GET(req: Request) {
  try {
    // 1. Dapatkan semua pesanan yang sudah lunas (PAID) untuk perhitungan laporan keuangan
    const paidOrders = await prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
        status: {
          not: "CANCELLED" // Abaikan pesanan yang dibatalkan
        }
      },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    // 2. Hitung statistik dasar
    let totalRevenue = 0;
    const totalTransactions = paidOrders.length;
    const itemSalesMap = new Map<string, { name: string, quantity: number, revenue: number }>();

    paidOrders.forEach(order => {
      totalRevenue += Number(order.totalAmount);

      order.orderItems.forEach(item => {
        const menuItemId = item.menuItemId;
        const currentData = itemSalesMap.get(menuItemId) || { name: item.menuItem.name, quantity: 0, revenue: 0 };
        
        currentData.quantity += item.quantity;
        currentData.revenue += Number(item.subtotal);
        
        itemSalesMap.set(menuItemId, currentData);
      });
    });

    // 3. Konversi map penjualan item terlaris menjadi array dan urutkan berdasarkan kuantitas terbanyak
    const bestSellingItems = Array.from(itemSalesMap.entries())
      .map(([id, data]) => ({
        menuItemId: id,
        name: data.name,
        totalSold: data.quantity,
        totalRevenue: data.revenue
      }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5); // Ambil top 5 produk terlaris

    // 4. Hitung Rata-rata Nilai Pesanan (Average Order Value)
    const averageOrderValue = totalTransactions > 0 ? (totalRevenue / totalTransactions) : 0;

    // 5. Hitung perbandingan metode pembayaran (QRIS vs CASH)
    const paymentMethodsStats = {
      qris: { count: 0, revenue: 0 },
      cash: { count: 0, revenue: 0 }
    };

    paidOrders.forEach(order => {
      if (order.paymentMethod === "QRIS") {
        paymentMethodsStats.qris.count += 1;
        paymentMethodsStats.qris.revenue += Number(order.totalAmount);
      } else {
        paymentMethodsStats.cash.count += 1;
        paymentMethodsStats.cash.revenue += Number(order.totalAmount);
      }
    });

    // Kembalikan objek laporan ringkas & super mudah diolah oleh junior dev di frontend
    return NextResponse.json({
      success: true,
      summary: {
        totalRevenue: totalRevenue,
        totalTransactions: totalTransactions,
        averageOrderValue: Math.round(averageOrderValue),
      },
      paymentMethods: {
        qris: paymentMethodsStats.qris,
        cash: paymentMethodsStats.cash
      },
      bestSellingItems: bestSellingItems,
      generatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Error generating admin reports:", error);
    return NextResponse.json({ error: error.message || "Gagal membuat laporan" }, { status: 500 });
  }
}
