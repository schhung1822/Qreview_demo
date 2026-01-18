import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qreview | review công nghệ",
  description: "Qreview hoạt động độc lập, chuyên review và so sánh sản phẩm công nghệ từ nhiều sàn TMĐT. Mọi thông tin được tổng hợp khách quan nhằm hỗ trợ người dùng mua sắm hiệu quả và tiết kiệm hơn.",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
