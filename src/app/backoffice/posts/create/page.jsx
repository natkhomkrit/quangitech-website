"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import React, { useEffect, useRef, useState } from "react";
import { Save, Upload, ArrowLeft } from "lucide-react";
import TinyMCEEditor from "@/components/tinymce-editor";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { ThumbnailPicker } from "@/components/thumbnail-picker";
import CategorySelector from "@/components/category-selector";
import { toast } from "sonner";
import { ImageLibraryDialog } from "@/components/image-library-dialog";
import { useRouter } from "next/navigation";

export default function create() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeyword, setMetaKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);

  const router = useRouter();

  const handleLibrarySelect = (url) => {
    setThumbnail(url);
    setShowLibrary(false);
  };

  const handleModelChange = (newContent) => {
    setContent(newContent);
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .normalize("NFC")
      .replace(/\s+/g, "-")
      .replace(/[^\p{L}\p{N}\p{M}-]+/gu, "")
      .replace(/--+/g, "-");
  };

  const handleSave = async (publish = false) => {
    // Client-side validation for required fields
    if (!title) {
      toast.error("Please enter a Title");
      return;
    }
    if (!slug) {
      toast.error("Please enter a Slug");
      return;
    }
    if (!content) {
      toast.error("Please enter Content");
      return;
    }
    if (!thumbnail) {
      toast.error("Please select a Thumbnail");
      return;
    }
    if (!categoryId) {
      toast.error("Please select a Category");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("status", publish ? "published" : "draft");
      formData.append("postType", "post");
      formData.append("isFeatured", isFeatured ? "true" : "false");
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("metaKeyword", metaKeyword);
      if (categoryId) formData.append("categoryId", categoryId.toString());
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || "Failed to save post");
      }

      const savedPost = await res.json();
      console.log("Saved post:", savedPost);
      router.replace("/backoffice/posts");
      toast.success("Post saved successfully");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Error saving post", {
        description: error.message,
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="outline" size="icon" asChild>
            <Link href="/backoffice/posts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Add New Post</h1>
        </div>
        <div className="w-full md:w-80">
          <div className="flex gap-2 mt-0 md:mt-4">
            <Button
              variant="secondary"
              disabled={isLoading}
              onClick={() => handleSave(false)}
              className="flex-1 cursor-pointer"
            >
              <Save className="mr-2" />
              <span>{isLoading ? "Saving..." : "Save Draft"}</span>
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => handleSave(true)}
              className="flex-1 cursor-pointer"
            >
              <Upload className="mr-2" />
              <span>{isLoading ? "Publishing..." : "Publish"}</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          {/* Title */}
          <div className="mb-4">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              className="mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Slug */}
          <div className="mb-4">
            <Label htmlFor="slug" className="text-sm font-medium">
              Slug <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={isLoading}
              />
              <Button
                onClick={() => {
                  setSlug(generateSlug(title));
                }}
                disabled={isLoading}
              >
                Generate Slug
              </Button>
            </div>
          </div>

          {/* Excerpt */}
          <div className="mb-4">
            <Label htmlFor="excerpt" className="text-sm font-medium">
              Excerpt
            </Label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive mt-1"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Editor */}
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">
              Content <span className="text-red-500">*</span>
            </Label>
            <TinyMCEEditor content={content} onChange={handleModelChange} />
          </div>
        </div>

        {/* Publish Section */}
        <div className="w-full md:w-80">
          <div className="mb-4">
            <ThumbnailPicker
              thumbnail={thumbnail} // ✅ ส่งตรงๆ (File หรือ string ก็ได้)
              onChange={(fileOrUrl) => setThumbnail(fileOrUrl)}
              onChooseExisting={() => setShowLibrary(true)}
            />

            <ImageLibraryDialog
              open={showLibrary}
              onClose={() => setShowLibrary(false)}
              onSelect={handleLibrarySelect}
            />
          </div>
          <div className="mb-4">
            <Label className="text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </Label>
            <CategorySelector
              value={categoryId}
              onChange={(id) => setCategoryId(id)}
            />
          </div>
          {/* Meta Fields */}
          <div className="mb-4">
            <Label className="text-sm font-medium">Meta Title</Label>
            <Input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <Label className="text-sm font-medium">Meta Description</Label>
            <Textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="mt-1"
              rows={2}
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <Label className="text-sm font-medium">Meta Keyword</Label>
            <Input
              value={metaKeyword}
              onChange={(e) => setMetaKeyword(e.target.value)}
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          {/* Featured */}
          <div className="mb-4 flex items-center gap-2">
            <Checkbox
              id="isFeatured"
              checked={isFeatured}
              onCheckedChange={(checked) => setIsFeatured(!!checked)}
              disabled={isLoading}
            />
            <Label htmlFor="isFeatured" className="text-sm font-medium">
              Featured
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
