"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { TitleWithHighlight } from "@/components/ui/TitleWithHighlight";
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

export default function HeroSectionModern({ content, themeColor }) {
    const { title, subtitle, description, buttonText, buttonLink } = content || {};

    // Technologies data
    const technologies = [
        { icon: SiReact, name: "React", color: "#61DAFB" },
        { icon: SiNextdotjs, name: "Next.js", color: "#4a4a4aff" },
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
        { icon: FaAws, name: "AWS", color: "#4a4a4aff" },
        { icon: SiFirebase, name: "Firebase", color: "#FFCA28" },
        { icon: SiGit, name: "Git", color: "#F05032" },
        { icon: SiVercel, name: "Vercel", color: "#4a4a4aff" },
        { icon: SiNginx, name: "Nginx", color: "#009639" },
        { icon: SiPython, name: "Python", color: "#3776AB" },
    ];

    return (
        <section
            className="relative w-full min-h-[105vh] flex flex-col items-center justify-center overflow-hidden text-white pt-35 pb-20"
            style={{ backgroundColor: themeColor || '#000000' }}
        >

            <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center text-center flex-grow justify-center">

                {/* Main Title */}
                <h1
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <span className="block text-transparent font-normal bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
                        {title ? <TitleWithHighlight title={title} /> : ""}
                    </span>
                </h1>

                {/* Description */}
                <p
                    className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed font-light"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    {Array.isArray(description) ? description.join(" ") : description}
                </p>

                {/* CTA Buttons */}
                <div
                    className="flex justify-center gap-4 w-full mb-16"
                    data-aos="fade-up"
                    data-aos-delay="300"
                >
                    <Button
                        asChild
                        className="inline-flex rounded-full px-6 py-2 md:px-12 md:py-6 text-sm md:text-lg bg-white text-black hover:bg-gray-300 transition-all shadow-lg hover:shadow-xl"
                    >
                        <Link href={buttonLink || "/contact"}>
                            {buttonText || "Start Your Project"}
                        </Link>
                    </Button>
                </div>

                {/* Technologies Marquee */}
                <div className="w-full max-w-5xl mx-auto border-t border-white/10 pt-8 pb-8" data-aos="fade-up" data-aos-delay="400">
                    <p className="text-xs md:text-sm text-gray-500 uppercase tracking-[0.2em] mb-6 font-medium">
                        Powered by Modern Technologies
                    </p>
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={30}
                        slidesPerView={4}
                        loop={true}
                        speed={3000}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: false,
                        }}
                        breakpoints={{
                            320: { slidesPerView: 4, spaceBetween: 20 },
                            640: { slidesPerView: 5, spaceBetween: 30 },
                            768: { slidesPerView: 6, spaceBetween: 40 },
                            1024: { slidesPerView: 8, spaceBetween: 50 },
                        }}
                        className="w-full opacity-70 hover:opacity-100 transition-opacity duration-500"
                    >
                        {technologies.map((tech, idx) => (
                            <SwiperSlide key={idx} className="!flex items-center justify-center">
                                <div className="group cursor-pointer" title={tech.name}>
                                    <tech.icon
                                        className="text-3xl md:text-4xl transition-all duration-300 group-hover:scale-110"
                                        style={{ color: tech.color }}
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
