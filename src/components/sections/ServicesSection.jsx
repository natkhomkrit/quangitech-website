"use client";

import React, { useEffect, useState } from "react";
import ActionButton from "@/components/ui/ActionButton";

import { TitleWithHighlight } from "@/components/ui/TitleWithHighlight";

export default function ServicesSection({ content }) {
    const { title, description, subtitle, subTitle } = content || {};
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/posts?category=Service&status=published&isFeatured=true");
                if (!res.ok) throw new Error("Failed to fetch services");
                const data = await res.json();
                setServices(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <section className="bg-[#f9fafb] py-20">
            <div className="max-w-[1140px] mx-auto text-center px-6">
                <span className="text-sm font-semibold text-gray-400 tracking-[0.25em] uppercase block mb-2">
                    {subtitle || subTitle || ""}
                </span>
                <h1
                    className="text-3xl md:text-5xl font-bold text-gray-800 tracking-[0.1em] mb-4"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    <TitleWithHighlight title={title} />
                </h1>
                <span className="my-2 w-30 h-1 bg-orange-400 rounded-full"></span>
                <p
                    className="text-[#555] max-w-2xl mx-auto mb-12 leading-relaxed"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                    data-aos-delay="200"
                >
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loading && (
                        <div className="col-span-full text-center py-10 text-gray-500 text-sm">
                            กำลังโหลดข้อมูล...
                        </div>
                    )}
                    {error && (
                        <div className="col-span-full text-center py-10 text-red-600 text-sm">
                            เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}
                        </div>
                    )}
                    {!loading && !error && services.map((service, i) => (
                        <div
                            key={i}
                            className="group relative bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 
               hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-gray-200/60
               before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-transparent before:to-orange-50/20 
               before:opacity-0 before:transition-all before:duration-500 hover:before:opacity-100"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            data-aos-delay={i * 150}
                        >
                            <h4
                                className="text-gray-800 text-xl font-semibold mb-4 group-hover:text-black
                   transition-colors duration-300 leading-tight"
                            >
                                {service.title}
                            </h4>

                            <p
                                className="text-gray-600 text-sm md:text-base font-normal leading-relaxed mb-8 
                  group-hover:text-gray-700 transition-colors duration-300"
                            >
                                {service.excerpt}
                            </p>
                            <ActionButton
                                href={`/services/${service.slug}`}
                                className="relative inline-block \
      bg-gray-900 text-white hover:bg-black \
      font-medium text-sm \
      rounded-full px-6 py-2 \
      shadow-lg shadow-gray-400/50 hover:shadow-xl \
      transition-all duration-300 transform hover:-translate-y-1 \
      overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Learn more
                                </span>
                            </ActionButton>
                            <div
                                className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-orange-100/40 to-transparent 
                    rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                            ></div>
                            <div
                                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-orange-50/60 to-transparent 
                    rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"
                            ></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
