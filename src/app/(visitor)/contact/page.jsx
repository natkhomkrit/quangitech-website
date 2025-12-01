"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import AOS from "aos";
import "aos/dist/aos.css";
import ContactSection from "@/components/sections/ContactSection";
import { Loader2 } from "lucide-react";

export default function Contact() {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [homeTitle, setHomeTitle] = useState("");
    const [pageTitle, setPageTitle] = useState("");

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
        fetchPage();
        fetchMenuName();
    }, []);

    const fetchPage = async () => {
        try {
            const res = await fetch("/api/pages/contact");
            if (res.ok) {
                const data = await res.json();
                setPage(data);
            }
        } catch (error) {
            console.error("Error fetching page:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenuName = async () => {
        try {
            const res = await fetch("/api/menus?name=Navigation Bar");
            if (!res.ok) return;
            const data = await res.json();

            if (data && data.length > 0) {
                const menuItems = data[0].items || [];

                const findItem = (items, url) => {
                    for (const item of items) {
                        if (item.url === url || item.href === url || item.link === url || item.path === url) {
                            return item;
                        }
                        if (item.children && item.children.length > 0) {
                            const found = findItem(item.children, url);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const homeItem = findItem(menuItems, "/");
                if (homeItem) {
                    setHomeTitle(homeItem.title || homeItem.name || "");
                }

                const contactItem = findItem(menuItems, "/contact");
                if (contactItem) {
                    setPageTitle(contactItem.title || contactItem.name || "");
                }
            }
        } catch (err) {
            console.error("Error fetching menu name:", err);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <Loader2 className="animate-spin text-gray-500" size={48} />
        </div>
    );

    return (
        <div className="bg-gray-50">

            {/* Hero Section */}
            <div className="max-w-[1200px] mx-auto px-6 md:px-6 pt-26 md:pt-36 md:pb-4 relative border-b border-gray-300">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-1 h-8 bg-gray-800 rounded-full"></div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-[0.1em] uppercase">
                        {pageTitle}
                    </h1>
                </div>
                <nav className="text-sm font-light text-gray-600 mb-4 flex items-center gap-2">
                    <Link href="/" className="hover:text-gray-900">{homeTitle || "Home"}</Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-800">{pageTitle || page?.title || "Contact"}</span>
                </nav>
            </div>

            {/* Dynamic Sections */}
            {page?.sections?.map((section) => {
                if (section.type === "contact") {
                    return <ContactSection key={section.id} content={section.content} />;
                }
                return null;
            })}

            {/* Fallback if no sections */}
            {(!page?.sections || page.sections.length === 0) && (
                <div className="py-20 text-center text-gray-500">
                    No content available. Please add a contact section in the backoffice.
                </div>
            )}

            <Footer />
        </div>
    );
}
