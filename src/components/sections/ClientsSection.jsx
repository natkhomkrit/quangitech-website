"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { TitleWithHighlight } from "@/components/ui/TitleWithHighlight";

import { ImageIcon } from "lucide-react";

export default function ClientsSection({ content }) {
    const { title, images, imageWidth, imageHeight, imageMaxWidth } = content || {};
    const clients = (images || []).filter(img => img && typeof img === 'string' && img.trim() !== "");
    const shouldSlide = clients.length > 5;

    return (
        <section className="bg-white py-16 pt-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6" data-aos="fade-up">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-bold text-gray-400 tracking-[0.2em] uppercase" data-aos="fade-up" data-aos-delay="100">
                        {title}
                    </h2>
                </div>

                {clients.length > 0 ? (
                    shouldSlide ? (
                        <div className="relative" data-aos="fade-up" data-aos-delay="200">
                            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                            <Swiper
                                modules={[Autoplay, Navigation, Pagination]}
                                spaceBetween={30}
                                slidesPerView="auto"
                                loop={true}
                                autoplay={{
                                    delay: 0,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                speed={3000}
                                grabCursor={true}
                                breakpoints={{
                                    320: { slidesPerView: 3, spaceBetween: 30 },
                                    640: { slidesPerView: 4, spaceBetween: 40 },
                                    768: { slidesPerView: 5, spaceBetween: 50 },
                                    1024: { slidesPerView: 6, spaceBetween: 60 },
                                    1280: { slidesPerView: 7, spaceBetween: 70 },
                                }}
                                className="clients-swiper"
                            >
                                {clients.map((logo, idx) => (
                                    <SwiperSlide key={idx} className="!w-auto">
                                        <div
                                            className="flex-shrink-0 flex items-center justify-center group cursor-pointer relative"
                                            style={{
                                                width: imageWidth || "120px",
                                                height: imageHeight || "60px"
                                            }}
                                        >
                                            <img
                                                src={logo}
                                                alt={`client ${idx + 1}`}
                                                className="max-w-full max-h-full object-contain opacity-50 group-hover:opacity-100 transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                                                style={{ maxWidth: imageMaxWidth || "100%" }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="hidden absolute inset-0 flex items-center justify-center text-gray-300">
                                                <ImageIcon size={24} />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12" data-aos="fade-up" data-aos-delay="200">
                            {clients.map((logo, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-center group cursor-pointer relative"
                                    style={{
                                        width: imageWidth || "120px",
                                        height: imageHeight || "60px"
                                    }}
                                >
                                    <img
                                        src={logo}
                                        alt={`client ${idx + 1}`}
                                        className="max-w-full max-h-full object-contain opacity-50 group-hover:opacity-100 transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                                        style={{ maxWidth: imageMaxWidth || "100%" }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div className="hidden absolute inset-0 flex items-center justify-center text-gray-300">
                                        <ImageIcon size={24} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="text-center text-gray-400 py-8">No clients to display</div>
                )}
            </div>
        </section>
    );
}
