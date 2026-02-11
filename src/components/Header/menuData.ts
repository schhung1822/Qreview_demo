import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 1,
    title: "Trang chủ",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Cửa hàng",
    newTab: false,
    path: "/shop-with-sidebar",
  },
  {
    id: 3,
    title: "Danh mục",
    newTab: false,
    path: "/",
    submenu: [
      {
        id: 100,
        title: "TV",
        newTab: false,
        path: "/tv",
      },
      {
        id: 101,
        title: "Laptop & PC",
        newTab: false,
        path: "/laptop-pc",
      },
      {
        id: 102,
        title: "Điện thoại & máy tính bảng",
        newTab: false,
        path: "/dien-thoai-may-tinh-bang",
      },
      {
        id: 103,
        title: "Loa & Tai nghe",
        newTab: false,
        path: "/loa-tai-nghe",
      },
      {
        id: 104,
        title: "Đồ gia dụng",
        newTab: false,
        path: "/do-gia-dung",
      },
      {
        id: 105,
        title: "Đồ thể thao",
        newTab: false,
        path: "/do-the-thao",
      },
      {
        id: 106,
        title: "Đồng hồ thông minh",
        newTab: false,
        path: "/dong-ho-thong-minh",
      },
      {
        id: 107,
        title: "Đồ Decor",
        newTab: false,
        path: "/do-decor",
      },
      {
        id: 108,
        title: "Phụ kiện công nghệ",
        newTab: false,
        path: "/phu-kien-cong-nghe",
      }
    ],
  },
  {
    id: 4,
    title: "Liên hệ",
    newTab: false,
    path: "/contact",
  },
  {
    id: 6,
    title: "Tin tức",
    newTab: false,
    path: "/blogs/blog-grid-with-sidebar",
  },
];
