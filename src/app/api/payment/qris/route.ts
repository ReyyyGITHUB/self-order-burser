import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, customerName, description, reference } = await req.json();

    const apiKey = process.env.LOUVIN_API_KEY;
    if (!apiKey || apiKey === "lv_your_api_key_here") {
      // Fallback/Mock response jika API key belum dikonfigurasi agar sistem tetap berjalan
      console.warn("LOUVIN_API_KEY is not configured yet. Using mock response.");
      return NextResponse.json({
        success: true,
        mock: true,
        transaction: {
          id: `mock-txn-${Date.now()}`,
          amount: amount + 400 + Math.round(amount * 0.007),
          status: "pending",
          reference: reference || `ref-${Date.now()}`
        },
        payment: {
          qr_string: "00020101021226540017ID.CO.LOUVIN.WWW011893600000000000000002151234567890123455204000053033605802ID5918BURGER_SELF_ORDER6009YOGYAKARTA61055512362070703A016304ABCD",
          expired_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        }
      });
    }

    const response = await fetch("https://api.louvin.dev/create-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify({
        amount: Number(amount),
        payment_type: "qris",
        customer_name: customerName || "Pelanggan",
        description: description || "Pembayaran Self-Order Burjo",
        reference: reference
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Gagal membuat transaksi ke Louvin" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Louvin Create Transaction Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
