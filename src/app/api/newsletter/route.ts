import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      email,
      fbp,
      fbc,
      user_agent,
      page_url,
    } = body;

    // 🔐 Lấy IP thật (chuẩn cho Vercel / proxy)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const payload = {
      email,
      fbp,
      fbc,
      user_agent,
      user_ip: ip,
      page_url,
      created_at: Math.floor(Date.now() / 1000),
      source: "newsletter_form",
    };

    // 🚀 GỬI WEBHOOK
    await fetch(process.env.WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
