"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, ImageIcon } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import ActionButton from "@/components/ui/ActionButton";
import "swiper/css";
import "swiper/css/pagination";
import { TitleWithHighlight } from "@/components/ui/TitleWithHighlight";

export default function RecentWorksSection({ content }) {
    const { title, description, subtitle, subTitle } = content || {};
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
                    <span className="text-sm font-semibold text-gray-400 tracking-[0.25em] uppercase block mb-2">
                        {subtitle || subTitle || ""}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-[0.1em] relative inline-block">
                        <TitleWithHighlight title={title} />
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-30 h-1 bg-orange-400 rounded-full"></span>
                    </h3>
                    <p className="mt-4 text-sm md:text-base text-gray-600 leading-[1.8] font-light max-w-2xl mx-auto mb-4">
                        {Array.isArray(description) ? (
                            description.map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    {index < description.length - 1 && <br />}
                                </React.Fragment>
                            ))
                        ) : (
                            description || ""
                        )}
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
                                        <div className="relative overflow-hidden bg-gray-100 h-56 sm:h-60">
                                            <img
                                                src={item.thumbnail || item.img}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="hidden absolute inset-0 flex items-center justify-center text-gray-400">
                                                <ImageIcon size={48} className="opacity-50" />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

                <div className="flex justify-center mt-10">
                    <ActionButton href={content?.buttonLink || "/portfolio"}>
                        {content?.buttonText || "ดูผลงานทั้งหมด"}
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}
