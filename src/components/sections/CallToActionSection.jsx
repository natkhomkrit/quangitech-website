"use client";

import React from "react";
import ActionButton from "@/components/ui/ActionButton";
import { TitleWithHighlight } from "@/components/ui/TitleWithHighlight";

export default function CallToActionSection({ content }) {
    const { title, description, buttonText, buttonLink } = content || {};

    return (
        <section className="relative py-16 md:py-24 bg-white overflow-hidden">
            <div className="relative z-10 max-w-[1400px] mx-auto text-center px-4" data-aos="fade-up">
                <h2 className="text-2xl md:text-4xl font-normal text-gray-800 tracking-[0.1em] mb-6" data-aos="fade-up" data-aos-delay="100">
                    <TitleWithHighlight title={title} />
                </h2>
                <div className="w-24 h-1 bg-gray-400 mx-auto rounded-full mb-8" data-aos="fade-up" data-aos-delay="200"></div>

                <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10 font-light" data-aos="fade-up" data-aos-delay="300">
                    {Array.isArray(description) ? (
                        description.map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                {index < description.length - 1 && <br />}
                            </React.Fragment>
                        ))
                    ) : (
                        description
                    )}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6" data-aos="fade-up" data-aos-delay="400">
                    <ActionButton href={buttonLink || "#"}>
                        {buttonText || "Get Started"}
                    </ActionButton>
                </div>
            </div>
        </section>
    );
}
