export type Product = {
  title: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  tagName?: string | null;
  tagId?: number | string | null;
  categoryId?: number | string | null;
  brandId?: number | string | null;
  shortDesc?: string | null;
  status?: string | null;
  content?: string | null;
  specs?: {
    key: string;
    value: string;
  }[];
  slug?: string;
  id: number | string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  currentImageIndex?: number;
};
