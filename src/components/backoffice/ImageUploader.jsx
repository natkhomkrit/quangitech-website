"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ImageLibraryDialog } from "@/components/image-library-dialog";

export function ImageUploader({ value, onChange, label = "Image" }) {
    const [uploading, setUploading] = useState(false);
    const [libraryOpen, setLibraryOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Invalid file type. Please select an image.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/images", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            onChange(data.location);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex flex-col gap-4">
                {value ? (
                    <div className="relative w-full max-w-md aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={() => onChange("")}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="w-full max-w-md aspect-video bg-gray-50 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-gray-400 gap-2">
                        <ImageIcon className="h-10 w-10 opacity-50" />
                        <span className="text-sm">No image selected</span>
                    </div>
                )}

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="mr-2 h-4 w-4" />
                        )}
                        Upload New
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setLibraryOpen(true)}
                        disabled={uploading}
                    >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Choose from Library
                    </Button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            <ImageLibraryDialog
                open={libraryOpen}
                onClose={() => setLibraryOpen(false)}
                onSelect={(url) => {
                    onChange(url);
                    setLibraryOpen(false);
                }}
            />
        </div>
    );
}
