"use client";

import React from "react";

export default function CompanySection({ content }) {
    const { subtitle, title, content: bodyContent, image } = content || {};

    return (
        <section className="py-10 md:py-14">
            <div className="max-w-5xl mx-auto px-6">
                <article className="group" data-aos="fade-up">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-700">
                        <header className="mb-10">
                            <div className="inline-flex items-center space-x-3 mb-4">
                                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                <span className="text-xs font-medium text-gray-400 tracking-[0.1em] uppercase">
                                    {subtitle}
                                </span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-light text-gray-900 leading-relaxed">
                                {title}
                            </h2>
                        </header>

                        <div
                            className="prose prose-lg max-w-none leading-[1.8] font-light"
                            dangerouslySetInnerHTML={{ __html: bodyContent }}
                        />


                    </div>
                </article>
            </div>
        </section>
    );
}
