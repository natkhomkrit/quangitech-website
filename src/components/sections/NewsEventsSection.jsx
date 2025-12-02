"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ActionButton from "@/components/ui/ActionButton";
import { TitleWithHighlight } from "@/components/ui/TitleWithHighlight";
import { ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function NewsEventsSection({ content }) {
    const { title, description, buttonText, buttonLink, subtitle, subTitle } = content || {};
    const [newsItems, setNewsItems] = useState([]);
    const [eventsItems, setEventsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [newsRes, eventsRes] = await Promise.all([
                    fetch("/api/posts?category=News&status=published&isFeatured=true"),
                    fetch("/api/posts?category=Events&status=published&isFeatured=true"),
                ]);

                if (!newsRes.ok || !eventsRes.ok) throw new Error("Failed to fetch posts");

                const newsData = await newsRes.json();
                const eventsData = await eventsRes.json();

                setNewsItems(newsData);
                setEventsItems(eventsData);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const combinedItems = [...newsItems, ...eventsItems].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const NewsCard = ({ item }) => (
        <div className="group bg-white border border-gray-300 rounded-3xl overflow-hidden
            hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-gray-200
            transform hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
            <div className="relative overflow-hidden bg-gray-100 h-52 flex-shrink-0">
                <img
                    src={item.thumbnail || ""}
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
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-normal text-gray-800 mb-2 leading-tight">
                    {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-5 flex-grow">
                    {item.excerpt}
                </p>
                <Link href={`/news/${item.slug}`} className="mt-auto">
                    <div className="inline-flex items-center gap-2 text-gray-600 font-medium
                hover:text-gray-800 transition-all duration-200">
                        <span className="text-sm">อ่านเพิ่มเติม</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </Link>
            </div>
        </div>
    );

    return (
        <section className="bg-white py-12 md:py-16">
            <div className="max-w-[1140px] mx-auto px-6">
                <div className="text-center mb-10 flex flex-col items-center" data-aos="fade-up">
                    <h2 className="text-3xl md:text-5xl font-normal text-gray-800 mb-4">
                        <TitleWithHighlight title={title} />
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
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
                <section className="max-w-6xl mx-auto px-6" data-aos="fade-up" data-aos-delay="200">
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
                        <>
                            {/* Desktop Grid View */}
                            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                                {combinedItems.map((item, index) => (
                                    <NewsCard key={index} item={item} />
                                ))}
                            </div>

                            {/* Mobile Slider View */}
                            <div className="md:hidden relative mb-12">
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
                                        prevEl: '.news-prev',
                                        nextEl: '.news-next',
                                    }}
                                    className="pb-4"
                                >
                                    {combinedItems.map((item, index) => (
                                        <SwiperSlide key={index} className="h-auto">
                                            <NewsCard item={item} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {/* Custom Navigation Buttons */}
                                <div className="flex justify-center gap-4 mt-4">
                                    <button className="news-prev w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-colors">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button className="news-next w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-colors">
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </section>
                <div className="text-center" data-aos="fade-up" data-aos-delay="300">
                    <ActionButton href={buttonLink || "/news"}>{buttonText || "ดูข่าวสารทั้งหมด"}</ActionButton>
                </div>
            </div>
        </section>
    );
}
