"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { TitleWithHighlight } from "@/components/ui/TitleWithHighlight";
import { cn } from "@/lib/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ServicesSectionInteractive({ content }) {
    const { title, description, subtitle } = content || {};
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                // Fetch from new /api/services endpoint
                const res = await fetch("/api/services");
                if (!res.ok) throw new Error("Failed to fetch services");
                const data = await res.json();

                // Ensure we have exactly 6 or limit to 6 if needed, or just take what we have
                // Also, the new Service model might not have 'excerpt', so we might need to generate it from content or leave it blank.
                // Or we can add excerpt field to Service model later if needed. For now, let's use content substring or empty.

                const processedData = data.map(service => ({
                    ...service,
                    excerpt: service.content ? service.content.replace(/<[^>]+>/g, '').substring(0, 100) + "..." : ""
                }));

                setServices(processedData.slice(0, 6));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-white flex justify-center">
                <Loader2 className="animate-spin text-gray-400" />
            </section>
        );
    }

    if (services.length === 0) return null;

    const activeService = services[activeIndex];

    return (
        <section className="py-12 md:py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">

                {/* Mobile Header */}
                <div className="md:hidden mb-8 text-center" data-aos="fade-up">
                    <h2 className="text-3xl font-normal text-gray-900 mb-4 flex items-center justify-center gap-2">
                        <span className="text-gray-400 text-3xl">•</span>
                        {title || "Our Services"}
                    </h2>
                    <p className="text-gray-600 text-base font-normal">
                        {description || "We provide comprehensive digital solutions tailored to your business needs."}
                    </p>
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Dynamic Image Display (Clean, no frame) */}
                    <div className="relative h-[400px] md:h-[600px] w-full order-2 lg:order-1 flex items-center justify-center" data-aos="fade-right">
                        {services.map((service, index) => (
                            <div
                                key={service.id}
                                className={cn(
                                    "absolute inset-0 transition-opacity duration-500 ease-in-out flex items-center justify-center",
                                    activeIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
                                )}
                            >
                                <img
                                    src={service.image || service.img || "/placeholder-service.jpg"}
                                    alt={service.title}
                                    className="w-full h-full object-contain drop-shadow-xl"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Service List */}
                    <div className="order-1 lg:order-2 pl-0 lg:pl-10" data-aos="fade-left">
                        <div className="mb-12">
                            <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-6 flex items-center gap-3">
                                <span className="text-gray-400 text-4xl">•</span>
                                {title || "Our Services"}
                            </h2>
                            <p className="text-gray-600 text-lg font-normal">
                                {description || "We provide comprehensive digital solutions tailored to your business needs."}
                            </p>
                        </div>

                        <div className="space-y-2">
                            {services.map((service, index) => (
                                <Link
                                    key={service.id}
                                    href={`/services/${service.slug}`}
                                    className={cn(
                                        "block group border-b border-gray-300 py-6 cursor-pointer transition-all duration-300",
                                        activeIndex === index ? "border-gray-300" : "hover:border-gray-400"
                                    )}
                                    onMouseEnter={() => setActiveIndex(index)}
                                >
                                    <div className="flex items-start gap-6">
                                        <span className={cn(
                                            "text-xl font-medium mt-1 transition-colors duration-300",
                                            activeIndex === index ? "text-gray-400" : "text-gray-300"
                                        )}>
                                            {String(index + 1).padStart(2, '0')}.
                                        </span>
                                        <div className={cn(
                                            "flex-1 transition-transform duration-300 ease-out",
                                            activeIndex === index ? "translate-x-4" : "translate-x-0"
                                        )}>
                                            <h3 className={cn(
                                                "text-2xl font-normal mb-2 transition-colors duration-300",
                                                activeIndex === index ? "text-black" : "text-black"
                                            )}>
                                                {service.title}
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-gray-500 text-lg leading-relaxed font-normal">
                                                    {service.excerpt}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Slider View */}
                <div className="md:hidden relative" data-aos="fade-up" data-aos-delay="200">
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={20}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            prevEl: '.services-prev',
                            nextEl: '.services-next',
                        }}
                        className="pb-12"
                    >
                        {services.map((service) => (
                            <SwiperSlide key={service.id}>
                                <Link href={`/services/${service.slug}`} className="flex flex-col items-center text-center block">
                                    <div className="w-full h-[250px] flex items-center justify-center mb-6">
                                        <img
                                            src={service.image || service.img || "/placeholder-service.jpg"}
                                            alt={service.title}
                                            className="h-full w-auto object-contain drop-shadow-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <h3 className="text-2xl font-medium text-gray-900 mb-3">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 text-base leading-relaxed px-4">
                                        {service.excerpt}
                                    </p>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-0 mb-8">
                        <button className="services-prev w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors z-10">
                            <ChevronLeft size={24} />
                        </button>
                        <button className="services-next w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors z-10">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
