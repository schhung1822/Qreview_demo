"use client";
import React, { useState } from "react";
import Image from "next/image";

const Newsletter = () => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");

    if (!email) return;

    const tracking = (window as any).__TRACKING__ || {};

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          fbp: tracking.fbp ?? null,
          fbc: tracking.fbc ?? null,
          user_agent: tracking.user_agent ?? navigator.userAgent,
          page_url: window.location.href,
        }),
      });

      if (response.ok) {
        // Hiển thị popup thành công
        setShowSuccessPopup(true);
        
        // Reset form
        form.reset();

        // Tự động ẩn popup sau 3 giây
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting newsletter:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative z-1 overflow-hidden rounded-xl">
          {/* <!-- bg shapes --> */}
          <Image
            src="/images/shapes/newsletter-bg.jpg"
            alt="background illustration"
            className="absolute -z-1 w-full h-full left-0 top-0 rounded-xl"
            width={1170}
            height={200}
          />
          <div className="absolute -z-1 max-w-[523px] max-h-[243px] w-full h-full right-0 top-0 bg-gradient-1"></div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 px-4 sm:px-7.5 xl:pl-12.5 xl:pr-14 py-11">
            <div className="max-w-[491px] w-full">
              <h2 className="max-w-[399px] text-white font-bold text-lg sm:text-xl xl:text-heading-4 mb-3">
                Đừng bỏ lỡ xu hướng và những sản phẩm mới nhất!
              </h2>
              <p className="text-white">
                Đăng ký email thông báo để nhận được những thông tin về sản phẩm mới và hot nhất từ chúng tôi.
              </p>
            </div>

            <div className="max-w-[477px] w-full">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Nhập email của bạn"
                    className="w-full bg-surface border border-gray-3 dark:border-dark-3 outline-none rounded-md placeholder:text-foreground-3 text-foreground py-3 px-5"
                    required
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 justify-center py-3 px-4 text-white bg-blue font-medium rounded-md ease-out duration-200 hover:bg-blue-dark whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting && (
                      <span
                        className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin"
                        aria-hidden
                      />
                    )}
                    <span>{isSubmitting ? "Đang gửi..." : "Đăng ký"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div 
          className="fixed inset-0 z-99999 flex items-center justify-center bg-dark/50 backdrop-fade"
          onClick={() => setShowSuccessPopup(false)}
        >
          <div 
            className="bg-background dark:bg-surface rounded-lg shadow-2 p-8 max-w-md mx-4 popup-zoom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Đăng ký thành công!
              </h3>
              <p className="text-text-secondary">
                Cảm ơn bạn đã đăng ký. Chúng tôi sẽ gửi thông tin sản phẩm mới nhất đến email của bạn.
              </p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="mt-6 px-6 py-2 bg-blue text-white rounded-md hover:bg-blue-dark transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Newsletter;
