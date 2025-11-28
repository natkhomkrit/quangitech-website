"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Executives() {
  const [pageTitle, setPageTitle] = React.useState(" ");
  const [homeTitle, setHomeTitle] = React.useState(" ");

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    const fetchMenuName = async () => {
      try {
        // Fetch specific menu "Navigation Bar" as requested
        const res = await fetch("/api/menus?name=Navigation Bar");
        if (!res.ok) return;
        const data = await res.json();

        if (data && data.length > 0) {
          const menuItems = data[0].items || [];

          // Helper to find item by url recursively
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
            setPageTitle(currentItem.title || currentItem.name || " ");
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

    fetchMenuName();
  }, []);

  return (
    <div className="bg-white/50">
      <div className="max-w-[1200px] mx-auto px-6 md:px-2 pt-26 md:pt-36 md:pb-4 relative border-b border-gray-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-1 h-8 bg-gray-800 rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-[0.1em] uppercase">
            Executives Committee
          </h1>
        </div>
        <nav className="text-sm text-gray-600 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-800">{homeTitle}</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">{pageTitle}</span>
        </nav>
      </div>
      <div className="relative py-14 md:py-20 bg-white/50">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          <article className="group" data-aos="fade-up">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-700 overflow-hidden">
              <header className="mb-10">
                <div className="inline-flex items-center space-x-3 mb-4">
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-400 tracking-[0.2em] uppercase">
                    Leadership
                  </span>
                </div>
              </header>

              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
                <div className="flex-shrink-0 mx-auto lg:mx-0">
                  <div className="relative w-64 h-64 lg:w-80 lg:h-80">
                    <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg">
                      <Image
                        src="/img/cont10.png"
                        alt="นายกรสิกร ออมสิน - ประธานกรรมการบริหาร"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center lg:text-left space-y-6">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-light text-gray-900 mb-3 leading-tight">
                      นาย กรสิกร ออมสิน
                    </h2>

                    <div className="space-y-2 mb-6">
                      <p className="text-lg font-medium text-gray-800">
                        ประธานกรรมการบริหาร
                      </p>
                      <p className="text-base text-gray-600 font-light">
                        บริษัท ควอนจิเทค จำกัด
                      </p>
                    </div>
                  </div>
                  <blockquote className="relative">
                    <div>
                      <p className="text-lg font-light italic text-gray-700 leading-relaxed mb-4">
                        ความสำเร็จไม่ได้เกิดจากโชค
                        <br />
                        แต่เกิดจากวิสัยทัศน์และการลงมือทำอย่างต่อเนื่อง
                      </p>
                    </div>
                  </blockquote>
                </div>
              </div>
            </div>
          </article>

          <article className="group" data-aos="fade-up" data-aos-delay="200">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-700">
              <header className="mb-10">
                <div className="inline-flex items-center space-x-3 mb-4">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-400 tracking-[0.1em] uppercase">
                    Organization
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 leading-relaxed">
                  โครงสร้างองค์กร
                </h2>
              </header>

              <figure className="relative">
                <div className="relative overflow-hidden rounded-2xl bg-gray-50 p-6">
                  <Image
                    src="/img/default4.png"
                    alt="โครงสร้างองค์กรบริษัท ควอนจิเทค จำกัด"
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <figcaption className="mt-4 text-center">
                  <p className="text-sm text-gray-500 font-light">
                    โครงสร้างองค์กรบริษัท ควอนจิเทค จำกัด
                  </p>
                </figcaption>
              </figure>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
}
