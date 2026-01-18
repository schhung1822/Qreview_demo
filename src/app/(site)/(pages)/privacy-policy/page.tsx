import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách và bảo mật | Qreview",
  description:
    "Tìm hiểu cách Qreview thu thập, sử dụng và bảo vệ thông tin người dùng, cũng như chính sách liên kết và hoa hồng.",
};

const PrivacyPolicyPage = () => {
  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Chính sách và Bảo mật</h1>

      {/* Giới thiệu */}
      <section className="mb-8">
        <p className="text-gray-700 leading-relaxed">
          Qreview là nền tảng chia sẻ thông tin, đánh giá và so sánh sản phẩm từ
          nhiều sàn thương mại điện tử khác nhau. Chúng tôi cam kết tôn trọng và
          bảo vệ quyền riêng tư của người dùng khi truy cập và sử dụng website.
        </p>
      </section>

      {/* 1. Mô hình hoạt động */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          1. Mô hình hoạt động của Qreview
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Qreview không trực tiếp bán sản phẩm. Website hoạt động theo mô hình
          tiếp thị liên kết (Affiliate Marketing). Khi người dùng click vào liên
          kết sản phẩm được chia sẻ trên Qreview và thực hiện mua hàng tại các
          sàn thương mại điện tử, chúng tôi có thể nhận được một khoản hoa hồng
          từ sàn, <strong>không làm thay đổi giá bán của sản phẩm</strong>.
        </p>
      </section>

      {/* 2. Thu thập thông tin */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          2. Thông tin chúng tôi thu thập
        </h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>
            Thông tin truy cập cơ bản: địa chỉ IP, trình duyệt, thiết bị, thời
            gian truy cập.
          </li>
          <li>
            Hành vi sử dụng website: trang đã xem, liên kết đã click (phục vụ
            thống kê và cải thiện trải nghiệm).
          </li>
          <li>
            Thông tin do người dùng tự nguyện cung cấp (ví dụ: khi liên hệ qua
            form, email).
          </li>
        </ul>
      </section>

      {/* 3. Mục đích sử dụng */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          3. Mục đích sử dụng thông tin
        </h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>Cải thiện nội dung, giao diện và trải nghiệm người dùng.</li>
          <li>Phân tích hiệu quả các bài viết đánh giá và so sánh.</li>
          <li>Hỗ trợ, phản hồi các yêu cầu hoặc câu hỏi từ người dùng.</li>
          <li>Ngăn chặn các hành vi gian lận hoặc truy cập trái phép.</li>
        </ul>
      </section>

      {/* 4. Cookie */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Cookie</h2>
        <p className="text-gray-700 leading-relaxed">
          Qreview có thể sử dụng cookie để ghi nhớ tùy chọn của người dùng và
          phục vụ thống kê truy cập. Các cookie liên kết (affiliate cookie) được
          sàn thương mại điện tử sử dụng nhằm xác nhận hoa hồng cho Qreview khi
          phát sinh đơn hàng.
        </p>
      </section>

      {/* 5. Liên kết bên thứ ba */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          5. Liên kết đến bên thứ ba
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Website Qreview chứa các liên kết dẫn đến website của bên thứ ba (các
          sàn thương mại điện tử). Chúng tôi không chịu trách nhiệm về nội dung,
          chính sách bảo mật hoặc hoạt động của các website này. Người dùng nên
          xem xét chính sách riêng của từng bên trước khi cung cấp thông tin.
        </p>
      </section>

      {/* 6. Bảo mật dữ liệu */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          6. Bảo mật thông tin
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Qreview áp dụng các biện pháp kỹ thuật hợp lý nhằm bảo vệ thông tin
          người dùng khỏi truy cập trái phép, mất mát hoặc lạm dụng. Tuy nhiên,
          không có hệ thống nào an toàn tuyệt đối, vì vậy chúng tôi không thể cam
          kết bảo mật 100%.
        </p>
      </section>

      {/* 7. Trách nhiệm nội dung */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          7. Tính khách quan của đánh giá
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Các bài viết trên Qreview được xây dựng dựa trên tổng hợp thông tin,
          trải nghiệm, phản hồi từ người dùng và dữ liệu công khai. Chúng tôi nỗ
          lực cung cấp đánh giá công tâm và minh bạch, tuy nhiên quyết định mua
          hàng cuối cùng vẫn thuộc về người dùng.
        </p>
      </section>

      {/* 8. Thay đổi chính sách */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          8. Thay đổi chính sách
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Qreview có quyền cập nhật hoặc thay đổi nội dung chính sách này bất kỳ
          lúc nào. Các thay đổi sẽ được công bố trực tiếp trên trang này và có
          hiệu lực ngay khi được cập nhật.
        </p>
      </section>

      {/* 9. Liên hệ */}
      <section>
        <h2 className="text-xl font-semibold mb-3">9. Liên hệ</h2>
        <p className="text-gray-700 leading-relaxed">
          Nếu bạn có bất kỳ câu hỏi nào liên quan đến chính sách và bảo mật,
          vui lòng liên hệ với chúng tôi qua email hoặc trang liên hệ chính thức
          của Qreview.
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
