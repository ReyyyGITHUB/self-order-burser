import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/orders/[id] - Mengambil detail pesanan berdasarkan ID pendek untuk tracking pelanggan/kasir
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        },
        table: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal mengambil detail pesanan" }, { status: 500 });
  }
}

// PATCH /api/orders/[id] - Update status pesanan / pembayaran oleh kasir
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus, kasirId } = body;

    // Ambil data order lama untuk pengecekan
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    // Siapkan objek data untuk diupdate
    const updateData: any = {};

    // Jika kasir mengupdate status pesanan (e.g. PROCESSING, COMPLETED, CANCELLED)
    if (status) {
      updateData.status = status;
    }

    // Jika kasir mengupdate status pembayaran (e.g. PAID untuk CASH)
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      
      // Jika pembayaran dikonfirmasi lunas, status pesanan otomatis berubah jadi CONFIRMED (diterima dapur) jika sebelumnya masih PENDING_PAYMENT
      if (paymentStatus === "PAID" && existingOrder.status === "PENDING_PAYMENT") {
        updateData.status = "CONFIRMED";
      }
    }

    // Catat ID Kasir yang memproses pesanan ini
    if (kasirId) {
      updateData.kasirId = kasirId;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        },
        table: true
      }
    });

    // Jika pesanan selesai (COMPLETED) atau dibatalkan (CANCELLED), kembalikan status meja menjadi AVAILABLE (Kosong/Tersedia)
    if (status === "COMPLETED" || status === "CANCELLED") {
      await prisma.table.update({
        where: { id: updatedOrder.tableId },
        data: { status: "AVAILABLE" }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Status pesanan berhasil diperbarui",
      order: updatedOrder
    });

  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: error.message || "Gagal memperbarui pesanan" }, { status: 500 });
  }
}
