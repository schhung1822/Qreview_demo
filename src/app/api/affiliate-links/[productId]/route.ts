import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

export const runtime = "nodejs";

type AffiliateRow = RowDataPacket & {
  id: string;
  products_id?: string;
  product_id?: string;
  network_id?: string | null;
  affiliate_url: string | null;
  price: string | null;
  merchant_name: string | null;
  is_best: string | null;
  network_name?: string | null;
  network_logo?: string | null;
};

const dbPassword = process.env.DB_PASSWORD ?? process.env.DB_PASS;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: dbPassword,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    if (!dbPassword) {
      throw new Error("Missing DB password. Check DB_PASSWORD in .env.local");
    }

    const resolvedParams = await params;
    const productId = resolvedParams.productId;

    let rows: AffiliateRow[] = [];
    try {
      const [result] = await pool.query<AffiliateRow[]>(
        "SELECT al.id, al.products_id, al.network_id, al.affiliate_url, al.price, al.merchant_name, al.is_best, an.name as network_name, an.logo as network_logo FROM affiliate_links al LEFT JOIN affiliate_networks an ON an.id = al.network_id WHERE al.products_id = ? ORDER BY al.is_best DESC",
        [productId]
      );
      rows = result;
    } catch {
      const [result] = await pool.query<AffiliateRow[]>(
        "SELECT al.id, al.product_id, al.network_id, al.affiliate_url, al.price, al.merchant_name, al.is_best, an.name as network_name, an.logo as network_logo FROM affiliate_links al LEFT JOIN affiliate_networks an ON an.id = al.network_id WHERE al.product_id = ? ORDER BY al.is_best DESC",
        [productId]
      );
      rows = result;
    }

    return NextResponse.json({ links: rows ?? [] });
  } catch (error) {
    console.error("Affiliate links API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to load affiliate links.";
    return NextResponse.json({ links: [], error: message }, { status: 500 });
  }
}
