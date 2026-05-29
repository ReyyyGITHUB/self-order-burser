import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/kasir/shift/active - Cek apakah ada shift aktif
export async function GET() {
  try {
    const activeShift = await prisma.kasirShift.findFirst({
      where: { status: "OPEN" },
      orderBy: { startTime: "desc" },
    });

    if (!activeShift) {
      return NextResponse.json({ active: false, shift: null });
    }

    // Hitung expectedCash secara dinamis dari order CASH yang PAID di shift ini
    const cashOrders = await prisma.order.findMany({
      where: {
        shiftId: activeShift.id,
        paymentMethod: "CASH",
        paymentStatus: "PAID",
      },
      select: { totalAmount: true },
    });

    const totalCash = cashOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const expectedCash = Number(activeShift.startingCash) + totalCash;

    return NextResponse.json({
      active: true,
      shift: {
        ...activeShift,
        expectedCash,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal memeriksa shift aktif" }, { status: 500 });
  }
}
