import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/kasir/shift/close - Tutup shift aktif
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shiftId, endingCash } = body;

    if (!shiftId || endingCash === undefined) {
      return NextResponse.json({ error: "ID Shift dan uang kas fisik akhir wajib diisi" }, { status: 400 });
    }

    const shift = await prisma.kasirShift.findUnique({
      where: { id: shiftId },
    });

    if (!shift) {
      return NextResponse.json({ error: "Shift tidak ditemukan" }, { status: 404 });
    }

    if (shift.status === "CLOSED") {
      return NextResponse.json({ error: "Shift ini sudah ditutup sebelumnya" }, { status: 400 });
    }

    // Hitung expectedCash secara dinamis dari order CASH yang PAID di shift ini
    const cashOrders = await prisma.order.findMany({
      where: {
        shiftId: shiftId,
        paymentMethod: "CASH",
        paymentStatus: "PAID",
      },
      select: { totalAmount: true },
    });

    const totalCash = cashOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const expectedCash = Number(shift.startingCash) + totalCash;

    const closedShift = await prisma.kasirShift.update({
      where: { id: shiftId },
      data: {
        endTime: new Date(),
        endingCash: Number(endingCash),
        expectedCash: expectedCash,
        status: "CLOSED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Shift berhasil ditutup",
      shift: closedShift,
      summary: {
        startingCash: Number(shift.startingCash),
        totalCashSales: totalCash,
        expectedCash: expectedCash,
        endingCash: Number(endingCash),
        discrepancy: Number(endingCash) - expectedCash,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal menutup shift" }, { status: 500 });
  }
}
