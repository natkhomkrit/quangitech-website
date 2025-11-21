"use client";

import React, { useState, useRef, useEffect } from "react";
import Footer from "@/components/ui/footer";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function NewsEventDetail() {
  const params = useParams();
  const slug = params?.slug;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchNewsItem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts?slug=${slug}`);

        if (!res.ok) {
          throw new Error("Failed to fetch news item");
        }

        const data = await res.json();
        console.log("news item data:", data);

        if (data && data.length > 0) {
          const newsData = data[0];
          setItem(newsData);
        } else {
          setError("ไม่พบข่าวหรือกิจกรรมนี้");
        }
      } catch (err) {
        console.error("Error fetching news item:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [slug]);

  const scrollRef = useRef(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || "ไม่พบข่าวหรือกิจกรรมนี้"}</p>
          <Link href="/news" className="text-blue-600 hover:underline mt-4 inline-block">
            กลับไปยังข่าวสารและกิจกรรม
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-[80px] bg-gradient-to-b from-[#1a5c48]/95 via-[#216452]/90 to-[#1a5c48]/95"></div>
      <div className="max-w-[1200px] mx-auto px-2 pt-12 md:pt-12 md:pb-4 relative border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-800 tracking-[0.1em] uppercase mb-4">
          {item.title}
        </h1>
        <nav className="text-sm text-gray-600 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-800">
            หน้าหลัก
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/news" className="hover:text-gray-800">
            ข่าวและกิจกรรม
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">{item.title}</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-8 shadow-sm">
          <span className="text-sm text-gray-500 mb-3 block">
            {new Date(item.createdAt).toLocaleDateString("th-TH")} | {item.category?.name}
          </span>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">{item.title}</h2>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">{item.excerpt}</p>

          {/* Display HTML content */}
          {item.content && (
            <div
              className="prose prose-sm max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
