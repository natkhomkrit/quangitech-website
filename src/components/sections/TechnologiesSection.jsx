"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import {
    FaAws,
} from "react-icons/fa";
import {
    SiReact,
    SiNextdotjs,
    SiTailwindcss,
    SiNodedotjs,
    SiPhp,
    SiLaravel,
    SiMysql,
    SiPostgresql,
    SiMongodb,
    SiDocker,
    SiGit,
    SiPython,
    SiFirebase,
    SiNginx,
    SiVercel,
    SiTypescript,
    SiJavascript
} from "react-icons/si";

import { TitleWithHighlight } from "@/components/ui/TitleWithHighlight";

export default function TechnologiesSection({ content, themeColor }) {
    const { title } = content || {};

    // Technologies data
    const technologies = [
        { icon: SiReact, name: "React", color: "#61DAFB" },
        { icon: SiNextdotjs, name: "Next.js", color: "#000000" },
        { icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4" },
        { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
        { icon: SiJavascript, name: "JavaScript", color: "#F7DF1E" },
        { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
        { icon: SiPhp, name: "PHP", color: "#777BB4" },
        { icon: SiLaravel, name: "Laravel", color: "#FF2D20" },
        { icon: SiMysql, name: "MySQL", color: "#4479A1" },
        { icon: SiPostgresql, name: "PostgreSQL", color: "#4169E1" },
        { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
        { icon: SiDocker, name: "Docker", color: "#2496ED" },
        { icon: FaAws, name: "AWS", color: "#232F3E" },
        { icon: SiFirebase, name: "Firebase", color: "#FFCA28" },
        { icon: SiGit, name: "Git", color: "#F05032" },
        { icon: SiVercel, name: "Vercel", color: "#000000" },
        { icon: SiNginx, name: "Nginx", color: "#009639" },
        { icon: SiPython, name: "Python", color: "#3776AB" },
    ];

    return (
        <section
            className="w-full pt-2 md:pt-2 pb-18 md:pb-24 bg-gray-900"
            style={{ backgroundColor: themeColor || "#111827" }}
        >
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 text-center">
                <div className="w-full max-w-[100vw] overflow-hidden" data-aos="fade-up" data-aos-delay="200">
                    <p className="text-xs sm:text-sm md:text-base text-white mb-8 tracking-[0.15em] font-medium">
                        <TitleWithHighlight title={title} defaultTitle="Powered by Modern Technologies" />
                    </p>

                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={20}
                        slidesPerView={3}
                        loop={true}
                        speed={2000}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: false,
                        }}
                        breakpoints={{
                            320: { slidesPerView: 4, spaceBetween: 15 },
                            480: { slidesPerView: 5, spaceBetween: 20 },
                            640: { slidesPerView: 6, spaceBetween: 30 },
                            768: { slidesPerView: 7, spaceBetween: 40 },
                            1024: { slidesPerView: 8, spaceBetween: 40 },
                        }}
                        className="w-full max-w-6xl mx-auto px-2 md:px-6 py-4"
                    >
                        {technologies.map((tech, idx) => (
                            <SwiperSlide key={idx} className="!flex items-center justify-center">
                                <div className="flex flex-col items-center justify-center gap-2 group cursor-pointer p-2">
                                    <tech.icon
                                        className="text-3xl sm:text-4xl md:text-5xl transition-all duration-500 transform group-hover:scale-110"
                                        style={{ color: tech.color }}
                                        title={tech.name}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
