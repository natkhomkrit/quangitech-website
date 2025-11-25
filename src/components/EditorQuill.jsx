"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useMemo } from "react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function EditorQuill({ value, onChange }) {
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: function () {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.click();

          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            try {
              const res = await fetch("/api/images", {
                method: "POST",
                body: formData,
              });

              if (!res.ok) {
                throw new Error("Upload failed");
              }

              const data = await res.json();
              if (data?.url) {
                const range = this.quill.getSelection();
                if (range) {
                  this.quill.insertEmbed(range.index, "image", data.url);
                  this.quill.setSelection(range.index + 1);
                }
              } else {
                alert("Failed to get image URL from server");
              }
            } catch (err) {
              console.error("Image upload error:", err);
              alert(`Upload failed: ${err.message}`);
            }
          };
        },
      },
    },
  }), []);

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <ReactQuill
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
        placeholder="Write your content here..."
      />
    </div>
  );
}
