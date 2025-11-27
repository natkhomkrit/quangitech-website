"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";

export default function RelatedWorks({ categoryId, currentSlug }) {
    const [relatedPortfolios, setRelatedPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!categoryId) return;

        const fetchRelated = async () => {
            try {
                setLoading(true);
                // Fetch posts with the same category
                const res = await fetch(`/api/posts?categoryId=${categoryId}&status=published`);
                if (!res.ok) throw new Error("Failed to fetch related works");

                const data = await res.json();

                if (Array.isArray(data)) {
                    // Filter out the current item
                    // Use decodeURIComponent to ensure we match correctly even if URL is encoded
                    const normalizedCurrentSlug = decodeURIComponent(currentSlug);
                    const filtered = data.filter(item => item.slug !== normalizedCurrentSlug);

                    setRelatedPortfolios(filtered);
                }
            } catch (err) {
                console.error("Error fetching related works:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();
    }, [categoryId, currentSlug]);

    if (loading || relatedPortfolios.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-50 py-12 border-t border-gray-200">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="text-center mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-[0.1em] relative inline-block uppercase">
                        Related Works
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-orange-400 rounded-full"></span>
                    </h3>
                    <p className="mt-4 text-gray-600 font-light">
                        ผลงานที่เกี่ยวข้อง
                    </p>
                </div>

                <Swiper
                    spaceBetween={24}
                    loop={relatedPortfolios.length > 3}
                    modules={[Pagination, Autoplay]}
                    autoplay={{ delay: 3000 }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        320: { slidesPerView: 1, spaceBetween: 12 },
                        640: { slidesPerView: 2, spaceBetween: 16 },
                        1024: { slidesPerView: 3, spaceBetween: 20 },
                        1280: { slidesPerView: 4, spaceBetween: 24 },
                    }}
                    className="pb-12"
                >
                    {relatedPortfolios.map(item => (
                        <SwiperSlide key={item.id}>
                            <div className="relative group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white h-full">
                                <Link href={`/portfolio/${item.slug}`}>
                                    <div className="relative overflow-hidden aspect-[4/3]">
                                        <img
                                            src={item.thumbnail || "/img/placeholder.png"}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                    </div>
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
