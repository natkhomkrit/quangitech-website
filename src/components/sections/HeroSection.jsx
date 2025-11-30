"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { TitleWithHighlight } from "@/components/ui/TitleWithHighlight";

export default function HeroSection({ content, themeColor }) {
    const { title, subtitle, description, buttonText, buttonLink } = content || {};

    const hasQuangitech = title && /quangitech/i.test(title);

    return (
        <section
            className="relative w-full min-h-[440px] md:min-h-[540px] flex items-center overflow-hidden bg-gray-900 py-16 md:py-24 pb-2 md:pb-2"
            style={{ backgroundColor: themeColor || "#111827" }}
        >
            <div
                className="absolute inset-0 bg-gray-900"
                style={{ backgroundColor: themeColor || "#111827" }}
            ></div>
            <div className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 text-center">
                <div
                    className="flex-1 w-full space-y-8 text-center"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-[64px] font-extrabold text-white tracking-normal leading-[1.2] md:leading-[1.1] break-words">
                        {hasQuangitech ? (
                            <TitleWithHighlight title={title} />
                        ) : title ? (
                            <>
                                {title.split(" ").slice(0, -1).join(" ")}{" "}
                                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent block inline">
                                    {title.split(" ").slice(-1)}
                                </span>
                            </>
                        ) : (
                            "Digital Solutions"
                        )}
                    </h1>

                    {/* Subtitle */}
                    <h2 className="text-white font-light text-lg sm:text-2xl md:text-3xl lg:text-4xl mt-2 block">
                        {subtitle || ""}
                    </h2>

                    {/* Description */}
                    <div className="max-w-3xl mx-auto space-y-6 w-full">
                        <p className="text-sm sm:text-base md:text-lg text-white leading-relaxed font-light px-2 md:px-0">
                            {Array.isArray(description) ? (
                                description.map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        {index < description.length - 1 && <br className="hidden md:block" />}
                                    </React.Fragment>
                                ))
                            ) : (
                                description || ""
                            )}
                        </p>

                        <div className="flex justify-center md:pt-8">
                            <Button
                                asChild
                                className="bg-white text-black hover:bg-white font-medium rounded-full px-6 py-2 md:px-16 md:py-8 text-base md:text-lg shadow-gray-400/50 hover:shadow-md transition-all transform hover:-translate-y-1 flex items-center gap-2"
                            >
                                <Link href={buttonLink || ""}>
                                    {buttonText || ""}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
