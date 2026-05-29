import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/kasir/shift/start - Buka shift baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { kasirName, startingCash } = body;

    if (!kasirName || startingCash === undefined) {
      return NextResponse.json({ error: "Nama kasir dan modal awal wajib diisi" }, { status: 400 });
    }

    // Cek apakah ada shift yang masih aktif
    const existingActiveShift = await prisma.kasirShift.findFirst({
      where: { status: "OPEN" },
    });

    if (existingActiveShift) {
      return NextResponse.json({
        error: "Ada shift yang masih aktif. Tutup shift tersebut terlebih dahulu.",
        shift: existingActiveShift,
      }, { status: 400 });
    }

    const newShift = await prisma.kasirShift.create({
      data: {
        kasirName,
        startingCash: Number(startingCash),
        expectedCash: Number(startingCash),
        status: "OPEN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Shift baru berhasil dibuka",
      shift: newShift,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal membuka shift" }, { status: 500 });
  }
}
