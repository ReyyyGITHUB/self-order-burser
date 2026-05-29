import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate ID pendek & mudah dibaca untuk Junior Devs (Contoh: ORD-9876)
function generateShortOrderId(): string {
  const random4Digits = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${random4Digits}`;
}

// Generate ID item yang mudah didebug (Contoh: ITEM-ORD-9876-1)
function generateOrderItemId(orderId: string, index: number): string {
  return `ITEM-${orderId}-${index + 1}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tableId, customerName, paymentMethod, items, kasirId } = body;

    // 1. Validasi Input Dasar
    if (!tableId || !customerName || !paymentMethod || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Data pesanan tidak lengkap" }, { status: 400 });
    }

    // 2. Cek apakah Meja terdaftar
    const tableExists = await prisma.table.findUnique({
      where: { id: tableId }
    });
    if (!tableExists) {
      return NextResponse.json({ error: "Meja tidak ditemukan" }, { status: 404 });
    }

    // 3. Ambil Detail Item Menu dari Database untuk hitung harga asli (Cegah manipulasi harga dari frontend)
    const menuItemIds = items.map((item: any) => item.menuItemId);
    const dbMenuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } }
    });

    // Buat map menu item untuk mempermudah pencarian harga
    const menuMap = new Map<string, any>();
    dbMenuItems.forEach(item => {
      menuMap.set(item.id, item);
    });

    // 4. Hitung Total Pembayaran & Siapkan data OrderItem
    let totalAmount = 0;
    const orderItemsData: any[] = [];
    const generatedOrderId = generateShortOrderId();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const dbItem = menuMap.get(item.menuItemId);

      if (!dbItem) {
        return NextResponse.json({ error: `Item menu dengan ID ${item.menuItemId} tidak ditemukan` }, { status: 404 });
      }

      if (!dbItem.isAvailable) {
        return NextResponse.json({ error: `Item menu ${dbItem.name} sedang habis` }, { status: 400 });
      }

      const quantity = Number(item.quantity);
      const unitPrice = Number(dbItem.price);
      const subtotal = unitPrice * quantity;
      totalAmount += subtotal;

      orderItemsData.push({
        id: generateOrderItemId(generatedOrderId, i),
        menuItemId: item.menuItemId,
        quantity: quantity,
        unitPrice: unitPrice,
        spicyLevel: item.spicyLevel || 0,
        notes: item.notes || "",
        subtotal: subtotal
      });
    }

    // 5. Simpan ke Database menggunakan Prisma Transaction
    // Cek apakah kasirId valid di DB jika dikirim (cegah foreign key error)
    let verifiedKasirId: string | null = null;
    if (kasirId) {
      const userExists = await prisma.user.findUnique({
        where: { id: kasirId }
      });
      if (userExists) {
        verifiedKasirId = kasirId;
      }
    }

    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
    const initialPaymentStatus = (paymentMethod === "QRIS" && isDemoMode) ? "PAID" : "UNPAID";
    const initialOrderStatus = (paymentMethod === "QRIS" && isDemoMode) ? "COMPLETED" : "PENDING_PAYMENT";

    const newOrder = await prisma.$transaction(async (tx) => {
      // Buat Order baru
      const order = await tx.order.create({
        data: {
          id: generatedOrderId,
          tableId: tableId,
          customerName: customerName,
          paymentMethod: paymentMethod,
          paymentStatus: initialPaymentStatus,
          status: initialOrderStatus,
          totalAmount: totalAmount,
          kasirId: verifiedKasirId, // Hubungkan ID kasir agar terdeteksi antrean manual jika valid
          orderItems: {
            create: orderItemsData
          }
        },
        include: {
          orderItems: {
            include: {
              menuItem: true
            }
          },
          table: true
        }
      });

      // Update status meja menjadi OCCUPIED (Terisi) atau tetap AVAILABLE jika pesanan langsung selesai (mode demo)
      await tx.table.update({
        where: { id: tableId },
        data: { status: initialOrderStatus === "COMPLETED" ? "AVAILABLE" : "OCCUPIED" }
      });

      return order;
    });

    // 6. Jika metode pembayaran QRIS, langsung panggil API internal Louvin untuk buat transaksi QRIS
    if (paymentMethod === "QRIS") {
      try {
        const qrisUrl = `${new URL(req.url).origin}/api/payment/qris`;
        const qrisRes = await fetch(qrisUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalAmount,
            customerName: customerName,
            description: `Order ${newOrder.id} - Meja ${newOrder.table.tableNumber}`,
            reference: newOrder.id
          })
        });

        if (qrisRes.ok) {
          const qrisData = await qrisRes.json();
          // Update PG Transaction ID di database
          const pgTxId = qrisData.transaction?.id || qrisData.id;
          await prisma.order.update({
            where: { id: newOrder.id },
            data: { pgTransactionId: pgTxId }
          });

          return NextResponse.json({
            success: true,
            message: "Pesanan berhasil dibuat, silakan scan QRIS",
            order: {
              ...newOrder,
              pgTransactionId: pgTxId,
              qrisData: qrisData
            }
          });
        }
      } catch (qrisError) {
        console.error("Gagal generate QRIS, pesanan tetap dibuat dengan status PENDING:", qrisError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibuat (Cash)",
      order: newOrder
    });

  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: error.message || "Gagal membuat pesanan" }, { status: 500 });
  }
}

// GET /api/orders - Menampilkan semua antrean pesanan untuk kasir (Realtime/Polled fallback)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        },
        table: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal mengambil pesanan" }, { status: 500 });
  }
}
