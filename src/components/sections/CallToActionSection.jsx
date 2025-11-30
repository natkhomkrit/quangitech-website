"use client";

import React, { useState, useEffect } from "react";
import ActionButton from "@/components/ui/ActionButton";
import { TitleWithHighlight } from "@/components/ui/TitleWithHighlight";

export default function CallToActionSection({ content }) {
    const { title, description, buttonText, buttonLink } = content || {};
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
            <div className="relative z-10 max-w-[1400px] mx-auto text-center px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-[0.1em] mb-6">
                    <TitleWithHighlight title={title} />
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-500 mx-auto rounded-full mb-8"></div>

                <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10 font-light">
                    {Array.isArray(description) ? (
                        description.map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                {index < description.length - 1 && <br className="hidden md:block" />}
                            </React.Fragment>
                        ))
                    ) : (
                        description
                    )}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                    <ActionButton
                        href={buttonLink}
                        className="bg-gray-900 text-white hover:bg-black font-medium rounded-full px-4 py-2 md:px-8 md:py-4 text-lg shadow-lg shadow-gray-400/20 hover:shadow-xl transition-all transform hover:-translate-y-1"
                        style={{ backgroundColor: themeColor || "#111827" }}
                    >
                        {buttonText}
                    </ActionButton>
                </div>
            </div>
        </section>
    );
}
