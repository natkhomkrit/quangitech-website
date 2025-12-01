"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import { ExternalLink, ChevronDown, Loader2 } from "lucide-react";

export default function Portfolio() {
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const worksPerPage = 12;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [homeTitle, setHomeTitle] = useState("");
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchWorks = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch Categories
        const catRes = await fetch("/api/categories");
        if (!catRes.ok) throw new Error("Failed to fetch categories");
        const allCategories = await catRes.json();

        // 2. Filter out unwanted categories
        const excluded = ["News", "Service", "Events"];
        const filteredCats = allCategories.filter(
          (c) => !excluded.includes(c.name)
        );

        const catNames = filteredCats.map(c => c.name);
        setCategories(catNames);

        // 3. Fetch posts for each category
        const requests = catNames.map(cat =>
          fetch(`/api/posts?category=${encodeURIComponent(cat)}&status=published`).then(res => {
            if (!res.ok) throw new Error(`Error fetching ${cat}`);
            return res.json();
          })
        );

        const results = await Promise.all(requests);

        // รวม array ทั้งหมดเข้าด้วยกัน
        let merged = results.flat();

        // เรียงล่าสุดก่อน
        merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (mounted) setItems(merged);

      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Failed to load portfolio items");
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

          const portfolioItem = findItem(menuItems, "/portfolio");
          if (portfolioItem) {
            setPageTitle(portfolioItem.title || portfolioItem.name || "");
          }
        }
      } catch (err) {
        console.error("Error fetching menu name:", err);
      }
    };

    fetchWorks();
    fetchMenuName();

    return () => {
      mounted = false;
    };
  }, []);


  // Filter works by category (category may be in item.category.name)
  const filteredWorks =
    selectedCategory === "All"
      ? items
      : items.filter((w) => (w.category?.name || w.category) === selectedCategory);

  const totalPages = Math.ceil(filteredWorks.length / worksPerPage);
  const startIndex = (currentPage - 1) * worksPerPage;
  const currentWorks = filteredWorks.slice(
    startIndex,
    startIndex + worksPerPage
  );

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-6 pt-26 md:pt-36 md:pb-4 relative border-b border-gray-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-1 h-8 bg-gray-800 rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-[0.1em] uppercase">
            {pageTitle}
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
          <h3 className="text-xl font-bold mb-4">หมวดหมู่ผลงาน</h3>
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
              className={`transform transition-transform ${isAccordionOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {isAccordionOpen && (
            <ul className="mt-2 bg-white border border-gray-200 rounded-lg shadow divide-y">
              <li
                className={`px-4 py-2 cursor-pointer ${selectedCategory === "All"
                  ? "text-[#1a5c48]"
                  : "text-gray-700"
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
                  className={`px-4 py-2 cursor-pointer ${selectedCategory === cat
                    ? "text-[#1a5c48]"
                    : "text-gray-700"
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
              <div className="col-span-full flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-gray-500" size={48} />
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : currentWorks.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">ไม่พบผลงาน</p>
              </div>
            ) : (
              currentWorks.map((work) => {
                const imgSrc = work.thumbnail || work.image || "/img/default.png";
                const dateStr = work.createdAt ? new Date(work.createdAt).toLocaleDateString("th-TH") : work.date || "";

                return (
                  <div
                    key={work.slug}
                    className="bg-white rounded-md overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="relative group overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={work.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <Link
                        href={`/portfolio/${work.slug}`}
                        className="absolute inset-0"
                      />
                    </div>

                    <div className="p-6">
                      <p className="text-gray-700 text-sm line-clamp-2">{work.title}</p>

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">{dateStr}</span>
                        <Link
                          href={`/portfolio/${work.slug}`}
                          className="inline-flex items-center gap-1 text-sm text-gray-700 font-semibold hover:underline"
                        >
                          รายละเอียด <ExternalLink size={14} />
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
