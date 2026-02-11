"use client";
import React, { useEffect, useMemo, useState } from "react";
import SingleItem from "./SingleItem";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

const BestSeller = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        if (!isMounted) return;
        setProducts(data?.products ?? []);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const bestSellerProducts = useMemo(
    () =>
      products
        .filter((item) => Number(item.tagId) === 3)
        .slice(0, 6),
    [products]
  );

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-foreground mb-1.5">
              <Image
                src="/images/icons/icon-07.svg"
                alt="icon"
                width={17}
                height={17}
              />
              Tháng này
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-foreground">
              Sản phẩm bán chạy nhất
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {/* <!-- Best Sellers item --> */}
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`best-seller-skeleton-${index}`}
                className="rounded-lg bg-surface dark:bg-surface shadow-1 p-4 animate-pulse min-h-[403px]"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto mb-6" />
                <div className="h-56 bg-gray-200 dark:bg-gray-700 rounded-md" />
              </div>
            ))
          ) : bestSellerProducts.length ? (
            bestSellerProducts.map((item, key) => (
              <SingleItem item={item} key={key} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-foreground">
              Không có sản phẩm để hiển thị.
            </div>
          )}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shop-without-sidebar"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 dark:border-dark-3 border bg-background dark:bg-surface text-foreground ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            Xem tất cả
          </Link>
        </div> 
      </div>
    </section>
  );
};

export default BestSeller;
