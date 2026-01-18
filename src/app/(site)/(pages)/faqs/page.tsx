import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | Qreview",
  description:
    "Tìm hiểu các câu hỏi thường gặp về dịch vụ của Qreview, cách sử dụng website và các thông tin liên quan.",
};

const FAQs = () => {
  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Câu hỏi thường gặp (FAQs)</h1>

      {/* Giới thiệu */}
      <section className="mb-8">
        <p className="text-gray-700 leading-relaxed">
          Dưới đây là những câu hỏi thường gặp khi người dùng truy cập và sử dụng
          website Qreview. Nếu bạn không tìm thấy câu trả lời mong muốn, vui lòng
          liên hệ với chúng tôi để được hỗ trợ thêm.
        </p>
      </section>

      {/* FAQ 1 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          1. Qreview là website gì?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Qreview là website chuyên cung cấp thông tin, đánh giá và so sánh sản
          phẩm từ nhiều sàn thương mại điện tử khác nhau. Chúng tôi giúp người
          dùng có cái nhìn tổng quan và khách quan trước khi đưa ra quyết định
          mua hàng.
        </p>
      </section>

      {/* FAQ 2 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          2. Qreview có trực tiếp bán sản phẩm không?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Không. Qreview không bán sản phẩm trực tiếp. Khi bạn click vào liên kết
          mua hàng, bạn sẽ được chuyển đến website của sàn thương mại điện tử để
          hoàn tất việc mua.
        </p>
      </section>

      {/* FAQ 3 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          3. Giá sản phẩm trên Qreview có chính xác không?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Giá sản phẩm được cập nhật dựa trên thông tin công khai từ các sàn tại
          thời điểm đăng bài. Giá thực tế có thể thay đổi tùy theo chương trình
          khuyến mãi hoặc thời điểm bạn truy cập.
        </p>
      </section>

      {/* FAQ 4 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          4. Đánh giá trên Qreview có khách quan không?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Qreview luôn cố gắng cung cấp đánh giá công tâm dựa trên tổng hợp thông
          tin, trải nghiệm thực tế và phản hồi từ người dùng. Tuy nhiên, đánh giá
          mang tính tham khảo và cảm nhận có thể khác nhau tùy từng cá nhân.
        </p>
      </section>

      {/* FAQ 5 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          5. Qreview có nhận hoa hồng từ các liên kết không?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Có. Qreview hoạt động theo mô hình tiếp thị liên kết (affiliate). Khi
          bạn mua sản phẩm thông qua liên kết trên website, chúng tôi có thể nhận
          được một khoản hoa hồng từ sàn mà không làm tăng giá sản phẩm.
        </p>
      </section>

      {/* FAQ 6 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          6. Hoa hồng có ảnh hưởng đến đánh giá sản phẩm không?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Không. Việc nhận hoa hồng không ảnh hưởng đến quan điểm đánh giá. Mục
          tiêu của Qreview là cung cấp thông tin hữu ích và minh bạch để người
          dùng tự đưa ra quyết định mua phù hợp.
        </p>
      </section>

      {/* FAQ 7 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          7. Qreview có chịu trách nhiệm về đơn hàng không?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Qreview không tham gia vào quá trình thanh toán, vận chuyển hay bảo
          hành sản phẩm. Mọi vấn đề liên quan đến đơn hàng sẽ được xử lý trực
          tiếp bởi sàn thương mại điện tử hoặc người bán.
        </p>
      </section>

      {/* FAQ 8 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          8. Tôi có thể tin tưởng vào các link mua hàng trên Qreview không?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Các liên kết trên Qreview đều dẫn đến website chính thức của các sàn
          thương mại điện tử lớn. Tuy nhiên, người dùng vẫn nên kiểm tra kỹ thông
          tin người bán và chính sách của sàn trước khi mua.
        </p>
      </section>

      {/* FAQ 9 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          9. Qreview có thu thập thông tin cá nhân của tôi không?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Qreview chỉ thu thập các thông tin cần thiết phục vụ cho việc cải thiện
          trải nghiệm người dùng. Chúng tôi không bán hoặc chia sẻ thông tin cá
          nhân của bạn cho bên thứ ba trái phép.
        </p>
      </section>

      {/* FAQ 10 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          10. Làm sao để liên hệ với Qreview?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Bạn có thể liên hệ với Qreview thông qua email hoặc trang Liên hệ được
          cung cấp trên website. Chúng tôi sẽ phản hồi trong thời gian sớm nhất
          có thể.
        </p>
      </section>
    </main>
  );
};

export default FAQs;
