"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Executives() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div>
      <div className="relative w-full h-[80px] bg-gradient-to-b from-[#1a5c48]/95 via-[#216452]/90 to-[#1a5c48]/95"></div>
      <div className="max-w-[1200px] mx-auto px-2 pt-12 md:pt-12 md:pb-4 relative border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-800 tracking-[0.1em] uppercase mb-4">
          EXECUTIVE COMMITTEE
        </h1>
        <nav className="text-sm text-gray-600 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-800">
            หน้าหลัก
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">คณะผู้บริหาร</span>
        </nav>
      </div>
      <div className="relative py-20 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          <article className="group" data-aos="fade-up">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-700 overflow-hidden">
              <header className="mb-10">
                <div className="inline-flex items-center space-x-3 mb-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
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
                      นาย<span className="font-normal">กรสิกร ออมสิน</span>
                    </h2>

                    <div className="space-y-2 mb-6">
                      <p className="text-lg font-medium text-orange-500">
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
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-400 tracking-[0.2em] uppercase">
                    Organization
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 leading-relaxed">
                  โครงสร้าง
                  <span className="font-normal text-blue-500">องค์กร</span>
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
