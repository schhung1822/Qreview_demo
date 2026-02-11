"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";

const HeroCarousal = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-heading-3 sm:text-heading-1 text-foreground">
                30%
              </span>
              <span className="block text-foreground text-sm sm:text-custom-1 sm:leading-[24px]">
                Sale
                <br />
                Off
              </span>
            </div>

            <h1 className="font-semibold text-foreground text-xl sm:text-3xl mb-3">
              <a href="shop-details/xiaomi17-xiaomi17pro">Xiaomi 17 & Xiaomi 17 Pro</a>
            </h1>

            <p>
              Xiaomi 17 với Snapdragon 8 Elite Gen 5, dung lượng pin 7000 mAh, màn hình LTPO AMOLED 6,3″ và cụm 3 camera 50 MP chất lượng cao cho ảnh/video sắc nét.
            </p>

            <a
              href="#"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
            >
              Xem ngay
            </a>
          </div>

          <div>
            <Image
              src="/images/hero/hero-1.png"
              alt="headphone"
              width={351}
              height={358}
            />
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        {" "}
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-26 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-heading-3 sm:text-heading-1 text-foreground">
                30%
              </span>
              <span className="block text-foreground text-sm sm:text-custom-1 sm:leading-[24px]">
                Sale
                <br />
                Off
              </span>
            </div>

            <h1 className="font-semibold text-foreground text-xl sm:text-3xl mb-3">
              <a href="#">Loa Xiaomi SoundParty</a>
            </h1>

            <p>
              loa Bluetooth di động 50 W mạnh mẽ, cho âm thanh sống động với Bass Boost, Bluetooth 5.4 và đèn LED 3D hấp dẫn
            </p>

            <a
              href="/shop-details/loa-xiaomi-sound-outdoor"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
            >
              Xem ngay
            </a>
          </div>

          <div>
            <Image
              src="/images/hero/hero-2.png"
              alt="headphone"
              width={351}
              height={358}
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousal;
