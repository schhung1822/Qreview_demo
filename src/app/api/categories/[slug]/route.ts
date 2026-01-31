import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

export const runtime = "nodejs";

type CategoryRow = RowDataPacket & {
  id: string;
  name: string;
  slug?: string | null;
  image_url?: string | null;
};

type ProductRow = RowDataPacket & {
  id: string;
  name: string;
  slug?: string | null;
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

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const mapCategory = (category: CategoryRow) => ({
  id: category.id,
  name: category.name,
  slug: category.slug
    ? normalizeSlug(category.slug)
    : normalizeSlug(category.name),
  image: category.image_url ?? null,
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;

    if (!dbPassword) {
      throw new Error("Missing DB password. Check DB_PASSWORD in .env.local");
    }

    const normalizedSlug = normalizeSlug(resolvedParams.slug);

    let category: CategoryRow | undefined;

    try {
      const [rows] = await pool.query<CategoryRow[]>(
        "SELECT id, name, slug, image_url FROM categories WHERE LOWER(TRIM(slug)) = LOWER(?) LIMIT 1",
        [normalizedSlug]
      );
      category = rows[0];
    } catch {
      try {
        const [rows] = await pool.query<CategoryRow[]>(
          "SELECT id, name, slug FROM categories WHERE LOWER(TRIM(slug)) = LOWER(?) LIMIT 1",
          [normalizedSlug]
        );
        category = rows[0];
      } catch {
        category = undefined;
      }
    }

    if (!category) {
      try {
        const [rows] = await pool.query<CategoryRow[]>(
          "SELECT id, name, slug, image_url FROM categories WHERE id = ? LIMIT 1",
          [resolvedParams.slug]
        );
        category = rows[0];
      } catch {
        const [rows] = await pool.query<CategoryRow[]>(
          "SELECT id, name, slug FROM categories WHERE id = ? LIMIT 1",
          [resolvedParams.slug]
        );
        category = rows[0];
      }
    }

    if (!category) {
      try {
        const [rows] = await pool.query<CategoryRow[]>(
          "SELECT id, name, slug, image_url FROM categories LIMIT 500"
        );
        category = rows.find(
          (item) =>
            normalizeSlug(item.slug ?? item.name) === normalizedSlug
        );
      } catch {
        const [rows] = await pool.query<CategoryRow[]>(
          "SELECT id, name, slug FROM categories LIMIT 500"
        );
        category = rows.find(
          (item) =>
            normalizeSlug(item.slug ?? item.name) === normalizedSlug
        );
      }
    }

    if (!category) {
      return NextResponse.json({ category: null, products: [] }, { status: 404 });
    }

    let products: ProductRow[] = [];

    try {
      const [rows] = await pool.query<ProductRow[]>(
        "SELECT id, name, slug, price_min, price_max FROM products WHERE category_id = ? ORDER BY id DESC LIMIT 200",
        [category.id]
      );
      products = rows;
    } catch {
      products = [];
    }

    if (!products.length) {
      return NextResponse.json({ category: mapCategory(category), products: [] });
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
        .filter(
          (image) =>
            image.is_thumbnail === "1" || image.is_thumbnail === "true"
        )
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
        slug: product.slug
          ? normalizeSlug(product.slug)
          : normalizeSlug(product.name),
        price: priceMin,
        discountedPrice: priceMax,
        reviews: reviewsByProduct[product.id] ?? 0,
        imgs: {
          thumbnails: safeThumbnails,
          previews: safePreviews,
        },
      };
    });

    return NextResponse.json({
      category: mapCategory(category),
      products: mappedProducts,
    });
  } catch (error) {
    console.error("Category detail API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to load category.";
    return NextResponse.json(
      { category: null, products: [], error: message },
      { status: 500 }
    );
  }
}
