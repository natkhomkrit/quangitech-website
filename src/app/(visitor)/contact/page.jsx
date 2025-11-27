"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import { Mail, Phone } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Contact() {

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [homeTitle, setHomeTitle] = useState("");
    const [pageTitle, setPageTitle] = useState("");

    // ✔ sanitizeInput เวอร์ชันเดียว
    function sanitizeInput(value) {
        return value
            .replace(/script.*?>.*?<\/script>/gi, "")
            .replace(/[<>"/']/g, "")
            .replace(/\//g, "")
            .trim();
    }

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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setError("");
        setSuccess(false);

        // ✔ validation ความยาว name/phone
        if (name.length > 10) {
            setError("Name cannot exceed 10 characters.");
            setSending(false);
            return;
        }
        if (phone.length > 10) {
            setError("Phone number cannot exceed 10 characters.");
            setSending(false);
            return;
        }

        // ✔ sanitize ข้อมูล
        const cleanName = sanitizeInput(name);
        const cleanEmail = sanitizeInput(email);
        const cleanPhone = sanitizeInput(phone);
        const cleanMessage = sanitizeInput(message);

        // ✔ ตรวจสอบหลัง sanitize
        if (!cleanName || !cleanMessage) {
            setError("Invalid input detected.");
            setSending(false);
            return;
        }

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // ✔ ส่งข้อมูล clean เท่านั้น
                body: JSON.stringify({
                    name: cleanName,
                    email: cleanEmail,
                    phone: cleanPhone,
                    message: cleanMessage,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data?.error || "Failed to send message");

            setSuccess(true);
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");

        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to send message");
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        fetchMenuName();
    }, []);

    return (
        <div className="bg-gray-50">

            {/* Hero Section */}
            <div className="relative w-full h-[80px] bg-white shadow-md"></div>
            <div className="max-w-[1200px] mx-auto px-2 pt-12 md:pt-12 md:pb-4 relative border-b border-gray-300">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-[0.1em] uppercase">
                        Contact Us
                    </h1>
                </div>
                <nav className="text-sm font-light text-gray-600 mb-4 flex items-center gap-2">
                    <Link href="/" className="hover:text-gray-900">{homeTitle}</Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-800">{pageTitle}</span>
                </nav>
            </div>

            {/* Contact Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Map */}
                    <div
                        className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg mb-16"
                        data-aos="fade-down"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.4229951814614!2d100.61326217455682!3d13.632014100056663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2a1bd6535f4d9%3A0xeb748e81ae4eb918!2z4Lia4Lij4Li04Lip4Lix4LiXIOC4hOC4p-C4reC4meC4iOC4tOC5gOC4l-C4hCDguIjguLPguIHguLHguJQ!5e0!3m2!1sth!2sth!4v1756442145141!5m2!1sth!2sth"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

                        {/* LEFT INFO */}
                        <div className="max-w-lg text-left" data-aos="fade-right">
                            <img
                                src="/img/logocontact.png"
                                alt="Quangitech Logo"
                                className="w-36 h-auto mb-4 object-contain"
                                onError={(e) => { e.target.src = "/img/default.png"; }}
                            />

                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                บริษัท ควอนจิเทค จำกัด
                            </h3>

                            <address className="not-italic text-gray-600 mb-4 whitespace-pre-line">
                                234/145 Thepharak Rd. Mueang District, Samut Prakan
                            </address>

                            <div className="space-y-3 text-gray-700">
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-[#1a5c48]" />
                                    <a href="tel:0812345678" className="text-gray-800 hover:underline">
                                        081-234-5678
                                    </a>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-[#1a5c48]" />
                                    <a href="mailto:quangitech@gmail.com" className="text-gray-800 hover:underline">
                                        quangitech@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT FORM */}
                        <div data-aos="fade-left">
                            <h2 className="text-2xl md:text-3xl font-light text-gray-900 leading-relaxed mb-4">
                                Let’s Get in Touch
                            </h2>

                            <p className="text-gray-600 leading-[1.8] font-light text-base mb-8">
                                Have questions or want to work with us? Fill out the form and our team
                                will get back to you as soon as possible.
                            </p>

                            <form
                                className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
                                onSubmit={handleSubmit}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5c48]"
                                        value={name}
                                        maxLength={10}
                                        onChange={(e) => setName(sanitizeInput(e.target.value))}
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5c48]"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <input
                                    type="tel"
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    maxLength={10}
                                    placeholder="Your Phone"
                                    className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5c48]"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                                />

                                <textarea
                                    placeholder="Your Message"
                                    className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5c48]"
                                    rows="5"
                                    value={message}
                                    onChange={(e) => setMessage(sanitizeInput(e.target.value))}
                                    required
                                ></textarea>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-60"
                                    >
                                        {sending ? "Sending..." : "Send Message"}
                                    </button>
                                </div>
                            </form>

                            {/* SUCCESS ALERT */}
                            <AlertDialog open={success} onOpenChange={setSuccess}>
                                <AlertDialogContent>
                                    <AlertDialogTitle className="text-green-600">✓ Success</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Message sent successfully. We'll get back to you soon!
                                    </AlertDialogDescription>
                                    <AlertDialogAction onClick={() => setSuccess(false)}>
                                        Close
                                    </AlertDialogAction>
                                </AlertDialogContent>
                            </AlertDialog>

                            {/* ERROR ALERT */}
                            <AlertDialog open={!!error} onOpenChange={() => setError("")}>
                                <AlertDialogContent>
                                    <AlertDialogTitle className="text-red-600">✗ Error</AlertDialogTitle>
                                    <AlertDialogDescription>{error}</AlertDialogDescription>
                                    <AlertDialogAction onClick={() => setError("")}>
                                        Close
                                    </AlertDialogAction>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
