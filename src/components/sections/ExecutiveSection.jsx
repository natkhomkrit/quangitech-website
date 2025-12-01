"use client";

import React from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

export default function ExecutiveSection({ content }) {
    const { subtitle, image, name, position, company, quote, imageWidth, imageHeight } = content || {};

    return (
        <article className="group" data-aos="fade-up">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-700 overflow-hidden">
                <header className="mb-10">
                    <div className="inline-flex items-center space-x-3 mb-4">
                        <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                        <span className="text-xs font-medium text-gray-400 tracking-[0.2em] uppercase">
                            {subtitle || "Leadership"}
                        </span>
                    </div>
                </header>

                {name ? (
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
                        <div className="flex-shrink-0 mx-auto lg:mx-0">
                            <div
                                className="relative"
                                style={{
                                    width: imageWidth || "320px",
                                    height: imageHeight || "320px"
                                }}
                            >
                                <div className="relative w-full h-full overflow-hidden rounded-3xl bg-white shadow-lg">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 space-y-2 border-2 border-dashed border-gray-200">
                                            <ImageIcon className="w-12 h-12 opacity-50" />
                                            <span className="text-sm font-medium">No Image</span>
                                            <span className="text-xs opacity-75">Recommended: {imageWidth || "400px"} x {imageHeight || "400px"}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 text-center lg:text-left space-y-6">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-light text-gray-900 mb-3 leading-tight">
                                    {name}
                                </h2>

                                <div className="space-y-2 mb-6">
                                    <p className="text-lg font-medium text-gray-800">
                                        {position}
                                    </p>
                                    <p className="text-base text-gray-600 font-light">
                                        {company}
                                    </p>
                                </div>
                            </div>
                            {quote && (
                                <blockquote className="relative">
                                    <div>
                                        <div
                                            className="text-lg font-light italic text-gray-700 leading-relaxed mb-4"
                                            dangerouslySetInnerHTML={{ __html: quote }}
                                        />
                                    </div>
                                </blockquote>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-none">
                        {quote && (
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: quote }}
                            />
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}
