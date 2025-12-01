"use client";

import React, { useState } from "react";
import { Mail, Phone } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ContactSection({ content }) {
    const {
        logo,
        companyName,
        address,
        phone,
        email,
        mapUrl,
        formTitle,
        formDescription
    } = content || {};

    const [name, setName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formPhone, setFormPhone] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    function sanitizeInput(value) {
        return value
            .replace(/script.*?>.*?<\/script>/gi, "")
            .replace(/[<>"/']/g, "")
            .replace(/\//g, "")
            .trim();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setError("");
        setSuccess(false);

        if (name.length > 10) {
            setError("Name cannot exceed 10 characters.");
            setSending(false);
            return;
        }
        if (formPhone.length > 10) {
            setError("Phone number cannot exceed 10 characters.");
            setSending(false);
            return;
        }

        const cleanName = sanitizeInput(name);
        const cleanEmail = sanitizeInput(formEmail);
        const cleanPhone = sanitizeInput(formPhone);
        const cleanMessage = sanitizeInput(message);

        if (!cleanName || !cleanMessage) {
            setError("Invalid input detected.");
            setSending(false);
            return;
        }

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
            setFormEmail("");
            setFormPhone("");
            setMessage("");

        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to send message");
        } finally {
            setSending(false);
        }
    };

    return (
        <section className="py-14 md:py-20 bg-gray-50" data-aos="fade-up">
            <div className="max-w-7xl mx-auto px-6">

                {/* Map */}
                <div
                    className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg mb-16"
                >
                    {mapUrl && (
                        <iframe
                            src={mapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

                    {/* LEFT INFO */}
                    <div className="max-w-lg text-left">
                        {logo && (
                            <img
                                src={logo}
                                alt="Company Logo"
                                style={{ width: content.logoWidth || "144px" }}
                                className="h-auto mb-4 object-contain"
                                onError={(e) => { e.target.src = "/img/default.png"; }}
                            />
                        )}

                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            {companyName}
                        </h3>

                        <address className="not-italic text-gray-600 mb-4 whitespace-pre-line">
                            {address}
                        </address>

                        <div className="space-y-3 text-gray-700">
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-[#1a5c48]" />
                                <a href={`tel:${phone}`} className="text-gray-800 hover:underline">
                                    {phone}
                                </a>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[#1a5c48]" />
                                <a href={`mailto:${email}`} className="text-gray-800 hover:underline">
                                    {email}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT FORM */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-light text-gray-900 leading-relaxed mb-4">
                            {formTitle}
                        </h2>

                        <p className="text-gray-600 leading-[1.8] font-light text-base mb-8">
                            {formDescription}
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
                                    value={formEmail}
                                    onChange={(e) => setFormEmail(e.target.value)}
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
                                value={formPhone}
                                onChange={(e) => setFormPhone(e.target.value.replace(/[^0-9]/g, ""))}
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
    );
}
