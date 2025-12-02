"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import TinyMCEEditor from "@/components/tinymce-editor";
import { ImageUploader } from "@/components/backoffice/ImageUploader";

export default function EditServicePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [slug, setSlug] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        if (id) {
            fetchService();
        }
    }, [id]);

    const fetchService = async () => {
        try {
            const res = await fetch(`/api/services/${id}`);
            if (!res.ok) throw new Error("Failed to fetch service");
            const data = await res.json();

            setTitle(data.title);
            setContent(data.content || "");
            setSlug(data.slug);
            setImage(data.image || "");
        } catch (error) {
            console.error(error);
            toast.error("Failed to load service data");
            router.push("/backoffice/services");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            toast.error("Please fill in all fields");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    image,
                    // We don't update slug automatically here to preserve links, unless we want to.
                    // Let's keep slug as is unless we add a slug field.
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update service");
            }

            toast.success("Service updated successfully");
            router.push("/backoffice/services");
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <Link href="/backoffice/services" className="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-2">
                    <ArrowLeft size={16} className="mr-1" /> Back to Services
                </Link>
                <h1 className="text-2xl font-bold">Edit Service</h1>
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
                        label="Image"
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
                    <Button type="submit" disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Service
                    </Button>
                </div>
            </form>

        </div>
    );
}
