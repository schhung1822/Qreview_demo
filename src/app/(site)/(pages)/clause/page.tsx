import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng | Qreview",
  description:
    "Tìm hiểu các điều khoản sử dụng dịch vụ của Qreview, quyền và nghĩa vụ của người dùng khi truy cập và sử dụng website.",
};

const ClausePage = () => {
  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Điều khoản sử dụng</h1>

      {/* Giới thiệu */}
      <section className="mb-8">
        <p className="text-gray-700 leading-relaxed">
          Khi truy cập và sử dụng website Qreview, bạn đồng ý tuân thủ các điều
          khoản và điều kiện được nêu dưới đây. Nếu bạn không đồng ý với bất kỳ
          điều khoản nào, vui lòng ngừng sử dụng website.
        </p>
      </section>

      {/* 1. Định nghĩa */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Định nghĩa</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>
            <strong>Qreview:</strong> Website cung cấp thông tin, đánh giá, so
            sánh sản phẩm và liên kết đến các sàn thương mại điện tử.
          </li>
          <li>
            <strong>Người dùng:</strong> Cá nhân hoặc tổ chức truy cập và sử dụng
            nội dung trên Qreview.
          </li>
          <li>
            <strong>Bên thứ ba:</strong> Các sàn thương mại điện tử hoặc đối tác
            liên kết được nhắc đến trên website.
          </li>
        </ul>
      </section>

      {/* 2. Phạm vi dịch vụ */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          2. Phạm vi dịch vụ của Qreview
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Qreview cung cấp nội dung mang tính chất tham khảo bao gồm thông tin
          sản phẩm, bài viết đánh giá, so sánh và liên kết mua hàng. Qreview
          không trực tiếp bán sản phẩm, không tham gia vào quá trình thanh toán,
          giao hàng hay bảo hành.
        </p>
      </section>

      {/* 3. Quyền và nghĩa vụ người dùng */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          3. Quyền và nghĩa vụ của người dùng
        </h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>Sử dụng website cho mục đích hợp pháp.</li>
          <li>
            Không sao chép, chỉnh sửa, phân phối lại nội dung của Qreview khi
            chưa có sự cho phép.
          </li>
          <li>
            Không thực hiện các hành vi gây ảnh hưởng đến hoạt động, bảo mật hoặc
            uy tín của website.
          </li>
          <li>
            Tự chịu trách nhiệm với quyết định mua hàng dựa trên thông tin tham
            khảo từ Qreview.
          </li>
        </ul>
      </section>

      {/* 4. Quyền và trách nhiệm của Qreview */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          4. Quyền và trách nhiệm của Qreview
        </h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>
            Cung cấp thông tin trung thực, khách quan trong khả năng cho phép.
          </li>
          <li>
            Có quyền chỉnh sửa, cập nhật hoặc gỡ bỏ nội dung mà không cần báo
            trước.
          </li>
          <li>
            Không chịu trách nhiệm đối với tranh chấp phát sinh giữa người dùng
            và bên thứ ba.
          </li>
        </ul>
      </section>

      {/* 5. Nội dung và đánh giá */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          5. Nội dung đánh giá và so sánh
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Nội dung trên Qreview được xây dựng dựa trên tổng hợp thông tin, trải
          nghiệm thực tế, phản hồi người dùng và dữ liệu công khai. Chúng tôi
          không cam kết mọi thông tin đều hoàn toàn chính xác hoặc luôn được cập
          nhật theo thời gian thực.
        </p>
      </section>

      {/* 6. Liên kết tiếp thị */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          6. Liên kết tiếp thị liên kết (Affiliate)
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Qreview có thể nhận hoa hồng khi người dùng mua sản phẩm thông qua các
          liên kết được chia sẻ trên website. Khoản hoa hồng này không làm tăng
          giá sản phẩm và không ảnh hưởng đến tính khách quan của nội dung.
        </p>
      </section>

      {/* 7. Giới hạn trách nhiệm */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          7. Giới hạn trách nhiệm
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Qreview không chịu trách nhiệm đối với bất kỳ thiệt hại trực tiếp hoặc
          gián tiếp nào phát sinh từ việc sử dụng hoặc không thể sử dụng website,
          bao gồm nhưng không giới hạn ở việc mất dữ liệu, mất doanh thu hoặc
          tranh chấp mua bán.
        </p>
      </section>

      {/* 8. Thay đổi điều khoản */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          8. Thay đổi điều khoản sử dụng
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Qreview có quyền cập nhật hoặc thay đổi các điều khoản sử dụng này bất
          kỳ lúc nào. Việc tiếp tục sử dụng website sau khi điều khoản được cập
          nhật đồng nghĩa với việc bạn chấp nhận các thay đổi đó.
        </p>
      </section>

      {/* 9. Luật áp dụng */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">9. Luật áp dụng</h2>
        <p className="text-gray-700 leading-relaxed">
          Các điều khoản này được điều chỉnh và giải thích theo pháp luật Việt
          Nam.
        </p>
      </section>

      {/* 10. Liên hệ */}
      <section>
        <h2 className="text-xl font-semibold mb-3">10. Liên hệ</h2>
        <p className="text-gray-700 leading-relaxed">
          Nếu bạn có bất kỳ thắc mắc nào liên quan đến điều khoản sử dụng, vui
          lòng liên hệ với Qreview thông qua email hoặc trang liên hệ chính thức.
        </p>
      </section>
    </main>
  );
};

export default ClausePage;
