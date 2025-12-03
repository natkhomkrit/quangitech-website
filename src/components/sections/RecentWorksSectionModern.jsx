"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TitleWithHighlight } from "@/components/ui/TitleWithHighlight";
import ActionButton from "@/components/ui/ActionButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RecentWorksSectionModern({ content, themeColor }) {
    const { title, description, subtitle, subTitle } = content || {};
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                setLoading(true);
                const categories = [
                    "System Development",
                    "Office Supplies",
                    "Data Analysis & Cleaning",
                    "Printing Services",
                    "Computer Training",
                    "Package Programs"
                ];
                const requests = categories.map(cat =>
                    fetch(`/api/posts?category=${encodeURIComponent(cat)}&status=published&isFeatured=true`).then(r => r.json())
                );
                const results = await Promise.all(requests);
                const merged = results.flat();

                const map = new Map();
                for (const itm of merged) {
                    if (itm.slug && itm.status === "published" && itm.isFeatured) {
                        map.set(itm.slug, itm);
                    }
                }
                setPortfolios(Array.from(map.values()).slice(0, 6));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolios();
    }, []);

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="container mx-auto px-4 md:px-6">

                {/* Centered Header */}
                <div className="text-center max-w-3xl mx-auto mb-6" data-aos="fade-up">
                    <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-2 tracking-tight">
                        <TitleWithHighlight title={title || "Recent Works"} />
                    </h2>
                    <div className="w-24 h-1 bg-gray-800 mx-auto rounded-full mb-4"></div>
                    <p className="text-lg text-gray-600 leading-relaxed font-normal">
                        {Array.isArray(description) ? description.join(" ") : description}
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[300px] bg-gray-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Desktop Grid View */}
                        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2" data-aos="fade-up" data-aos-delay="200">
                            {portfolios.map((item) => (
                                <div key={item.id} className="group flex flex-col items-center">
                                    {/* Image Container - Transparent/Clean look */}
                                    <Link href={`/portfolio/${item.slug}`} className="w-full block mb-2">
                                        <div className="relative w-full aspect-[4/3] flex items-center justify-center p-4 transition-transform duration-500 group-hover:-translate-y-2">
                                            <img
                                                src={item.thumbnail || item.img}
                                                alt={item.title}
                                                className="w-full h-full object-contain drop-shadow-2xl"
                                                onError={(e) => e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"}
                                            />
                                        </div>
                                    </Link>

                                    {/* Link Placeholder */}
                                    <div className="text-center">
                                        <Link
                                            href={`/portfolio/${item.slug}`}
                                            className="text-gray-700 font-normal hover:text-gray-900 transition-colors text-base"
                                        >
                                            {item.title}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile Slider View */}
                        <div className="md:hidden relative" data-aos="fade-up" data-aos-delay="200">
                            <Swiper
                                modules={[Navigation, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={1}
                                loop={true}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                navigation={{
                                    prevEl: '.custom-prev',
                                    nextEl: '.custom-next',
                                }}
                                className="pb-12"
                            >
                                {portfolios.map((item) => (
                                    <SwiperSlide key={item.id}>
                                        <div className="flex flex-col items-center">
                                            <Link href={`/portfolio/${item.slug}`} className="w-full block mb-2">
                                                <div className="relative w-full aspect-[4/3] flex items-center justify-center p-4">
                                                    <img
                                                        src={item.thumbnail || item.img}
                                                        alt={item.title}
                                                        className="w-full h-full object-contain drop-shadow-2xl"
                                                        onError={(e) => e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"}
                                                    />
                                                </div>
                                            </Link>
                                            <div className="text-center">
                                                <Link
                                                    href={`/portfolio/${item.slug}`}
                                                    className="text-gray-700 font-normal text-lg"
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
                                <button className="custom-prev w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-colors">
                                    <ChevronLeft size={24} />
                                </button>
                                <button className="custom-next w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-colors">
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-12 md:mt-20 flex justify-center" data-aos="fade-up" data-aos-delay="300">
                    <ActionButton href="/portfolio">
                        View All Projects
                    </ActionButton>
                </div>
            </div>
        </section>
    );
}
