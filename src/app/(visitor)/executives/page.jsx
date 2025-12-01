"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import AOS from "aos";
import "aos/dist/aos.css";
import ExecutiveSection from "@/components/sections/ExecutiveSection";
import CompanySection from "@/components/sections/CompanySection";
import { Loader2 } from "lucide-react";

export default function Executives() {
  const [pageTitle, setPageTitle] = React.useState(" ");
  const [homeTitle, setHomeTitle] = React.useState(" ");
  const [pageData, setPageData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

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

          const currentItem = findItem(menuItems, "/executives");
          if (currentItem) {
            setPageTitle(currentItem.name || " ");
          }

          const homeItem = findItem(menuItems, "/");
          if (homeItem) {
            setHomeTitle(homeItem.title || homeItem.name || " ");
          }
        }
      } catch (err) {
        console.error("Error fetching menu name:", err);
      }
    };

    const fetchPageData = async () => {
      try {
        const res = await fetch("/api/pages/executives");
        if (res.ok) {
          const data = await res.json();
          setPageData(data);
        }
      } catch (error) {
        console.error("Error fetching page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuName();
    fetchPageData();
  }, []);

  return (
    <div className="bg-white/50">
      <div className="max-w-[1200px] mx-auto px-6 md:px-2 pt-26 md:pt-36 md:pb-4 relative border-b border-gray-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-1 h-8 bg-gray-800 rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-[0.1em] uppercase">
            {pageTitle}
          </h1>
        </div>
        <nav className="text-sm text-gray-600 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-800">{homeTitle}</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">{pageTitle}</span>
        </nav>
      </div>

      <div className="relative py-14 md:py-20 bg-white/50 min-h-[50vh]">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-gray-500" size={48} />
            </div>
          ) : pageData && pageData.sections && pageData.sections.length > 0 ? (
            pageData.sections.map((section) => {
              if (section.type === 'executive') {
                return <ExecutiveSection key={section.id} content={section.content} />;
              }
              if (section.type === 'company' || section.type === 'company-section') {
                return <CompanySection key={section.id} content={section.content} />;
              }
              return null;
            })
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p>No content available.</p>
              <p className="text-sm">Please add "Executive Section" blocks in the backoffice.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
