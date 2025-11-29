"use client";

import React, { useState, useEffect } from "react";
import ActionButton from "./ActionButton";

export default function CallToAction({ title, description, buttonText, buttonLink }) {
    const [themeColor, setThemeColor] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                const data = await res.json();
                if (data && data.themeColor) {
                    setThemeColor(data.themeColor);
                }
            } catch (err) {
                console.error("Failed to fetch settings", err);
            }
        };
        fetchSettings();
    }, []);

    return (
        <section className="relative py-24 pb-8 bg-white overflow-hidden">
            <div className="max-w-[1400px] mx-auto text-center px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-[0.1em] uppercase mb-6">
                    {title || "Ready to get startde with us?"}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-500 mx-auto rounded-full mb-8"></div>

                <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10 font-light">
                    {description || <>เรามีบริการครบวงจรด้านซอฟต์แวร์ เทคโนโลยีสารสนเทศ และดิจิทัล <br className="hidden md:block" />
                        ไม่ว่าจะเป็นการพัฒนาเว็บไซต์ แอปพลิเคชัน การจัดการฐานข้อมูล และการอบรมคอมพิวเตอร์</>}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                    <ActionButton
                        href={buttonLink || "/contact"}
                        className="bg-gray-900 text-white hover:bg-black font-medium rounded-full px-4 py-2 md:px-8 md:py-4 text-lg shadow-lg shadow-gray-400/20 hover:shadow-xl transition-all transform hover:-translate-y-1"
                        style={{ backgroundColor: themeColor || "#111827" }}
                    >
                        {buttonText || "เริ่มโครงการกับเรา"}
                    </ActionButton>
                </div>
            </div>
        </section>
    );
}
