"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import TinyMCEEditor from "@/components/tinymce-editor";
import { ImageUploader } from "@/components/backoffice/ImageUploader";

export default function CreateServicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    image,
                    // Slug generated on server or client? Let's do client for now to be safe or server.
                    // Let's send title and content, server handles slug.
                    slug: title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to create service");
            }

            toast.success("Service created successfully");
            router.push("/backoffice/services");
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <Link href="/backoffice/services" className="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-2">
                    <ArrowLeft size={16} className="mr-1" /> Back to Services
                </Link>
                <h1 className="text-2xl font-bold">Add New Service</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
                <div className="space-y-2">
                    <Label htmlFor="title">Service Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Web Development"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <ImageUploader
                        value={image}
                        onChange={setImage}
                        label="Service Image"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Content</Label>
                    <div className="min-h-[400px]">
                        <TinyMCEEditor
                            content={content}
                            onChange={setContent}
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Link href="/backoffice/services">
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Service
                    </Button>
                </div>
            </form>

        </div>
    );
}
