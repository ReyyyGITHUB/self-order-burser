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

// PATCH /api/orders/[id] - Update status pesanan / pembayaran / tambah item oleh kasir
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus, kasirId, items } = body;

    // Ambil data order lama untuk pengecekan beserta item dan harga menunya
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true
      }
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

    // Catat ID Kasir yang memproses pesanan ini (Pastikan user ada di DB untuk cegah Foreign Key error)
    if (kasirId) {
      const userExists = await prisma.user.findUnique({
        where: { id: kasirId }
      });
      if (userExists) {
        updateData.kasirId = kasirId;
      }
    }

    // PENANGANAN PENAMBAHAN/EDIT ITEM KASIR SECARA REALTIME
    if (items && Array.isArray(items)) {
      let newTotalAmount = 0;

      // Hapus item lama terlebih dahulu untuk kita gantikan dengan komposisi item yang baru
      await prisma.orderItem.deleteMany({
        where: { orderId: id }
      });

      // Iterasi item menu baru untuk dihitung harganya
      const newItemsData = [];
      for (const item of items) {
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: item.menuItemId }
        });

        if (menuItem) {
          const subtotal = Number(menuItem.price) * item.quantity;
          newTotalAmount += subtotal;

          newItemsData.push({
            orderId: id,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: Number(menuItem.price),
            subtotal: subtotal,
            spicyLevel: 0,
            notes: item.notes || ""
          });
        }
      }

      // Buat item baru di database
      await prisma.orderItem.createMany({
        data: newItemsData
      });

      // Update nilai total belanja baru
      updateData.totalAmount = newTotalAmount;
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
