"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Product } from "@/types/product";

type SpecItem = { key: string; value: string };

type FormState = {
  adminToken: string;
  id?: string;
  name: string;
  slug: string;
  priceMin: string;
  priceMax: string;
  categoryId: string;
  brandId: string;
  tagId: string;
  shortDesc: string;
  content: string;
  status: string;
  images: string[];
  thumbnailIndex: string;
  specsText: string;
};

const DEFAULT_STATE: FormState = {
  adminToken: "",
  id: undefined,
  name: "",
  slug: "",
  priceMin: "",
  priceMax: "",
  categoryId: "",
  brandId: "",
  tagId: "",
  shortDesc: "",
  content: "",
  status: "active",
  images: [],
  thumbnailIndex: "0",
  specsText: "",
};

const STORAGE_KEY = "qreview_admin_token";

const parseSpecs = (value: string): SpecItem[] => {
  if (!value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => ({ key: String(item.key ?? ""), value: String(item.value ?? "") }))
        .filter((item) => item.key && item.value);
    }
  } catch {
    // fallback to line-based parsing: key:value
  }

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [key, ...rest] = line.split(":");
      return { key: key.trim(), value: rest.join(":").trim() };
    })
    .filter((item) => item.key && item.value);
};

const formatSpecsText = (specs?: { key: string; value: string }[]) =>
  specs?.length
    ? specs.map((spec) => `${spec.key}:${spec.value}`).join("\n")
    : "";

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<FormState>(DEFAULT_STATE);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setForm((prev) => ({ ...prev, adminToken: saved }));
    }
  }, []);

  const loadProducts = () => {
    setIsLoading(true);
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data?.products ?? []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const updateField = (key: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleEdit = async (item: Product) => {
    setMessage(null);
    const response = await fetch(`/api/products/${item.slug ?? item.id}`);
    const data = await response.json();
    if (!response.ok || !data?.product) {
      setMessage(data?.error ?? "Không tải được sản phẩm.");
      return;
    }

    const product: Product = data.product;
    setForm((prev) => ({
      ...prev,
      id: String(product.id),
      name: product.title ?? "",
      slug: product.slug ?? "",
      priceMin: String(product.price ?? ""),
      priceMax: String(product.discountedPrice ?? ""),
      categoryId: String(product.categoryId ?? ""),
      brandId: String(product.brandId ?? ""),
      tagId: String(product.tagId ?? ""),
      shortDesc: product.shortDesc ?? "",
      content: product.content ?? "",
      status: product.status ?? "active",
      images: product.imgs?.previews ?? [],
      thumbnailIndex: "0",
      specsText: formatSpecsText(product.specs),
    }));
    setFiles([]);
  };

  const resetForm = () => {
    setForm((prev) => ({ ...DEFAULT_STATE, adminToken: prev.adminToken }));
    setFiles([]);
  };

  const uploadImages = async () => {
    if (!files.length) return [] as string[];
    const body = new FormData();
    files.forEach((file) => body.append("files", file));

    const response = await fetch("/api/uploads", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${form.adminToken.trim()}`,
      },
      body,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error ?? "Không thể tải ảnh.");
    }

    return data?.urls ?? [];
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (!form.adminToken.trim()) {
      setMessage("Vui lòng nhập admin token.");
      return;
    }

    if (!form.name.trim()) {
      setMessage("Tên sản phẩm là bắt buộc.");
      return;
    }

    setSubmitting(true);

    try {
      localStorage.setItem(STORAGE_KEY, form.adminToken.trim());

      const uploadedUrls = await uploadImages();
      const images = uploadedUrls.length ? uploadedUrls : form.images;

      const payload = {
        id: form.id,
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        priceMin: form.priceMin ? Number(form.priceMin) : undefined,
        priceMax: form.priceMax ? Number(form.priceMax) : undefined,
        categoryId: form.categoryId.trim() || undefined,
        brandId: form.brandId.trim() || undefined,
        tagId: form.tagId.trim() || undefined,
        shortDesc: form.shortDesc.trim() || undefined,
        content: form.content.trim() || undefined,
        status: form.status.trim() || undefined,
        images,
        thumbnailIndex: form.thumbnailIndex ? Number(form.thumbnailIndex) : 0,
        specs: parseSpecs(form.specsText),
      };

      const response = await fetch("/api/products", {
        method: form.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${form.adminToken.trim()}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(result?.error ?? "Không thể lưu sản phẩm.");
        return;
      }

      setMessage(form.id ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm.");
      resetForm();
      loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: Product) => {
    if (!form.adminToken.trim()) {
      setMessage("Vui lòng nhập admin token trước khi xóa.");
      return;
    }

    const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");
    if (!confirmed) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${form.adminToken.trim()}`,
        },
        body: JSON.stringify({ id: item.id }),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(result?.error ?? "Không thể xóa sản phẩm.");
        return;
      }

      setMessage("Đã xóa sản phẩm.");
      loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    } finally {
      setSubmitting(false);
    }
  };

  const listContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`product-skeleton-${index}`}
              className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
            />
          ))}
        </div>
      );
    }

    if (!products.length) {
      return <p className="text-foreground">Chưa có sản phẩm.</p>;
    }

    return (
      <div className="space-y-3">
        {products.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-gray-3 dark:border-dark-3 bg-background dark:bg-surface px-4 py-3"
          >
            <div>
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="text-custom-sm text-muted">ID: {item.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleEdit(item)}
                className="rounded-md border border-blue px-3 py-1.5 text-blue hover:bg-blue hover:text-white"
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item)}
                className="rounded-md border border-red-500 px-3 py-1.5 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }, [isLoading, products]);

  return (
    <section className="py-16">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="rounded-2xl bg-surface dark:bg-surface shadow-1 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Danh sách sản phẩm</h2>
            {listContent}
          </div>

          <div className="rounded-2xl bg-surface dark:bg-surface shadow-1 p-6 sm:p-9">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-heading-5 font-semibold text-foreground">
                  {form.id ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
                </h1>
                <p className="text-muted mt-2">
                  Ảnh sẽ được lưu tại thư mục public/images/products.
                </p>
              </div>
              {form.id && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-gray-3 px-3 py-2 text-sm text-foreground hover:bg-gray-1"
                >
                  Tạo mới
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2.5">Admin token</label>
                <input
                  type="password"
                  value={form.adminToken}
                  onChange={updateField("adminToken")}
                  placeholder="Nhập ADMIN_TOKEN"
                  className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-2.5">Tên sản phẩm *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={updateField("name")}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
                <div>
                  <label className="block mb-2.5">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={updateField("slug")}
                    placeholder="tu-dong neu bo trong"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
                <div>
                  <label className="block mb-2.5">Giá thấp nhất</label>
                  <input
                    type="number"
                    value={form.priceMin}
                    onChange={updateField("priceMin")}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
                <div>
                  <label className="block mb-2.5">Giá cao nhất</label>
                  <input
                    type="number"
                    value={form.priceMax}
                    onChange={updateField("priceMax")}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
                <div>
                  <label className="block mb-2.5">Category ID</label>
                  <input
                    type="text"
                    value={form.categoryId}
                    onChange={updateField("categoryId")}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
                <div>
                  <label className="block mb-2.5">Brand ID</label>
                  <input
                    type="text"
                    value={form.brandId}
                    onChange={updateField("brandId")}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
                <div>
                  <label className="block mb-2.5">Tag ID</label>
                  <input
                    type="text"
                    value={form.tagId}
                    onChange={updateField("tagId")}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
                <div>
                  <label className="block mb-2.5">Trạng thái</label>
                  <select
                    value={form.status}
                    onChange={updateField("status")}
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2.5">Mô tả ngắn</label>
                <textarea
                  value={form.shortDesc}
                  onChange={updateField("shortDesc")}
                  rows={3}
                  className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div>
                <label className="block mb-2.5">Nội dung</label>
                <textarea
                  value={form.content}
                  onChange={updateField("content")}
                  rows={6}
                  className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-2.5">Ảnh sản phẩm (chọn nhiều tệp)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
                    className="w-full text-sm text-foreground"
                  />
                  {form.images.length ? (
                    <p className="text-custom-sm text-muted mt-2">
                      Đang có {form.images.length} ảnh lưu trên hệ thống.
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="block mb-2.5">Thumbnail index</label>
                  <input
                    type="number"
                    value={form.thumbnailIndex}
                    onChange={updateField("thumbnailIndex")}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                  <p className="text-custom-sm text-muted mt-2">Chỉ mục bắt đầu từ 0.</p>
                </div>
              </div>

              <div>
                <label className="block mb-2.5">Thông số kỹ thuật</label>
                <textarea
                  value={form.specsText}
                  onChange={updateField("specsText")}
                  rows={6}
                  placeholder="JSON hoặc mỗi dòng dạng key:value"
                  className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              {message && (
                <div className="rounded-lg border border-gray-3 bg-gray-1 px-4 py-3 text-sm text-foreground">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto flex justify-center font-medium text-white bg-dark py-3 px-8 rounded-lg ease-out duration-200 hover:bg-blue disabled:opacity-60"
              >
                {submitting ? "Đang lưu..." : form.id ? "Cập nhật" : "Thêm sản phẩm"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductManager;
