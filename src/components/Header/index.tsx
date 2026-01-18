"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import CustomSelect from "./CustomSelect";
import { menuData } from "./menuData";
import Dropdown from "./Dropdown";

import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";

import ThemeSwitcher from "@/components/Common/theme-switcher";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { openCartModal } = useCartModalContext();
  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  const handleOpenCartModal = () => openCartModal();

  // Sticky menu
  useEffect(() => {
    const handleStickyMenu = () => setStickyMenu(window.scrollY >= 80);
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  // Close mobile search when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1280) setMobileSearchOpen(false); // xl
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Theo dõi thay đổi theme
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Kiểm tra theme ban đầu
    checkTheme();

    // Theo dõi thay đổi theme
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const options = [
    { label: "Danh mục", value: "0" },
    { label: "Máy tính bàn", value: "1" },
    { label: "Laptop", value: "2" },
    { label: "Màn hình", value: "3" },
    { label: "Điện thoại", value: "4" },
    { label: "Đồng hồ", value: "5" },
    { label: "Chuột", value: "6" },
    { label: "Máy tính bảng", value: "7" },
  ];

  return (
    <header
      className={`fixed left-0 top-0 w-full z-9999 bg-background transition-all ease-in-out duration-300 ${
        stickyMenu ? "shadow" : ""
      }`}
    >
      {/* ===== MOBILE TOP BAR ===== */}
      <div className="xl:hidden border-b border-gray-3 dark:border-dark-3">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5">
          <div className={`relative flex items-center justify-between ${stickyMenu ? "py-3" : "py-4"}`}>
            {/* Mobile Search Overlay (che header) */}
            {mobileSearchOpen && (
              <div className="absolute inset-0 z-50 bg-background flex items-center gap-3 px-2">
                <div className="flex-1">
                  <div className="flex items-center">
                    <CustomSelect options={options} />
                    <div className="relative w-full">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 inline-block w-px h-5.5 bg-gray-4" />
                      <input
                        autoFocus
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        type="search"
                        name="search"
                        id="search-mobile"
                        placeholder="Nhập tên sản phẩm hoặc danh mục"
                        autoComplete="off"
                        className="custom-search w-full rounded-r-[5px] bg-surface !border-l-0 border border-gray-3 dark:border-dark-3 py-2.5 pl-4 pr-10 outline-none ease-in duration-200 text-foreground placeholder:text-muted"
                      />
                      <button
                        type="button"
                        aria-label="Search"
                        className="flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 ease-in duration-200 hover:text-blue"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.2687 15.6656L12.6281 11.8969C14.5406 9.28123 14.3437 5.5406 11.9531 3.1781C10.6875 1.91248 8.99995 1.20935 7.19995 1.20935C5.39995 1.20935 3.71245 1.91248 2.44683 3.1781C-0.168799 5.79373 -0.168799 10.0687 2.44683 12.6844C3.71245 13.95 5.39995 14.6531 7.19995 14.6531C8.91558 14.6531 10.5187 14.0062 11.7843 12.8531L16.4812 16.65C16.5937 16.7344 16.7343 16.7906 16.875 16.7906C17.0718 16.7906 17.2406 16.7062 17.3531 16.5656C17.5781 16.2844 17.55 15.8906 17.2687 15.6656ZM7.19995 13.3875C5.73745 13.3875 4.38745 12.825 3.34683 11.7844C1.20933 9.64685 1.20933 6.18748 3.34683 4.0781C4.38745 3.03748 5.73745 2.47498 7.19995 2.47498C8.66245 2.47498 10.0125 3.03748 11.0531 4.0781C13.1906 6.2156 13.1906 9.67498 11.0531 11.7844C10.0406 12.825 8.66245 13.3875 7.19995 13.3875Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close search"
                  onClick={() => setMobileSearchOpen(false)}
                  className="shrink-0 w-10 h-10 rounded-md border border-gray-3 dark:border-dark-3 flex items-center justify-center text-foreground hover:text-blue"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Left: Menu + Wishlist */}
            <div className="flex items-center gap-3">
              <button
                id="Toggle"
                aria-label="Toggler"
                className="block"
                onClick={() => setNavigationOpen(!navigationOpen)}
              >
                <span className="block relative cursor-pointer w-5.5 h-5.5">
                  <span className="du-block absolute right-0 w-full h-full">
                    <span
                      className={`block relative top-0 left-0 bg-foreground rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-[0] ${
                        !navigationOpen && "!w-full delay-300"
                      }`}
                    />
                    <span
                      className={`block relative top-0 left-0 bg-foreground rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-150 ${
                        !navigationOpen && "!w-full delay-400"
                      }`}
                    />
                    <span
                      className={`block relative top-0 left-0 bg-foreground rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-200 ${
                        !navigationOpen && "!w-full delay-500"
                      }`}
                    />
                  </span>

                  <span className="block absolute right-0 w-full h-full rotate-45">
                    <span
                      className={`block bg-foreground rounded-sm ease-in-out duration-200 delay-300 absolute left-2.5 top-0 w-0.5 h-full ${
                        !navigationOpen && "!h-0 delay-[0]"
                      }`}
                    />
                    <span
                      className={`block bg-foreground rounded-sm ease-in-out duration-200 delay-400 absolute left-0 top-2.5 w-full h-0.5 ${
                        !navigationOpen && "!h-0 dealy-200"
                      }`}
                    />
                  </span>
                </span>
              </button>

              <Link href="/wishlist" aria-label="Wishlist" className="flex items-center">
                <svg
                  className="fill-current w-10 h-10 p-2 rounded-full border border-gray-3 dark:border-dark-3 flex items-center justify-center text-foreground hover:text-blue ease-in duration-200"
                  width="22"
                  height="22"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.97441 12.6073L6.43872 12.0183L5.97441 12.6073ZM7.99992 3.66709L7.45955 4.18719C7.60094 4.33408 7.79604 4.41709 7.99992 4.41709C8.2038 4.41709 8.3989 4.33408 8.54028 4.18719L7.99992 3.66709ZM10.0254 12.6073L10.4897 13.1962L10.0254 12.6073ZM6.43872 12.0183C5.41345 11.21 4.33627 10.4524 3.47904 9.48717C2.64752 8.55085 2.08325 7.47831 2.08325 6.0914H0.583252C0.583252 7.94644 1.3588 9.35867 2.35747 10.4832C3.33043 11.5788 4.57383 12.4582 5.51009 13.1962L6.43872 12.0183ZM2.08325 6.0914C2.08325 4.75102 2.84027 3.63995 3.85342 3.17683C4.81929 2.73533 6.15155 2.82823 7.45955 4.18719L8.54028 3.14699C6.84839 1.38917 4.84732 1.07324 3.22983 1.8126C1.65962 2.53035 0.583252 4.18982 0.583252 6.0914H2.08325ZM5.51009 13.1962C5.84928 13.4636 6.22932 13.7618 6.61834 13.9891C7.00711 14.2163 7.47619 14.4167 7.99992 14.4167V12.9167C7.85698 12.9167 7.65939 12.8601 7.37512 12.694C7.0911 12.5281 6.79171 12.2965 6.43872 12.0183L5.51009 13.1962ZM10.4897 13.1962C11.426 12.4582 12.6694 11.5788 13.6424 10.4832C14.641 9.35867 15.4166 7.94644 15.4166 6.0914H13.9166C13.9166 7.47831 13.3523 8.55085 12.5208 9.48717C11.6636 10.4524 10.5864 11.21 9.56112 12.0183L10.4897 13.1962ZM15.4166 6.0914C15.4166 4.18982 14.3402 2.53035 12.77 1.8126C11.1525 1.07324 9.15145 1.38917 7.45955 3.14699L8.54028 4.18719C9.84828 2.82823 11.1805 2.73533 12.1464 3.17683C13.1596 3.63995 13.9166 4.75102 13.9166 6.0914H15.4166ZM9.56112 12.0183C9.20813 12.2965 8.90874 12.5281 8.62471 12.694C8.34044 12.8601 8.14285 12.9167 7.99992 12.9167V14.4167C8.52365 14.4167 8.99273 14.2163 9.3815 13.9891C9.77052 13.7618 10.1506 13.4636 10.4897 13.1962L9.56112 12.0183Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
            </div>

            {/* Center: Logo */}
            <Link className="absolute left-1/2 -translate-x-1/2" href="/" aria-label="Home">
              <Image 
                src={isDarkMode ? "/images/logo/Qreview_amban.webp" : "/images/logo/Qreview_duongban.webp"} 
                alt="Logo" 
                width={140} 
                height={26} 
              />
            </Link>

            {/* Right: Search + Theme */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open search"
                onClick={() => setMobileSearchOpen(true)}
                className="w-10 h-10 rounded-full border border-gray-3 dark:border-dark-3 flex items-center justify-center text-foreground hover:text-blue"
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.2687 15.6656L12.6281 11.8969C14.5406 9.28123 14.3437 5.5406 11.9531 3.1781C10.6875 1.91248 8.99995 1.20935 7.19995 1.20935C5.39995 1.20935 3.71245 1.91248 2.44683 3.1781C-0.168799 5.79373 -0.168799 10.0687 2.44683 12.6844C3.71245 13.95 5.39995 14.6531 7.19995 14.6531C8.91558 14.6531 10.5187 14.0062 11.7843 12.8531L16.4812 16.65C16.5937 16.7344 16.7343 16.7906 16.875 16.7906C17.0718 16.7906 17.2406 16.7062 17.3531 16.5656C17.5781 16.2844 17.55 15.8906 17.2687 15.6656ZM7.19995 13.3875C5.73745 13.3875 4.38745 12.825 3.34683 11.7844C1.20933 9.64685 1.20933 6.18748 3.34683 4.0781C4.38745 3.03748 5.73745 2.47498 7.19995 2.47498C8.66245 2.47498 10.0125 3.03748 11.0531 4.0781C13.1906 6.2156 13.1906 9.67498 11.0531 11.7844C10.0406 12.825 8.66245 13.3875 7.19995 13.3875Z"
                    fill="currentColor"
                  />
                </svg>
              </button>

              <div className="flex items-center">
                <ThemeSwitcher />
              </div>
            </div>
          </div>

          {/* Mobile nav dropdown area (giữ nguyên logic navigationOpen) */}
          <div
            className={`${
              navigationOpen
                ? "mt-3 mb-4 block bg-background shadow-lg border border-gray-3 dark:border-dark-3 rounded-md p-4 max-h-[400px] overflow-y-auto"
                : "hidden"
            }`}
          >
            <nav>
              <ul className="flex flex-col gap-4">
                {menuData.map((menuItem, i) =>
                  menuItem.submenu ? (
                    <Dropdown key={i} menuItem={menuItem} stickyMenu={stickyMenu} />
                  ) : (
                    <li key={i} className="group relative">
                      <Link href={menuItem.path} className="hover:text-blue text-custom-sm font-medium text-foreground flex">
                        {menuItem.title}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP (giữ gần như nguyên bản) ===== */}
      <div className="hidden xl:block">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
          <div
            className={`flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between ease-out duration-200 ${
              stickyMenu ? "py-4" : "py-6"
            }`}
          >
            {/* left */}
            <div className="xl:w-auto flex-col sm:flex-row w-full flex sm:justify-between sm:items-center gap-5 sm:gap-10">
              <Link className="flex-shrink-0" href="/">
                <Image 
                  src={isDarkMode ? "/images/logo/Qreview_amban.webp" : "/images/logo/Qreview_duongban.webp"} 
                  alt="Logo" 
                  width={160} 
                  height={30} 
                />
              </Link>

              <div className="max-w-[475px] w-full">
                <form>
                  <div className="flex items-center">
                    <CustomSelect options={options} />

                    <div className="relative max-w-[333px] sm:min-w-[333px] w-full">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 inline-block w-px h-5.5 bg-gray-4" />
                      <input
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        type="search"
                        name="search"
                        id="search"
                        placeholder="Nhập tên sản phẩm hoặc danh mục"
                        autoComplete="off"
                        className="custom-search w-full rounded-r-[5px] bg-surface !border-l-0 border border-gray-3 dark:border-dark-3 py-2.5 pl-4 pr-10 outline-none ease-in duration-200 text-foreground placeholder:text-muted"
                      />

                      <button
                        id="search-btn"
                        aria-label="Search"
                        type="button"
                        className="flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 ease-in duration-200 hover:text-blue"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.2687 15.6656L12.6281 11.8969C14.5406 9.28123 14.3437 5.5406 11.9531 3.1781C10.6875 1.91248 8.99995 1.20935 7.19995 1.20935C5.39995 1.20935 3.71245 1.91248 2.44683 3.1781C-0.168799 5.79373 -0.168799 10.0687 2.44683 12.6844C3.71245 13.95 5.39995 14.6531 7.19995 14.6531C8.91558 14.6531 10.5187 14.0062 11.7843 12.8531L16.4812 16.65C16.5937 16.7344 16.7343 16.7906 16.875 16.7906C17.0718 16.7906 17.2406 16.7062 17.3531 16.5656C17.5781 16.2844 17.55 15.8906 17.2687 15.6656ZM7.19995 13.3875C5.73745 13.3875 4.38745 12.825 3.34683 11.7844C1.20933 9.64685 1.20933 6.18748 3.34683 4.0781C4.38745 3.03748 5.73745 2.47498 7.19995 2.47498C8.66245 2.47498 10.0125 3.03748 11.0531 4.0781C13.1906 6.2156 13.1906 9.67498 11.0531 11.7844C10.0406 12.825 8.66245 13.3875 7.19995 13.3875Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* right */}
            <div className="flex w-full lg:w-auto items-center gap-7.5">
              <div className="flex w-full lg:w-auto justify-between items-center gap-5">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    <ThemeSwitcher />
                  </div>

                  <Link href="/signin" className="flex items-center gap-2.5">
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="fill-current"
                      xmlns="http://www.w3.org/2000/svg" > 
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C9.37666 1.25 7.25001 3.37665 7.25001 6C7.25001 8.62335 9.37666 10.75 12 10.75C14.6234 10.75 16.75 8.62335 16.75 6C16.75 3.37665 14.6234 1.25 12 1.25ZM8.75001 6C8.75001 4.20507 10.2051 2.75 12 2.75C13.7949 2.75 15.25 4.20507 15.25 6C15.25 7.79493 13.7949 9.25 12 9.25C10.2051 9.25 8.75001 7.79493 8.75001 6Z"/> <path fillRule="evenodd" clipRule="evenodd" d="M12 12.25C9.68646 12.25 7.55494 12.7759 5.97546 13.6643C4.4195 14.5396 3.25001 15.8661 3.25001 17.5L3.24995 17.602C3.24882 18.7638 3.2474 20.222 4.52642 21.2635C5.15589 21.7761 6.03649 22.1406 7.22622 22.3815C8.41927 22.6229 9.97424 22.75 12 22.75C14.0258 22.75 15.5808 22.6229 16.7738 22.3815C17.9635 22.1406 18.8441 21.7761 19.4736 21.2635C20.7526 20.222 20.7512 18.7638 20.7501 17.602L20.75 17.5C20.75 15.8661 19.5805 14.5396 18.0246 13.6643C16.4451 12.7759 14.3136 12.25 12 12.25ZM4.75001 17.5C4.75001 16.6487 5.37139 15.7251 6.71085 14.9717C8.02681 14.2315 9.89529 13.75 12 13.75C14.1047 13.75 15.9732 14.2315 17.2892 14.9717C18.6286 15.7251 19.25 16.6487 19.25 17.5C19.25 18.8078 19.2097 19.544 18.5264 20.1004C18.1559 20.4022 17.5365 20.6967 16.4762 20.9113C15.4193 21.1252 13.9742 21.25 12 21.25C10.0258 21.25 8.58075 21.1252 7.5238 20.9113C6.46354 20.6967 5.84413 20.4022 5.4736 20.1004C4.79033 19.544 4.75001 18.8078 4.75001 17.5Z"/> 
                    </svg>
                    <span className="sr-only">Sign in</span>
                  </Link>

                  <button onClick={handleOpenCartModal} className="flex items-center gap-2.5" aria-label="Cart">
                    <span className="inline-block relative">
                      <svg 
                        width="28" 
                        height="28" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 640 640"
                        fill="none"
                        className="fill-current">
                        <path d="M442.9 144C415.6 144 389.9 157.1 373.9 179.2L339.5 226.8C335 233 327.8 236.7 320.1 236.7C312.4 236.7 305.2 233 300.7 226.8L266.3 179.2C250.3 157.1 224.6 144 197.3 144C150.3 144 112.2 182.1 112.2 229.1C112.2 279 144.2 327.5 180.3 371.4C221.4 421.4 271.7 465.4 306.2 491.7C309.4 494.1 314.1 495.9 320.2 495.9C326.3 495.9 331 494.1 334.2 491.7C368.7 465.4 419 421.3 460.1 371.4C496.3 327.5 528.2 279 528.2 229.1C528.2 182.1 490.1 144 443.1 144zM335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1C576 297.7 533.1 358 496.9 401.9C452.8 455.5 399.6 502 363.1 529.8C350.8 539.2 335.6 543.9 320 543.9C304.4 543.9 289.2 539.2 276.9 529.8C240.4 502 187.2 455.5 143.1 402C106.9 358.1 64 297.7 64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1L320 171.8L335 151.1z"/>
                      </svg>
                      <span className="flex items-center bg-current justify-center font-medium text-2xs absolute -right-2 -top-2.5 w-4.5 h-4.5 rounded-full">
                        <span className="text-white dark:text-dark font-medium text-2xs">
                          {product.length}
                        </span>
                      </span>
                    </span>
                  </button>
                </div>

                {/* hamburger desktop: bạn đang chỉ hiện xl:hidden nên desktop không cần */}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-3 dark:border-dark-3">
          <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
            <div className="flex items-center justify-between">
              <div className="xl:flex items-center justify-between">
                <nav>
                  <ul className="flex xl:items-center flex-col xl:flex-row gap-5 xl:gap-6">
                    {menuData.map((menuItem, i) =>
                      menuItem.submenu ? (
                        <Dropdown key={i} menuItem={menuItem} stickyMenu={stickyMenu} />
                      ) : (
                        <li
                          key={i}
                          className="group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full "
                        >
                          <Link
                            href={menuItem.path}
                            className={`hover:text-blue text-custom-sm font-medium text-foreground flex ${
                              stickyMenu ? "xl:py-4" : "xl:py-6"
                            }`}
                          >
                            {menuItem.title}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </nav>
              </div>

              {/* right nav desktop: giữ nguyên phần Đã xem gần đây + Yêu thích của bạn */}
              <div className="hidden xl:block">
                <ul className="flex items-center gap-5.5">
                  <li className="py-4">
                    <a
                      href="#"
                      className="flex items-center gap-1.5 font-medium text-custom-sm text-foreground hover:text-blue"
                    >
                      {/* ... */}
                      Đã xem gần đây
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
