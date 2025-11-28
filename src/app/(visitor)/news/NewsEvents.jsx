"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import { ExternalLink, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function NewsEvents() {
  const categories = ["ข่าว", "กิจกรรม"];
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam === "All") {
      setSelectedCategory("All");
    } else if (categoryParam === "ข่าว" || categoryParam === "News") {
      setSelectedCategory("ข่าว");
    } else if (categoryParam === "กิจกรรม" || categoryParam === "Events") {
      setSelectedCategory("กิจกรรม");
    }
  }, [searchParams]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false); // <-- ประกาศ state
  const itemsPerPage = 9;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [homeTitle, setHomeTitle] = useState("");
  const [pageTitle, setPageTitle] = useState("");

  const categoryMap = {
    ข่าว: "News",
    กิจกรรม: "Events",
  };

  useEffect(() => {
    let mounted = true;

    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        let data = [];

        if (selectedCategory === "All") {
          const [resNews, resEvents] = await Promise.all([
            fetch(`/api/posts?category=News&status=published`),
            fetch(`/api/posts?category=Events&status=published`),
          ]);
          if (!resNews.ok || !resEvents.ok) throw new Error("Failed to fetch posts");
          const news = await resNews.json();
          const events = await resEvents.json();
          data = [...news, ...events];
        } else {
          const apiCat = categoryMap[selectedCategory] || "News";
          const res = await fetch(`/api/posts?category=${apiCat}&status=published`);
          if (!res.ok) throw new Error("Failed to fetch posts");
          data = await res.json();
        }

        // sort by createdAt desc
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (mounted) setItems(data);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Failed to load posts");
      } finally {
        if (mounted) setLoading(false);
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

    fetchItems();
    fetchMenuName();

    return () => {
      mounted = false;
    };
  }, [selectedCategory]);

  const filteredItems = items;

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="relative w-full h-[80px] bg-white shadow-md"></div>
      <div className="max-w-[1200px] mx-auto px-2 pt-12 md:pt-12 md:pb-4 relative border-b border-gray-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-1 h-8 bg-gray-800 rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-[0.1em] uppercase">
            News and Events
          </h1>
        </div>
        <nav className="text-sm text-gray-600 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-800">
            {homeTitle}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">{pageTitle}</span>
        </nav>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row gap-8">
        <aside className="hidden md:block md:w-1/4 bg-white rounded-xl shadow p-6 sticky top-24 h-fit">
          <h3 className="text-xl font-bold mb-4">หมวดหมู่</h3>
          <ul className="space-y-2">
            <li
              className={`px-4 py-2 rounded-lg transition cursor-pointer ${selectedCategory === "All"
                ? "bg-gray-900 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                }`}
              onClick={() => {
                setSelectedCategory("All");
                setCurrentPage(1);
              }}
            >
              All
            </li>
            {categories.map((cat) => (
              <li
                key={cat}
                className={`px-4 py-2 rounded-lg transition cursor-pointer ${selectedCategory === cat
                  ? "bg-gray-900 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                  }`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
              >
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        <div className="md:hidden mb-6 w-full">
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="flex items-center justify-between w-full px-4 py-3 bg-white rounded-lg shadow border border-gray-200"
          >
            <span className="font-medium text-gray-700">
              {selectedCategory === "All" ? "All" : selectedCategory}
            </span>
            <ChevronDown
              size={18}
              className={`transform transition-transform ${isAccordionOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isAccordionOpen && (
            <ul className="mt-2 bg-white border border-gray-200 rounded-lg shadow divide-y">
              <li
                className={`px-4 py-2 cursor-pointer ${selectedCategory === "All" ? "text-[#1a5c48]" : "text-gray-700"
                  }`}
                onClick={() => {
                  setSelectedCategory("All");
                  setCurrentPage(1);
                  setIsAccordionOpen(false);
                }}
              >
                All
              </li>
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={`px-4 py-2 cursor-pointer ${selectedCategory === cat ? "text-[#1a5c48]" : "text-gray-700"
                    }`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                    setIsAccordionOpen(false);
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>

        <main className="flex-1 w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">ไม่พบข่าวสารหรือกิจกรรม</p>
              </div>
            ) : (
              currentItems.map((item) => {
                const imgSrc = item.thumbnail || item.image || "/img/default.png";
                const description = item.excerpt || item.description || "";
                const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString("th-TH") : item.date || "";
                const catName = item.category?.name || item.category || "";
                const displayCategory = catName === "News" ? "ข่าว" : catName === "Events" ? "กิจกรรม" : catName;

                return (
                  <div
                    key={item.slug}
                    className="bg-white rounded-md overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="relative group overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={item.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Link
                        href={`/news/${item.slug}`}
                        className="absolute inset-0"
                      />
                      {/* <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">

                      </div> */}
                    </div>
                    <div className="p-6">
                      <p className="text-gray-700 text-sm line-clamp-2">{item.title}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">{dateStr}</span>
                        <Link
                          href={`/news/${item.slug}`}
                          className="inline-flex items-center gap-1 text-sm text-gray-800 font-semibold hover:underline"
                        >
                          อ่านต่อ <ExternalLink size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex justify-center mt-8 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-gray-100 rounded">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
