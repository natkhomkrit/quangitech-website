"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import { useParams } from "next/navigation";

export default function ServiceDetail() {
  const params = useParams();
  const slug = params?.slug;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts?slug=${slug}&status=published`);

        if (!res.ok) {
          throw new Error("Failed to fetch service");
        }

        const data = await res.json();
        console.log("service data:", data);

        if (data && data.length > 0) {
          const serviceData = data[0];
          setService(serviceData);
          // setMainImage(serviceData.thumbnail || "");
        } else {
          setError("Service not found");
        }
      } catch (err) {
        console.error("Error fetching service:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
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
      <div className="relative w-full h-[80px] bg-gradient-to-b from-[#1a5c48]/95 via-[#216452]/90 to-[#1a5c48]/95"></div>

      <div className="max-w-[1200px] mx-auto px-2 pt-12 md:pt-12 md:pb-4 relative border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-800 tracking-[0.1em] uppercase mb-4">
          {service.title}
        </h1>
        <nav className="text-sm text-gray-600 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-800">
            หน้าหลัก
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">{service.title}</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-8 shadow-sm">
          <span className="text-sm text-gray-500 mb-3 block">
            {new Date(service.createdAt).toLocaleDateString("th-TH")} | {service.category?.name}
          </span>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">{service.title}</h2>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">{service.excerpt}</p>

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
