"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ActionButton from "@/components/ui/ActionButton";
import { TitleWithHighlight } from "@/components/ui/TitleWithHighlight";
import { ImageIcon, Calendar, ArrowRight } from "lucide-react";

export default function NewsEventsSection({ content, themeColor }) {
    const { title, description, listTitle, buttonText, buttonLink } = content || {};
    const [newsItems, setNewsItems] = useState([]);
    const [eventsItems, setEventsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

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

    // Initialize selectedItem when data is loaded
    useEffect(() => {
        if (combinedItems.length > 0 && !selectedItem) {
            setSelectedItem(combinedItems[0]);
        }
    }, [combinedItems, selectedItem]);

    const listItems = combinedItems.slice(0, 10); // Display up to 10 items in the list

    const FeaturedCard = ({ item }) => {
        if (!item) return null;
        return (
            <div className="group block h-full">
                <div className="relative h-full overflow-hidden border border-gray-200 bg-gray-100 rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl flex flex-col">
                    <Link href={`/news/${item.slug}`} className="relative aspect-video md:aspect-auto md:h-[400px] overflow-hidden block">
                        <img
                            src={item.thumbnail || ""}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                            <ImageIcon size={48} className="opacity-50" />
                        </div>
                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Featured
                        </div>
                    </Link>
                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                        <div className="flex items-center text-gray-500 text-sm mb-3 gap-2">
                            <Calendar size={14} />
                            <span>{new Date(item.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <Link href={`/news/${item.slug}`}>
                            <h3 className="text-1xl md:text-2xl font-normal text-gray-800 mb-4 leading-tight hover:text-primary transition-colors">
                                {item.title}
                            </h3>
                        </Link>
                        <div
                            className="flex-grow max-h-[300px] overflow-y-auto pr-2 prose max-w-none border border-gray-200 rounded-lg p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
                            dangerouslySetInnerHTML={{ __html: item.content || item.excerpt || "" }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const ListItem = ({ item, isSelected, onClick }) => (
        <div
            onClick={onClick}
            className={`group block cursor-pointer transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
        >
            <div className={`flex gap-4 p-4 rounded-lg transition-colors ${isSelected ? 'bg-gray-50 border border-gray-200' : 'hover:bg-gray-50 border border-transparent'}`}>
                <div className="relative w-24 h-24 md:w-32 md:h-24 bg-white border border-gray-200 rounded-lg flex-shrink-0 overflow-hidden bg-gray-100">
                    <img
                        src={item.thumbnail || ""}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center text-gray-400">
                        <ImageIcon size={24} className="opacity-50" />
                    </div>
                </div>
                <div className="flex flex-col justify-center py-1">
                    <div className="flex items-center text-gray-400 text-xs mb-2 gap-1">
                        <Calendar size={12} />
                        <span>{new Date(item.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <h4 className={`text-lg font-normal leading-snug line-clamp-2 transition-colors mb-1 ${isSelected ? 'text-primary' : 'text-gray-800 group-hover:text-primary'}`}>
                        {item.title}
                    </h4>
                    <Link
                        href={`/news/${item.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${isSelected ? 'text-white' : 'bg-black text-white group-hover:bg-primary'}`}
                        style={{ backgroundColor: isSelected ? (themeColor || 'var(--primary)') : undefined }}
                    >
                        <ArrowRight size={12} />
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <section className="bg-white py-12 md:py-20">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-12 flex flex-col items-center" data-aos="fade-up">
                    <h2 className="text-2xl md:text-5xl font-normal text-gray-800 mb-4">
                        <TitleWithHighlight title={title} />
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
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

                <div className="max-w-6xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="loader2 ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                        </div>
                    )}
                    {error && (
                        <div className="text-center py-20 text-red-600">
                            เกิดข้อผิดพลาด: {error}
                        </div>
                    )}

                    {!loading && !error && combinedItems.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
                            {/* Featured Item (Left Column) */}
                            <div className="lg:col-span-7 xl:col-span-8">
                                <FeaturedCard item={selectedItem || combinedItems[0]} />
                            </div>

                            {/* List Items (Right Column) */}
                            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
                                <div className="flex items-center justify-between mb-2 px-2">
                                    <h3 className="text-xl font-normal text-gray-800">{listTitle || "ข่าวสารล่าสุด"}</h3>
                                    <Link href={buttonLink || "/news"} className="text-sm text-primary hover:underline flex items-center gap-2">
                                        {buttonText || "ดูทั้งหมด"}
                                        <span className="flex items-center justify-center w-6 h-6 bg-black text-white rounded-full">
                                            <ArrowRight size={12} />
                                        </span>
                                    </Link>
                                </div>
                                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 border border-gray-200 rounded-lg p-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                                    {listItems.map((item, index) => (
                                        <ListItem
                                            key={index}
                                            item={item}
                                            isSelected={selectedItem?.id === item.id}
                                            onClick={() => setSelectedItem(item)}
                                        />
                                    ))}
                                </div>
                                {listItems.length === 0 && (
                                    <div className="text-gray-400 text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        ไม่มีข่าวสารเพิ่มเติม
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
