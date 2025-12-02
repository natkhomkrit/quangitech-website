"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ServiceDetail() {
  const params = useParams();
  const slug = params?.slug;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [mainImage, setMainImage] = useState("");

  const [homeTitle, setHomeTitle] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        // Fetch from new /api/services endpoint
        // Since we don't have a slug search endpoint yet, we might need to fetch all and find, or update API.
        // Let's update API to support slug search or just fetch all for now (not efficient but works for small data).
        // Better: Update GET /api/services to accept slug query.

        // Wait, I should update the API first to support slug query.
        // But for now, let's try to fetch all and filter client side if API doesn't support it, 
        // OR update the API in the next step. 
        // Actually, let's assume I will update the API to support ?slug=...

        const res = await fetch(`/api/services?slug=${slug}`);

        if (!res.ok) {
          throw new Error("Failed to fetch service");
        }

        const data = await res.json();
        console.log("service data:", data);

        // API /api/services returns array if no ID? 
        // Let's check my previous API implementation.
        // GET /api/services returns all.
        // I need to update API to support filtering by slug.

        if (data && data.length > 0) {
          // If API returns array of all services, find the one with matching slug
          const found = data.find(s => s.slug === slug);
          if (found) {
            setService(found);
          } else {
            setError("Service not found");
          }
        } else {
          // If API returns object (if I implemented search), handle it.
          // But currently it returns all.
          setError("Service not found");
        }
      } catch (err) {
        console.error("Error fetching service:", err);
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
        }
      } catch (err) {
        console.error("Error fetching menu name:", err);
      }
    };

    fetchService();
    fetchMenuName();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-gray-500" size={48} />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">{error || "Service not found"}</p>
          <Link href="/services" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-6 md:px-2 pt-26 md:pt-36 md:pb-4 relative border-b border-gray-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-1 h-8 bg-gray-800 rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-[0.1em] uppercase">
            {service.title}
          </h1>
        </div>
        <nav className="text-sm text-gray-600 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-800">
            {homeTitle}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">{service.title}</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-8 shadow-sm">
          <span className="text-sm text-gray-500 mb-3 block">
            {new Date(service.createdAt).toLocaleDateString("th-TH")}
          </span>

          {/* Display HTML content */}
          {service.content && (() => {
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

            const processedContent = sanitizeContent(service.content);

            return (
              <div
                className="prose prose-sm max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            );
          })()}
        </div>
        {/* <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 flex items-center justify-center bg-white">
          <img
            src={mainImage || service.thumbnail || "/img/default.png"}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div> */}
      </div>

      <Footer />
    </>
  );
}
