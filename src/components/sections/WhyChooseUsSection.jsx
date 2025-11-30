"use client";

import React from "react";
import * as FaIcons from "react-icons/fa";
import { useCounter } from "@/hooks/useCounter";
import { ImageIcon } from "lucide-react";

export default function WhyChooseUsSection({ content }) {
    const {
        title,
        description,
        features,
        image,
        stats,
        projectCount: flatProjectCount,
        experienceCount: flatExperienceCount,
        satisfactionCount: flatSatisfactionCount,
        imageMaxWidth,
        imageWidth,
        imageHeight,
        subtitle,
        subTitle
    } = content || {};

    const initialProjectCount = stats?.projectCount || flatProjectCount || 50;
    const initialExperienceCount = stats?.experienceCount || flatExperienceCount || 5;
    const initialSatisfactionCount = stats?.satisfactionCount || flatSatisfactionCount || 98;

    const { count: projectCount, ref: projectRef } = useCounter(Number(initialProjectCount), 2000);
    const { count: experienceCount, ref: experienceRef } = useCounter(Number(initialExperienceCount), 2000);
    const { count: satisfactionCount, ref: satisfactionRef } = useCounter(Number(initialSatisfactionCount), 2000);

    const getIcon = (iconName) => {
        return FaIcons[iconName] || FaIcons.FaCheck;
    };

    return (
        <section className="bg-gradient-to-br from-gray-50 to-white py-10">
            <div className="max-w-[1140px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div data-aos="fade-right" className="space-y-8">
                    <div>
                        <div className="inline-flex items-center space-x-3 mb-4">
                            <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-400 tracking-[0.2em]">
                                {subtitle || subTitle || " "}
                            </span>
                        </div>
                        <h2 className="text-2xl font-medium text-gray-800 tracking-[0.2em] mb-4">
                            {title}
                        </h2>
                        <p className="text-sm md:text-base text-gray-600 leading-[1.8] font-light leading-relaxed">
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
                    </div>
                    <div className="space-y-6">
                        {features?.map((feature, index) => {
                            const Icon = getIcon(feature.icon);
                            return (
                                <div
                                    key={index}
                                    className="flex items-start gap-4"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                        <Icon className="text-blue-500 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-base md:text-lg font-medium text-gray-800 leading-snug mb-1">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm md:text-base font-light text-gray-600 leading-relaxed">
                                            {Array.isArray(feature.description) ? (
                                                feature.description.map((line, i) => (
                                                    <React.Fragment key={i}>
                                                        {line}
                                                        {i < feature.description.length - 1 && <br />}
                                                    </React.Fragment>
                                                ))
                                            ) : (
                                                feature.description
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6" data-aos="fade-up">
                        <div className="text-center" ref={projectRef}>
                            <div className="text-4xl font-bold text-gray-800">{projectCount}+</div>
                            <div className="text-sm text-gray-600">โปรเจกต์สำเร็จ</div>
                        </div>
                        <div className="text-center" ref={experienceRef}>
                            <div className="text-4xl font-bold text-gray-800">{experienceCount}+</div>
                            <div className="text-sm text-gray-600">ปีประสบการณ์</div>
                        </div>
                        <div className="text-center" ref={satisfactionRef}>
                            <div className="text-4xl font-bold text-gray-800">{satisfactionCount}%</div>
                            <div className="text-sm text-gray-600">ความพึงพอใจ</div>
                        </div>
                    </div>
                </div>
                <div data-aos="fade-left" className="relative">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-gray-100 flex items-center justify-center bg-gray-50 min-h-[450px] w-full md:w-[600px]">
                        {image ? (
                            <img
                                src={image}
                                alt="Why Choose Us"
                                className="object-contain transition-transform duration-300 hover:scale-105"
                                style={{
                                    width: imageWidth || "120px",
                                    height: imageHeight || "60px",
                                    maxWidth: "100%"
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400 p-10">
                                <ImageIcon size={48} className="mb-4 opacity-50" />
                                <span className="text-sm font-medium">No Image Available</span>
                                <span className="text-xs mt-2 opacity-70">Recommended Size: 600 x 450 px</span>
                            </div>
                        )}
                        {/* Fallback for broken image link */}
                        <div className="hidden flex-col items-center justify-center text-gray-400 p-10 absolute inset-0 bg-gray-50">
                            <ImageIcon size={48} className="mb-4 opacity-50" />
                            <span className="text-sm font-medium">Image Not Found</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
