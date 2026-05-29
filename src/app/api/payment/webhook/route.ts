import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Webhook untuk menerima notifikasi pembayaran sukses dari Payment Gateway (Louvin)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Diterima Webhook Louvin:", JSON.stringify(body, null, 2));

    // Payload Louvin biasanya berisi:
    // {
    //   "event": "transaction.settled",
    //   "data": {
    //     "id": "lv_txn_123456",
    //     "reference": "ORD-9876",
    //     "status": "settled",
    //     "amount": 25000
    //   }
    // }
    //
    // Catatan: Kadang payload langsung datar (flat) tergantung konfigurasi webhook.
    const event = body.event;
    const data = body.data || body;

    const reference = data.reference; // Ini adalah ID Order kita (Contoh: ORD-9876)
    const status = data.status;       // Status pembayaran ('settled' / 'success')
    const pgTxId = data.id;           // ID transaksi dari Louvin

    if (!reference) {
      return NextResponse.json({ error: "Reference order ID tidak ditemukan di payload" }, { status: 400 });
    }

    // Hanya proses jika statusnya sukses / lunas
    if (status === "settled" || status === "success" || event === "transaction.settled") {
      // Cari pesanan berdasarkan ID (Reference)
      const order = await prisma.order.findUnique({
        where: { id: reference }
      });

      if (!order) {
        return NextResponse.json({ error: `Pesanan dengan ID ${reference} tidak ditemukan` }, { status: 404 });
      }

      // Update status pesanan di database menjadi lunas & terkonfirmasi
      const updatedOrder = await prisma.order.update({
        where: { id: reference },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED", // Otomatis masuk antrian dapur kasir
          pgTransactionId: pgTxId || order.pgTransactionId
        }
      });

      console.log(`[Webhook Success] Order ${reference} lunas otomatis via QRIS.`);

      return NextResponse.json({
        success: true,
        message: "Webhook berhasil diproses, pesanan diperbarui menjadi PAID & CONFIRMED",
        orderId: updatedOrder.id
      });
    }

    return NextResponse.json({
      success: true,
      message: `Webhook diabaikan karena status transaksi adalah: ${status}`
    });

  } catch (error: any) {
    console.error("Error memproses Webhook Louvin:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
