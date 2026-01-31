import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

export const runtime = "nodejs";

type ProductRow = RowDataPacket & {
  id: string;
  name: string;
  slug?: string | null;
  content?: string | null;
  tag_id?: string | null;
  price_min: number | null;
  price_max: number | null;
};

type ImageRow = RowDataPacket & {
  product_id: string;
  image_url: string;
  is_thumbnail: string | null;
  sort_order: number | null;
};

type ReviewRow = RowDataPacket & {
  product_id: string;
  reviews: number;
};

type TagRow = RowDataPacket & {
  name: string;
};

type SpecRow = RowDataPacket & {
  spec_key: string;
  spec_value: string;
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

const FALLBACK_PREVIEW = "/images/products/product-1-bg-1.png";
const FALLBACK_THUMB = "/images/products/product-1-sm-1.png";

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;

    if (resolvedParams.slug === "test") {
      return NextResponse.json({
        product: {
          id: "test",
          title: "Test product",
          slug: "test",
          price: 1000000,
          discountedPrice: 1200000,
          reviews: 0,
          imgs: {
            thumbnails: [FALLBACK_THUMB],
            previews: [FALLBACK_PREVIEW],
          },
        },
      });
    }

    if (!dbPassword) {
      throw new Error("Missing DB password. Check DB_PASSWORD in .env.local");
    }

    const normalizedSlug = normalizeSlug(resolvedParams.slug);

    let product: ProductRow | undefined;

    try {
      const [productsBySlug] = await pool.query<ProductRow[]>(
        "SELECT id, name, slug, content, tag_id, price_min, price_max FROM products WHERE LOWER(TRIM(slug)) = LOWER(?) LIMIT 1",
        [normalizedSlug]
      );

      product = productsBySlug[0];
    } catch {
      try {
        const [productsBySlug] = await pool.query<ProductRow[]>(
          "SELECT id, name, slug, tag_id, price_min, price_max FROM products WHERE LOWER(TRIM(slug)) = LOWER(?) LIMIT 1",
          [normalizedSlug]
        );

        product = productsBySlug[0];
      } catch {
        product = undefined;
      }
    }

    if (!product) {
      try {
        const [productsById] = await pool.query<ProductRow[]>(
          "SELECT id, name, slug, content, tag_id, price_min, price_max FROM products WHERE id = ? LIMIT 1",
          [resolvedParams.slug]
        );
        product = productsById[0];
      } catch {
        const [productsById] = await pool.query<ProductRow[]>(
          "SELECT id, name, slug, tag_id, price_min, price_max FROM products WHERE id = ? LIMIT 1",
          [resolvedParams.slug]
        );
        product = productsById[0];
      }
    }

    if (!product) {
      let productsByName: ProductRow[] = [];
      try {
        const [rows] = await pool.query<ProductRow[]>(
          "SELECT id, name, slug, content, tag_id, price_min, price_max FROM products LIMIT 500"
        );
        productsByName = rows;
      } catch {
        try {
          const [rows] = await pool.query<ProductRow[]>(
            "SELECT id, name, slug, tag_id, price_min, price_max FROM products LIMIT 500"
          );
          productsByName = rows;
        } catch {
          const [rows] = await pool.query<ProductRow[]>(
            "SELECT id, name, price_min, price_max FROM products LIMIT 500"
          );
          productsByName = rows;
        }
      }

      product = productsByName.find(
        (item) => normalizeSlug(item.slug ?? item.name) === normalizedSlug
      );
    }

    if (!product) {
      return NextResponse.json({ product: null }, { status: 404 });
    }

    const [images] = await pool.query<ImageRow[]>(
      "SELECT product_id, image_url, is_thumbnail, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order ASC",
      [product.id]
    );

    const [reviews] = await pool.query<ReviewRow[]>(
      "SELECT product_id, COUNT(*) as reviews FROM reviews WHERE product_id = ? GROUP BY product_id",
      [product.id]
    );

    let specs: SpecRow[] = [];
    try {
      const [rows] = await pool.query<SpecRow[]>(
        "SELECT spec_key, spec_value FROM product_specs WHERE product_id = ?",
        [product.id]
      );
      specs = rows;
    } catch {
      specs = [];
    }

    let tagName: string | null = null;
    if (product.tag_id) {
      try {
        const [rows] = await pool.query<TagRow[]>(
          "SELECT name FROM tags WHERE id = ? LIMIT 1",
          [product.tag_id]
        );
        tagName = rows[0]?.name ?? null;
      } catch {
        tagName = null;
      }
    }

    const previews = images.map((image) => image.image_url);
    const thumbnails = previews;

    const safePreviews = previews.length ? previews : [FALLBACK_PREVIEW];
    const safeThumbnails = thumbnails.length ? thumbnails : safePreviews;

    const priceMin = Number(product.price_min ?? product.price_max ?? 0);
    const priceMax = Number(product.price_max ?? product.price_min ?? 0);

    return NextResponse.json({
      product: {
        id: product.id,
        title: product.name,
        slug: product.slug ? normalizeSlug(product.slug) : normalizeSlug(product.name),
        tagName,
        content: product.content ?? null,
        specs: specs.map((spec) => ({
          key: spec.spec_key,
          value: spec.spec_value,
        })),
        price: priceMin,
        discountedPrice: priceMax,
        reviews: reviews[0]?.reviews ?? 0,
        imgs: {
          thumbnails: safeThumbnails,
          previews: safePreviews,
        },
      },
    });
  } catch (error) {
    console.error("Product detail API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to load product.";
    return NextResponse.json({ product: null, error: message }, { status: 500 });
  }
}
