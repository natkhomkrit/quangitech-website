"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import RelatedWorks from "@/components/RelatedWorks";
import "swiper/css";
import "swiper/css/navigation";
import { Loader2 } from "lucide-react";

export default function PortfolioDetail() {
  const params = useParams();
  const slug = params?.slug;

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef(null);

  const [homeTitle, setHomeTitle] = useState("");
  const [portfolioTitle, setPortfolioTitle] = useState("");

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

    const fetchMenuName = async () => {
      try {
        const res = await fetch("/api/menus?name=Navigation Bar");
        if (!res.ok) return;
        const data = await res.json();

        if (data && data.length > 0) {
          const menuItems = data[0].items || [];

          const findItem = (items, url) => {
            for (const item of items) {
              if (item.url === url || item.href === url || item.link === url || item.path === url) {
                return item;
              }
              if (item.children && item.children.length > 0) {
                const found = findItem(item.children, url);
                if (found) return found;
              }
            }
            return null;
          };

          const homeItem = findItem(menuItems, "/");
          if (homeItem) {
            setHomeTitle(homeItem.title || homeItem.name || "");
          }

          const portfolioItem = findItem(menuItems, "/portfolio");
          if (portfolioItem) {
            setPortfolioTitle(portfolioItem.title || portfolioItem.name || "");
          }
        }
      } catch (err) {
        console.error("Error fetching menu name:", err);
      }
    };

    fetchPortfolio();
    fetchMenuName();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-gray-500" size={48} />
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
      <div className="max-w-[1200px] mx-auto px-6 md:px-6 pt-26 md:pt-36 md:pb-4 relative border-b border-gray-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-1 h-8 bg-gray-800 rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-[0.1em] uppercase">
            {portfolio.title}
          </h1>
        </div>
        <nav className="text-sm text-gray-600 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-800">
            {homeTitle}
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/portfolio" className="hover:text-gray-800">
            {portfolioTitle}
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
          <h2 className="text-2xl md:text-3xl font-normal mb-6 text-gray-900">{portfolio.title}</h2>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">{portfolio.excerpt}</p>

          {/* Display HTML content */}
          {portfolio.content && (() => {
            // Sanitize content HTML so image src/href that are relative (e.g. "uploads/...")
            // become root-relative ("/uploads/...") and remove localhost origins.
            const sanitizeContent = (html) => {
              if (!html) return html;
              let out = html;
              // remove local dev origin if present
              out = out.replace(/https?:\/\/localhost:\d+/gi, '');
              // ensure relative src/href become root-relative
              out = out.replace(/(src|href)=("|')(?!(?:https?:|\/))(.*?)\2/gi, (m, attr, q, url) => {
                // add leading slash
                return `${attr}=${q}/${url}${q}`;
              });
              // specifically fix common uploads paths without leading slash
              out = out.replace(/(src|href)=("|')\/?(uploads\/[^"]+)\2/gi, (m, attr, q, url) => {
                return `${attr}=${q}/${url}${q}`;
              });
              return out;
            };

            const processedContent = sanitizeContent(portfolio.content);

            return (
              <div
                className="prose prose-sm max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            );
          })()}
        </div>

        {/* แสดงรูปภาพ thumbnail
        {portfolio.thumbnail && (
          <div className="w-full rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 flex items-center justify-center bg-white mb-8">
            <img
              src={portfolio.thumbnail}
              alt={portfolio.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )} */}
      </div>
      {portfolio.category?.id && (
        <RelatedWorks categoryId={portfolio.category.id} currentSlug={slug} />
      )}
      <Footer />
    </>
  );
}
