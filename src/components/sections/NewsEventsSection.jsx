"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ActionButton from "@/components/ui/ActionButton";
import { TitleWithHighlight } from "@/components/ui/TitleWithHighlight";

export default function NewsEventsSection({ content }) {
    const { title, description, buttonText, buttonLink } = content || {};
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

    return (
        <section className="bg-white py-20">
            <div className="max-w-[1140px] mx-auto px-6">
                <div className="text-center mb-10 flex flex-col items-center" data-aos="fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-[0.1em]">
                        <TitleWithHighlight title={title} />
                    </h2>
                    <span className="my-2 w-30 h-1 bg-orange-400 rounded-full"></span>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {description || ""}
                    </p>
                </div>
                <section className="max-w-6xl mx-auto px-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {loading && (
                            <div className="col-span-full text-center py-10 text-gray-500 text-sm">
                                กำลังโหลดข้อมูล...
                            </div>
                        )}
                        {error && (
                            <div className="col-span-full text-center py-10 text-red-600 text-sm">
                                เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}
                            </div>
                        )}
                        {!loading && !error && combinedItems.map((item, index) => (
                            <div
                                key={index}
                                className="group bg-white border border-gray-300 rounded-3xl overflow-hidden
            hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-gray-200
            transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={item.thumbnail || "/img/default.png"}
                                        alt={item.title}
                                        className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-5">
                                        {item.excerpt}
                                    </p>
                                    <Link href={`/news/${item.slug}`}>
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
                        ))}
                    </div>
                </section>
                <div className="text-center">
                    <ActionButton href={buttonLink || "/news"}>{buttonText || "ดูข่าวสารทั้งหมด"}</ActionButton>
                </div>
            </div>
        </section>
    );
}
