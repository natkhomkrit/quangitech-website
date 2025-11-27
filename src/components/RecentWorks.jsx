"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import GradientButton from "@/components/ui/GradientButton";
import "swiper/css";
import "swiper/css/pagination";

export default function RecentWorks() {
    const [portfolios, setPortfolios] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                setLoading(true);
                setError("");

                const categories = [
                    "System Development",
                    "Office Supplies",
                    "Data Analysis & Cleaning",
                    "Printing Services",
                    "Computer Training",
                    "Package Programs"
                ];

                const requests = categories.map(cat =>
                    fetch(
                        `/api/posts?category=${encodeURIComponent(
                            cat
                        )}&status=published&isFeatured=true`
                    ).then(r => r.json())
                );

                const results = await Promise.all(requests);

                const merged = results.flat();

                const map = new Map();
                for (const itm of merged) {
                    const key = itm.slug || itm.id;
                    if (!key) continue;

                    if (itm.status !== "published") continue;
                    if (!itm.isFeatured) continue;

                    map.set(key, itm);
                }

                const deduped = Array.from(map.values());

                setPortfolios(deduped);
            } catch (err) {
                console.error("Error fetching portfolios:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolios();
    }, []);

    const displayData = portfolios;

    return (
        <div className="bg-gray-100 py-8">
            <div className="max-w-[1400px] mx-auto px-4">

                <div className="text-center mb-8">
                    <h3 className="text-3xl md:text-5xl font-bold text-gray-800 tracking-[0.1em] relative inline-block">
                        Featured Works
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-30 h-1 bg-orange-400 rounded-full"></span>
                    </h3>
                    <p className="mt-4 text-sm md:text-base text-gray-600 leading-[1.8] font-light max-w-2xl mx-auto mb-4">
                        ตัวอย่างผลงานที่ช่วยสร้างความน่าเชื่อถือให้กับธุรกิจ พร้อมออกแบบมาเพื่อเพิ่มการเข้าถึงกลุ่มลูกค้าบนโลกออนไลน์ได้มากยิ่งขึ้น
                    </p>
                </div>

                {loading && (
                    <div className="text-center py-10 text-gray-500 text-sm">
                        กำลังโหลดข้อมูล...
                    </div>
                )}

                {error && (
                    <div className="text-center py-10 text-red-600 text-sm">
                        เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}
                    </div>
                )}

                {!loading && !error && (
                    <Swiper
                        spaceBetween={24}
                        loop
                        modules={[Pagination, Autoplay]}
                        autoplay={{ delay: 3000 }}
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 12 },
                            640: { slidesPerView: 2, spaceBetween: 16 },
                            1024: { slidesPerView: 3, spaceBetween: 20 },
                            1280: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                    >
                        {displayData.map(item => (
                            <SwiperSlide key={item.id}>
                                <div className="relative group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
                                    <Link
                                        href={`/portfolio/${item.slug}`}
                                    >
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={item.thumbnail || item.img}
                                                alt={item.title}
                                                className="w-full h-56 sm:h-60 object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                        </div>

                                        {/* <div className="flex justify-end items-end absolute inset-0 p-6">
                                        <Link
                                            href={`/portfolio/${item.slug}`}
                                            className="inline-flex items-center gap-1 text-sm font-medium text-white bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 rounded-full hover:bg-white/30 hover:border-white/50 transition-all duration-200 group/btn"
                                        >
                                            <span>ดูรายละเอียด</span>
                                            <ExternalLink
                                                size={14}
                                                className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
                                            />
                                        </Link>
                                    </div> */}
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

                <div className="flex justify-center mt-10">
                    <GradientButton href="/portfolio">ดูผลงานทั้งหมด</GradientButton>
                </div>
            </div>
        </div>
    );
}
