import { NextResponse } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

export const runtime = "nodejs";

const adminToken = process.env.ADMIN_TOKEN;

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

    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "images", "products");
    await mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || ".png";
      const safeName = file.name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_.]/g, "")
        .toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName || "image"}${ext}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      urls.push(`/images/products/${fileName}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Upload API error:", error);
    const message = error instanceof Error ? error.message : "Failed to upload.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
