"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
                    <h3 className="text-2xl md:text-3xl font-normal text-gray-800 tracking-[0.1em] relative inline-block uppercase">
                        Related Works
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-800 rounded-full"></span>
                    </h3>
                    <p className="mt-4 text-gray-600 font-light">
                        ผลงานที่เกี่ยวข้อง
                    </p>
                </div>

                <div className="relative">
                    <Swiper
                        spaceBetween={24}
                        loop={relatedPortfolios.length > 3}
                        modules={[Pagination, Autoplay, Navigation]}
                        autoplay={{ delay: 3000 }}
                        pagination={{ clickable: true }}
                        navigation={{
                            prevEl: '.related-prev',
                            nextEl: '.related-next',
                        }}
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
                                <div className="flex flex-col items-center group">
                                    <Link href={`/portfolio/${item.slug}`} className="w-full block mb-4">
                                        <div className="relative w-full aspect-[4/3] flex items-center justify-center p-4 transition-all duration-500 group-hover:-translate-y-2">
                                            <img
                                                src={item.thumbnail || "/img/placeholder.png"}
                                                alt={item.title}
                                                className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    </Link>
                                    <div className="text-center px-2">
                                        <Link
                                            href={`/portfolio/${item.slug}`}
                                            className="text-gray-700 font-normal hover:text-orange-500 transition-colors text-lg line-clamp-2"
                                        >
                                            {item.title}
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-4">
                        <button className="related-prev w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-all duration-300">
                            <ChevronLeft size={24} />
                        </button>
                        <button className="related-next w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-all duration-300">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
