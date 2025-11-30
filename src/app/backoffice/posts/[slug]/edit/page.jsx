"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Upload } from "lucide-react";
import TinyMCEEditor from "@/components/tinymce-editor";
import { Checkbox } from "@/components/ui/checkbox";
import { ThumbnailPicker } from "@/components/thumbnail-picker";
import CategorySelector from "@/components/category-selector";
import { toast } from "sonner";
import { ImageLibraryDialog } from "@/components/image-library-dialog";

export default function EditPost() {
  const { slug: routeSlug } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [postType, setPostType] = useState("blog");
  const [isFeatured, setIsFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeyword, setMetaKeyword] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // โหลดโพสต์ตอนเปิดหน้า
  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${routeSlug}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();

        // เซ็ตค่า state
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setExcerpt(data.excerpt || "");
        setContent(data.content || "");
        setStatus(data.status || "draft");
        setPostType(data.postType || "blog");
        setIsFeatured(!!data.isFeatured);
        setMetaTitle(data.metaTitle || "");
        setMetaDescription(data.metaDescription || "");
        setMetaKeyword(data.metaKeyword || "");
        setCategoryId(data.categoryId || null);
        setThumbnail(data.thumbnail || null);
      } catch (err) {
        console.error(err);
        toast.error("Error loading post");
      }
    }
    if (routeSlug) fetchPost();
  }, [routeSlug]);

  // บันทึกโพสต์ (PUT)
  const handleSave = async (publish = false) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("excerpt", excerpt);
      formData.append("content", content || "");
      formData.append("status", publish ? "published" : "draft");
      formData.append("postType", postType);
      formData.append("isFeatured", isFeatured ? "true" : "false");
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("metaKeyword", metaKeyword);
      if (categoryId) formData.append("categoryId", categoryId.toString());
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await fetch(`/api/posts/${routeSlug}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update post");

      const updated = await res.json();
      console.log("Updated:", updated);
      toast.success("Post updated successfully");
      // router.replace("/backoffice/posts"); // Keep user on the same page

      // If slug changed, we might want to update the URL, but for now let's just update the local state if needed.
      // Ideally we would do: router.replace(`/backoffice/posts/${updated.slug}/edit`) if slug changed.
      if (updated.slug && updated.slug !== routeSlug) {
        router.replace(`/backoffice/posts/${updated.slug}/edit`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Error updating post", {
        description: error.message,
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
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


  return (
    <div className="flex flex-col p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold flex-1">Edit Post</h1>
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

      {/* ฟอร์มเหมือน create เลย */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          {/* Title */}
          <div className="mb-4">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
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
              Slug
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
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="mt-1"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Content</Label>
            <TinyMCEEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80">
          <div className="mb-4">
            <ThumbnailPicker
              thumbnail={thumbnail}
              onChange={(fileOrUrl) => setThumbnail(fileOrUrl)}
              onChooseExisting={() => setShowLibrary(true)}
            />
            <ImageLibraryDialog
              open={showLibrary}
              onClose={() => setShowLibrary(false)}
              onSelect={(url) => {
                setThumbnail(url);
                setShowLibrary(false);
              }}
            />
          </div>
          <div className="mb-4">
            <Label className="text-sm font-medium">Category</Label>
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
