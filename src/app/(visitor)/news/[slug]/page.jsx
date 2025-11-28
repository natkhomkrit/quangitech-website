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

  const [homeTitle, setHomeTitle] = useState("");
  const [pageTitle, setPageTitle] = useState("");

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

          const newsItem = findItem(menuItems, "/news");
          if (newsItem) {
            setPageTitle(newsItem.title || newsItem.name || "");
          }
        }
      } catch (err) {
        console.error("Error fetching menu name:", err);
      }
    };

    fetchNewsItem();
    fetchMenuName();
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
      <div className="max-w-[1200px] mx-auto px-6 md:px-6 pt-26 md:pt-36 md:pb-4 relative border-b border-gray-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-1 h-8 bg-gray-800 rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-[0.1em] uppercase">
            {item.title}
          </h1>
        </div>
        <nav className="text-sm text-gray-600 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-800">
            {homeTitle}
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/news" className="hover:text-gray-800">
            {pageTitle}
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
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">{item.title}</h2>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">{item.excerpt}</p>

          {/* Display HTML content */}
          {item.content && (() => {
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

            const processedContent = sanitizeContent(item.content);

            return (
              <div
                className="prose prose-sm max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            );
          })()}
        </div>
      </div>
      <Footer />
    </>
  );
}
