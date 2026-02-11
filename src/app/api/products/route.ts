import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

export const runtime = "nodejs";

type ProductRow = RowDataPacket & {
  id: string;
  name: string;
  slug?: string | null;
  tag_id?: string | null;
  category_id?: string | null;
  brand_id?: string | null;
  short_desc?: string | null;
  status?: string | null;
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
const adminToken = process.env.ADMIN_TOKEN;

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export async function GET() {
  try {
    if (!dbPassword) {
      throw new Error("Missing DB password. Check DB_PASSWORD in .env.local");
    }
    let products: ProductRow[] = [];

    try {
      const [rows] = await pool.query<ProductRow[]>(
        "SELECT id, name, slug, tag_id, category_id, price_min, price_max FROM products ORDER BY id DESC LIMIT 50"
      );
      products = rows;
    } catch {
      const [rows] = await pool.query<ProductRow[]>(
        "SELECT id, name, tag_id, category_id, price_min, price_max FROM products ORDER BY id DESC LIMIT 50"
      );
      products = rows;
    }

    if (!products.length) {
      return NextResponse.json({ products: [] });
    }

    const productIds = products.map((product) => product.id);

    const [images] = await pool.query<ImageRow[]>(
      "SELECT product_id, image_url, is_thumbnail, sort_order FROM product_images WHERE product_id IN (?) ORDER BY sort_order ASC",
      [productIds]
    );

    const [reviews] = await pool.query<ReviewRow[]>(
      "SELECT product_id, COUNT(*) as reviews FROM reviews WHERE product_id IN (?) GROUP BY product_id",
      [productIds]
    );

    const imagesByProduct = images.reduce<Record<string, ImageRow[]>>(
      (acc, image) => {
        acc[image.product_id] ??= [];
        acc[image.product_id].push(image);
        return acc;
      },
      {}
    );

    const reviewsByProduct = reviews.reduce<Record<string, number>>(
      (acc, review) => {
        acc[review.product_id] = review.reviews;
        return acc;
      },
      {}
    );

    const mappedProducts = products.map((product) => {
      const productImages = imagesByProduct[product.id] ?? [];
      const thumbnails = productImages
        .filter((image) => image.is_thumbnail === "1" || image.is_thumbnail === "true")
        .map((image) => image.image_url);

      const previews = productImages.map((image) => image.image_url);

      const safeThumbnails = thumbnails.length
        ? thumbnails
        : previews.length
        ? previews.slice(0, 2)
        : [FALLBACK_THUMB];

      const safePreviews = previews.length ? previews : [FALLBACK_PREVIEW];

      const priceMin = Number(product.price_min ?? product.price_max ?? 0);
      const priceMax = Number(product.price_max ?? product.price_min ?? 0);

      return {
        id: product.id,
        title: product.name,
        slug: product.slug ? normalizeSlug(product.slug) : normalizeSlug(product.name),
        tagId: product.tag_id ?? null,
        categoryId: product.category_id ?? null,
        price: priceMin,
        discountedPrice: priceMax,
        reviews: reviewsByProduct[product.id] ?? 0,
        imgs: {
          thumbnails: safeThumbnails,
          previews: safePreviews,
        },
      };
    });

    return NextResponse.json({ products: mappedProducts });
  } catch (error) {
    console.error("Products API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to load products.";
    return NextResponse.json(
      { products: [], error: message },
      { status: 500 }
    );
  }
}

type CreateProductPayload = {
  id?: string;
  name: string;
  slug?: string | null;
  categoryId?: string | null;
  brandId?: string | null;
  tagId?: string | null;
  shortDesc?: string | null;
  content?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  status?: string | null;
  images?: string[];
  thumbnailIndex?: number | null;
  specs?: { key: string; value: string }[];
};

const getAuthToken = (request: Request) => {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1];
};

export async function POST(request: Request) {
  try {
    const token = getAuthToken(request);
    if (!adminToken || token !== adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!dbPassword) {
      throw new Error("Missing DB password. Check DB_PASSWORD in .env.local");
    }

    const body = (await request.json()) as CreateProductPayload;
    if (!body?.name) {
      return NextResponse.json({ error: "Missing product name" }, { status: 400 });
    }

    const productId = crypto.randomUUID();
    const slug = body.slug ? normalizeSlug(body.slug) : normalizeSlug(body.name);
    const now = new Date();

    const priceMin = Number(body.priceMin ?? 0);
    const priceMax = Number(body.priceMax ?? priceMin ?? 0);

    try {
      await pool.query(
        "INSERT INTO products (id, name, slug, category_id, brand_id, short_desc, content, price_min, price_max, status, tag_id, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          productId,
          body.name,
          slug,
          body.categoryId ?? null,
          body.brandId ?? null,
          body.shortDesc ?? null,
          body.content ?? null,
          priceMin,
          priceMax,
          body.status ?? "active",
          body.tagId ?? null,
          now,
          now,
        ]
      );
    } catch {
      await pool.query(
        "INSERT INTO products (id, name, price_min, price_max, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?)",
        [productId, body.name, priceMin, priceMax, now, now]
      );
    }

    const images = (body.images ?? []).filter(Boolean);
    if (images.length) {
      const values = images.map((imageUrl, index) => [
        productId,
        imageUrl,
        body.thumbnailIndex === index ? "1" : "0",
        index + 1,
      ]);

      await pool.query(
        "INSERT INTO product_images (product_id, image_url, is_thumbnail, sort_order) VALUES ?",
        [values]
      );
    }

    const specs = body.specs ?? [];
    if (specs.length) {
      const specValues = specs.map((spec) => [productId, spec.key, spec.value]);
      try {
        await pool.query(
          "INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES ?",
          [specValues]
        );
      } catch {
        // ignore if table doesn't exist
      }
    }

    return NextResponse.json({ id: productId, slug });
  } catch (error) {
    console.error("Create product API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const token = getAuthToken(request);
    if (!adminToken || token !== adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!dbPassword) {
      throw new Error("Missing DB password. Check DB_PASSWORD in .env.local");
    }

    const body = (await request.json()) as CreateProductPayload;
    if (!body?.id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    if (!body?.name) {
      return NextResponse.json({ error: "Missing product name" }, { status: 400 });
    }

    const slug = body.slug ? normalizeSlug(body.slug) : normalizeSlug(body.name);
    const now = new Date();
    const priceMin = Number(body.priceMin ?? 0);
    const priceMax = Number(body.priceMax ?? priceMin ?? 0);

    await pool.query(
      "UPDATE products SET name = ?, slug = ?, category_id = ?, brand_id = ?, short_desc = ?, content = ?, price_min = ?, price_max = ?, status = ?, tag_id = ?, update_time = ? WHERE id = ?",
      [
        body.name,
        slug,
        body.categoryId ?? null,
        body.brandId ?? null,
        body.shortDesc ?? null,
        body.content ?? null,
        priceMin,
        priceMax,
        body.status ?? "active",
        body.tagId ?? null,
        now,
        body.id,
      ]
    );

    const images = (body.images ?? []).filter(Boolean);
    if (images.length) {
      await pool.query("DELETE FROM product_images WHERE product_id = ?", [body.id]);
      const values = images.map((imageUrl, index) => [
        body.id,
        imageUrl,
        body.thumbnailIndex === index ? "1" : "0",
        index + 1,
      ]);

      await pool.query(
        "INSERT INTO product_images (product_id, image_url, is_thumbnail, sort_order) VALUES ?",
        [values]
      );
    }

    if (body.specs) {
      try {
        await pool.query("DELETE FROM product_specs WHERE product_id = ?", [body.id]);
        if (body.specs.length) {
          const specValues = body.specs.map((spec) => [body.id, spec.key, spec.value]);
          await pool.query(
            "INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES ?",
            [specValues]
          );
        }
      } catch {
        // ignore if table doesn't exist
      }
    }

    return NextResponse.json({ id: body.id, slug });
  } catch (error) {
    console.error("Update product API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const token = getAuthToken(request);
    if (!adminToken || token !== adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!dbPassword) {
      throw new Error("Missing DB password. Check DB_PASSWORD in .env.local");
    }

    const body = (await request.json()) as { id?: string };
    if (!body?.id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const productId = body.id;

    await pool.query("DELETE FROM product_images WHERE product_id = ?", [productId]);
    try {
      await pool.query("DELETE FROM product_specs WHERE product_id = ?", [productId]);
    } catch {
      // ignore
    }
    try {
      await pool.query("DELETE FROM affiliate_links WHERE products_id = ?", [productId]);
    } catch {
      // ignore
    }
    try {
      await pool.query("DELETE FROM product_variant WHERE product_id = ?", [productId]);
    } catch {
      // ignore
    }

    await pool.query("DELETE FROM products WHERE id = ?", [productId]);

    return NextResponse.json({ id: productId });
  } catch (error) {
    console.error("Delete product API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
