"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import RecentWorks from "@/components/RecentWorks";
import "swiper/css";
import "swiper/css/navigation";

export default function PortfolioDetail() {
  const params = useParams();
  const slug = params?.slug;

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts?slug=${slug}`);

        if (!res.ok) {
          throw new Error("Failed to fetch portfolio");
        }

        const data = await res.json();
        console.log("portfolio data:", data);

        if (data && data.length > 0) {
          const portfolioData = data[0];
          setPortfolio(portfolioData);
        } else {
          setError("Portfolio not found");
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">{error || "Portfolio not found"}</p>
          <Link href="/portfolio" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Portfolio
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
          {portfolio.title}
        </h1>
        <nav className="text-sm text-gray-600 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-800">
            หน้าหลัก
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/portfolio" className="hover:text-gray-800">
            ผลงานของเรา
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">{portfolio.title}</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-8 shadow-sm">
          <span className="text-sm text-gray-500 mb-3 block">
            {new Date(portfolio.createdAt).toLocaleDateString("th-TH")} | {portfolio.category?.name}
          </span>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">{portfolio.title}</h2>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">{portfolio.excerpt}</p>

          {/* Display HTML content */}
          {portfolio.content && (
            <div
              className="prose prose-sm max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: portfolio.content }}
            />
          )}
        </div>
      </div>
      <RecentWorks />
      <Footer />
    </>
  );
}
