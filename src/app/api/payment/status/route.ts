import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const apiKey = process.env.LOUVIN_API_KEY;
    if (!apiKey || apiKey === "lv_your_api_key_here") {
      // Mock status check fallback
      if (id.startsWith("mock-txn-")) {
        return NextResponse.json({
          success: true,
          transaction: {
            id,
            status: "settled", // Auto-confirm mock after verification trigger
            amount: 25000,
            reference: `ref-${Date.now()}`
          }
        });
      }
    }

    const response = await fetch(`https://api.louvin.dev/check-status?id=${id}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey || ""
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Gagal mengecek status transaksi ke Louvin" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Louvin Check Status Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
