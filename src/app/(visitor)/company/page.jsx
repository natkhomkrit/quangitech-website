"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Company() {
    const [pageTitle, setPageTitle] = React.useState(" ");
    const [homeTitle, setHomeTitle] = React.useState(" ");

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

                    const currentItem = findItem(menuItems, "/company");
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
        <div>
            <div className="relative w-full h-[80px] bg-white shadow-md"></div>
            <div className="max-w-[1200px] mx-auto px-2 pt-12 md:pt-12 md:pb-4 relative border-b border-gray-300">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-[0.1em] uppercase">
                        Company Information
                    </h1>
                </div>
                <nav className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                    <Link href="/" className="hover:text-gray-800">{homeTitle}</Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-800">{pageTitle}</span>
                </nav>
            </div>

            <section className="relative py-20 bg-gray-50/50">
                <div className="max-w-5xl mx-auto px-6 space-y-16">

                    <article className="group" data-aos="fade-up">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-700">

                            <header className="mb-10">
                                <div className="inline-flex items-center space-x-3 mb-4">
                                    <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
                                    <span className="text-xs font-medium text-gray-400 tracking-[0.2em] uppercase">
                                        Our Beginning
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-light text-gray-900 leading-relaxed">
                                    จุดเริ่มต้นของควอนจิเทค
                                    <span className="font-normal text-orange-500"> ควอนจิเทค</span>
                                </h2>
                            </header>

                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-600 leading-[1.8] font-light text-base md:text-lg mb-8">
                                    บริษัท ควอนจิเทค จำกัด ได้ก่อตั้งในปีพ.ศ. 2560 จากการมองเห็นเทคโนโลยีทางด้าน
                                    ควอนตัม (Quantum Technology) เทคโนโลยีดิจิตอล (Digital Technology)
                                    และเทคโนโลยีสารสนเทศ (Information Technology) ที่จะเป็นเครื่องมือขับเคลื่อนโลกในอนาคต
                                </p>

                                <p className="text-gray-600 leading-[1.8] font-light text-base md:text-lg mb-8">
                                    ประกอบด้วยความคิดและความตั้งใจของทีมงานและผู้บริหารทางด้านเทคโนโลยีสารสนเทศรุ่นใหม่ที่มีประสบการณ์ด้านเทคโนโลยีสารสนเทศไม่น้อยกว่า 15 ปี
                                    ซึ่งบริษัทให้บริการหลักทางด้านการเป็นที่ปรึกษา วิเคราะห์ ออกแบบและพัฒนาระบบสารสนเทศ
                                    เพื่อให้ตรงกับความต้องการขององค์กร
                                </p>
                            </div>

                            <figure className="mt-12">
                                <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                                    <img
                                        src="/img/cont1.png"
                                        alt="ภาพแสดงการเริ่มต้นของควอนจิเทค"
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            </figure>
                        </div>
                    </article>

                    <article className="group" data-aos="fade-up">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-700">

                            <header className="mb-10">
                                <div className="inline-flex items-center space-x-3 mb-4">
                                    <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
                                    <span className="text-xs font-medium text-gray-400 tracking-[0.2em] uppercase">
                                        Our Mission
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-light text-gray-900 leading-relaxed">
                                    เป้าหมายของควอนจิเทค
                                </h2>
                            </header>
                            <div className="prose prose-lg max-w-none mb-10">
                                <p className="text-gray-600 leading-[1.8] font-light text-base md:text-lg">
                                    บริษัท ควอนจิเทค จำกัด พร้อมที่จะก้าวขึ้นสู่ความเป็นผู้นำทางธุรกิจอย่างเต็มรูปแบบด้วยนโยบาย
                                    และปรัชญาในการทำงานยึดหลัก "มุ่งมั่นพัฒนาระบบสารสนเทศ ด้วยเทคโนโลยี
                                    ที่ทันสมัย เพื่อให้เกิดความแตกต่างและเป็นประโยชน์แก่ลูกค้า"
                                    เราภูมิใจอย่างยิ่งที่ได้มีโอกาสใช้ความรู้ความสามารถให้บริการแก่ลูกค้าทุกท่าน
                                </p>
                            </div>
                            <figure className="mt-12">
                                <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                                    <img
                                        src="/img/cont2.png"
                                        alt="ภาพแสดงเป้าหมายของควอนจิเทค"
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            </figure>
                        </div>
                    </article>
                </div>
            </section>
            <Footer />
        </div>
    );
}