import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Danh sách sản phẩm - Qreview",
  description: "Danh sách các sản phẩm đã được Qreview chọn lọc và đánh giá",
  // other metadata
};

const ShopWithSidebarPage = () => {
  return (
    <main>
      <ShopWithSidebar />
    </main>
  );
};

export default ShopWithSidebarPage;
