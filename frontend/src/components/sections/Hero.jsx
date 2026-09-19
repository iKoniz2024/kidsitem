"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRightIcon, Zap, Store, Sparkles, Layers } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/services/banner.api";
import { getFlashSaleProducts } from "@/services/product.api";
import { getFeaturedVendor } from "@/services/vendor.api";
import { getCategoriesWithCounts } from "@/services/category.api";
import CountdownTimer from "./CountdownTimer";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const heroStyles = `
  .hero-swiper .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 1;
    transition: all 0.3s;
  }
  .hero-swiper .swiper-pagination-bullet-active {
    background: #e11d48;
    width: 20px;
    border-radius: 4px;
  }
`;

export default function Hero({ initialData }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Banners query
  const { data: bannerData, isLoading: isBannerLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
    initialData,
    staleTime: 1000 * 60 * 1, // 1 minute cache
    gcTime: 1000 * 60 * 30,
  });

  // Flash Sale query for Right Promo Card
  const { data: flashData } = useQuery({
    queryKey: ["flash-sale"],
    queryFn: getFlashSaleProducts,
    staleTime: 1000 * 60 * 1, // 1 minute cache
    gcTime: 1000 * 60 * 30,
  });

  // Featured Vendor query
  const { data: featuredVendorData } = useQuery({
    queryKey: ["featured-vendor"],
    queryFn: getFeaturedVendor,
    staleTime: 1000 * 60 * 1, // 1 minute cache
    gcTime: 1000 * 60 * 30,
  });

  // Top Categories with Product Counts query
  const { data: topCategoriesData } = useQuery({
    queryKey: ["topCategoriesWithCounts"],
    queryFn: getCategoriesWithCounts,
    staleTime: 1000 * 60 * 5,
  });

  const topCategories = useMemo(() => {
    if (!Array.isArray(topCategoriesData)) return [];
    return [...topCategoriesData]
      .sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
      .slice(0, 8);
  }, [topCategoriesData]);

  const banners = useMemo(() => {
    const data = Array.isArray(bannerData) ? bannerData : bannerData?.banners || [];
    return data.filter((b) => b.isActive && (b.image || b.images?.length > 0));
  }, [bannerData]);

  const flashProducts = useMemo(() => {
    return flashData?.products || [];
  }, [flashData]);

  const featuredVendor = featuredVendorData?.vendor || null;

  return (
    <section id="hero" className="relative overflow-hidden py-4 sm:py-5">
      <style>{heroStyles}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Parent container bounding Banner Slider & Right Promo Cards */}
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-12 lg:items-stretch">

          {/* ================= MAIN BANNER SLIDER (Takes 8 columns or 9 columns) ================= */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-center aspect-[12/5] w-full">
            {isBannerLoading ? (
              <div className="flex size-full items-center justify-center rounded-none border border-border bg-muted/30">
                <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : banners.length > 0 ? (
              <div className="relative overflow-hidden rounded-none border border-border/60 shadow-sm size-full">
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  speed={800}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  navigation={{
                    prevEl: ".hero-prev",
                    nextEl: ".hero-next",
                  }}
                  loop={banners.length > 1}
                  className="hero-swiper size-full"
                >
                  {banners.map((banner) => (
                    <SwiperSlide key={banner._id}>
                      <Link href="/products" className="block size-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
                        <img
                          src={banner.image || banner.images?.[0]}
                          alt={banner.title || "Promotional Banner"}
                          className="size-full object-cover object-center"
                        />
                      </Link>
                    </SwiperSlide>
                  ))}

                  {banners.length > 1 && (
                    <>
                      <button className="hero-prev absolute left-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-background hover:scale-105">
                        <ChevronLeft className="size-5" />
                      </button>
                      <button className="hero-next absolute right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-background hover:scale-105">
                        <ChevronRight className="size-5" />
                      </button>
                    </>
                  )}
                </Swiper>
              </div>
            ) : null}
          </div>

          {/* ================= RIGHT COLUMN: PROMO CARDS (Featured Store + Flash Deal) ================= */}
          <div className="hidden lg:col-span-4 xl:col-span-3 lg:flex lg:flex-col justify-between gap-3.5 h-full overflow-hidden">

            {/* Card 1: Top Categories Carousel (Dynamic Highest Selling Categories) */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs flex flex-col justify-start gap-2.5 shrink-0 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/80 px-2.5 py-1 text-xs font-bold text-[#FF6584] dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300">
                  <Sparkles className="size-3.5 text-[#FF6584]" /> Top Categories
                </span>
                <Layers className="size-4 text-slate-400 dark:text-slate-500" />
              </div>

              {topCategories.length > 0 ? (
                <Swiper
                  modules={[Autoplay]}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  loop={topCategories.length > 1}
                  className="w-full"
                >
                  {topCategories.map((cat) => (
                    <SwiperSlide key={cat._id}>
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="size-11 rounded-xl object-cover border border-slate-100 shrink-0 dark:border-slate-800" />
                          ) : (
                            <div className="size-11 rounded-xl bg-rose-50 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-[#FF6584] shrink-0">
                              {cat.name?.charAt(0) || "C"}
                            </div>
                          )}
                          <div className="truncate flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">{cat.name}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                              {cat.productCount || 0} Products
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/products?category=${encodeURIComponent(cat.slug)}`}
                          className="block w-full rounded-full bg-[#FF6584] hover:bg-[#EE4D6D] py-2 sm:py-2.5 text-center text-xs sm:text-sm font-bold text-white transition-all shadow-xs"
                        >
                          Explore Category
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="text-xs text-slate-500 text-center py-3 font-medium">
                  Categories Loading...
                </div>
              )}
            </div>

            {/* Card 2: Daily Flash Sale Highlight (Clean White with Soft Sky Accent) */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs flex flex-col justify-start gap-2.5 shrink-0 dark:bg-slate-900 dark:border-slate-800">

              {/* 1. Header Badge */}
              <div className="flex items-center justify-between shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200/80 px-2.5 py-1 text-xs font-bold text-[#0284C7] dark:bg-sky-950/40 dark:border-sky-900/50 dark:text-sky-300">
                  <Zap className="size-3.5 text-[#0284C7]" /> Flash Sale
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Limited</span>
              </div>

              {/* 2. Product Row */}
              {flashProducts.length > 0 ? (
                <div className="h-13 sm:h-14 overflow-hidden shrink-0">
                  <Swiper
                    modules={[Autoplay]}
                    speed={800}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop={flashProducts.length > 1}
                    className="w-full h-full"
                  >
                    {flashProducts.map((fp) => (
                      <SwiperSlide key={fp._id || fp.id} className="h-full flex items-center">
                        <Link href={`/product/${fp._id}`} className="group flex gap-3 items-center w-full">
                          <img
                            src={fp.thumbnail || fp.images?.[0] || fp.image}
                            alt={fp.title || fp.name}
                            className="size-11 sm:size-12 rounded-lg object-cover border border-slate-100 shrink-0 dark:border-slate-800"
                          />
                          <div className="truncate flex-1 min-w-0">
                            <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-[#FF6584] transition-colors">{fp.title || fp.name}</h5>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm sm:text-base font-extrabold text-[#FF6584]">৳{fp.discountPercentage > 0 ? (fp.price * (1 - fp.discountPercentage / 100)).toFixed(0) : fp.price}</span>
                              {fp.discountPercentage > 0 && (
                                <span className="text-xs text-slate-400 line-through">৳{fp.price}</span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : null}

              {/* 3. Countdown Timer */}
              <div className="flex justify-center shrink-0">
                <CountdownTimer size="sm" />
              </div>

              {/* 4. Order Now Button */}
              <Link
                href="/products"
                className="block w-full rounded-full bg-[#FF6584] hover:bg-[#EE4D6D] py-2 sm:py-2.5 text-center text-xs sm:text-sm font-extrabold text-white transition-all shadow-xs shrink-0"
              >
                Order Now
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
