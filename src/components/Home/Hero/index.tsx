import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-background">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-surface dark:bg-surface overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              <div className="w-full relative rounded-[10px] bg-surface dark:bg-surface p-4 sm:p-7.5">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-semibold text-foreground text-xl mb-20">
                      <a href="/shop-details/xiaomi17-xiaomi17pro"> Xiaomi 17 & Xiaomi 17 Pro </a>
                    </h2>

                    <div>
                      <span className="flex flex-col items-start">
                        <span className="font-medium text-xl text-heading-5 text-red">
                          1.990.000đ
                        </span>
                        <span className="font-medium text-xl text-foreground ">
                          2.299.000đ
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src="/images/hero/hero-1.png"
                      alt="mobile image"
                      width={123}
                      height={161}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full relative rounded-[10px] bg-surface dark:bg-surface p-4 sm:p-7.5">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-semibold text-foreground text-xl mb-20">
                      <a href="/shop-details/loa-xiaomi-sound-outdoor"> Loa Xiaomi SoundParty </a>
                    </h2>
                    
                    <div>
                      <span className="flex flex-col items-start">
                        <span className="font-medium text-xl text-heading-5 text-red">
                          22.500.000đ
                        </span>
                        <span className="font-medium text-xl text-foreground">
                          27.000.000đ
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src="/images/hero/hero-2.png"
                      alt="mobile image"
                      width={123}
                      height={161}
                    />
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
