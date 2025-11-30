"use client";

import React from "react";
import * as FaIcons from "react-icons/fa";
import { ImageIcon } from "lucide-react";
import { TitleWithHighlight } from "@/components/ui/TitleWithHighlight";

export default function AboutSection({ content }) {
    const { title, description, features, image, imageMaxWidth, imageWidth, imageHeight } = content || {};

    const getIcon = (iconName) => {
        return FaIcons[iconName] || FaIcons.FaCheck;
    };

    return (
        <section className="max-w-[1140px] mx-auto flex flex-col md:flex-row items-start gap-12 py-12 md:py-16 px-6">
            <div className="flex-1 space-y-6" data-aos="fade-right">
                <div className="inline-flex items-center space-x-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-400 tracking-[0.2em] uppercase">
                        About Our Company
                    </span>
                </div>
                <h2 className="text-2xl font-medium text-gray-800 tracking-[0.2em]">
                    <TitleWithHighlight title={title} />
                </h2>
                <p className="text-sm md:text-base text-gray-600 leading-[1.8] font-light leading-relaxed">
                    {description}
                </p>
                <div className="space-y-6">
                    {features?.map((item, i) => {
                        const Icon = getIcon(item.icon);
                        return (
                            <div
                                key={i}
                                className="flex gap-4 items-start"
                                data-aos="fade-up"
                                data-aos-delay={200 * i}
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Icon className="text-blue-500 text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-base md:text-lg font-medium text-gray-800 leading-snug">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm md:text-base font-light text-gray-600 leading-relaxed">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div data-aos="fade-left" className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-gray-100 flex items-center justify-center bg-gray-50 min-h-[300px]">
                    {image ? (
                        <img
                            src={image}
                            alt="About Us"
                            className="w-full h-auto object-contain mx-auto"
                            style={{
                                maxWidth: imageMaxWidth || "500px",
                                width: imageWidth || "100%",
                                height: imageHeight || "auto"
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 p-10">
                            <ImageIcon size={64} className="mb-4 opacity-50" />
                            <span className="text-sm font-medium">No Image Available</span>
                        </div>
                    )}
                    {/* Fallback for broken image link */}
                    <div className="hidden flex-col items-center justify-center text-gray-400 p-10 absolute inset-0 bg-gray-50">
                        <ImageIcon size={64} className="mb-4 opacity-50" />
                        <span className="text-sm font-medium">Image Not Found</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
