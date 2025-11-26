"use client";

import React, { useEffect, useRef } from "react";

// load tinymce skins (important for Next.js)
import "tinymce/skins/ui/oxide/skin.min.css";


export default function TinyMCEEditor({ content, onChange }) {
  const editorId = "tinymce-editor";

  useEffect(() => {
    let mounted = true;

    const initEditor = async () => {
      if (!mounted) return;

      // already exists
      if (typeof window !== "undefined" && window.tinymce?.get(editorId)) return;

      try {
        const tinymceModule = await import("tinymce");
        const tinymce = tinymceModule.default || tinymceModule;

        // Ensure tinymce knows where to fetch static assets (skins, models, plugins that load resources)
        try {
          if (tinymce && typeof tinymce.baseURL === 'string') {
            tinymce.baseURL = '/tinymce';
          } else if (tinymce) {
            // some builds expose setBaseURL
            try { tinymce.baseURL = '/tinymce'; } catch (e) { /* ignore */ }
          }
        } catch (e) { }

        await import("tinymce/icons/default");
        await import("tinymce/themes/silver");

        const plugins = [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ];
        await Promise.all(plugins.map((p) => import(`tinymce/plugins/${p}`)));

        tinymce.init({
          selector: `#${editorId}`,
          license_key: "gpl",
          height: 400,
          plugins,
          toolbar:
            "undo redo | styles | bold italic underline strikethrough | " +
            "alignleft aligncenter alignright | bullist numlist | " +
            "link image media table | code",

          content_style:
            "body { font-family: sans-serif; font-size: 14px; }",

          // Use TinyMCE's built-in uploader which posts to the given URL
          images_upload_url: "/api/images",
          images_upload_credentials: false,

          setup: (editor) => {
            editor.on("init", () => {
              try {
                if (content) editor.setContent(content);
              } catch (e) {
                console.error("TinyMCE setContent error:", e);
              }
            });

            const reportChange = () => {
              try {
                if (!editor || typeof editor.getContent !== "function") return;
                const html = editor.getContent();
                if (typeof onChange === "function") onChange(html);
              } catch (e) {
                console.error("TinyMCE getContent error:", e);
              }
            };

            editor.on("change", reportChange);
            editor.on("input", reportChange);
            editor.on("keyup", reportChange);
          },
        });
      } catch (err) {
        console.error("TinyMCE init error:", err);
      }
    };

    initEditor();

    return () => {
      mounted = false;
      if (window.tinymce?.get(editorId)) {
        window.tinymce.get(editorId).remove();
      }
    };
  }, []);

  // Sync content from parent → editor
  useEffect(() => {
    if (typeof window === "undefined") return;

    const editor = window.tinymce?.get(editorId);
    if (!editor) return;

    const current = editor.getContent();
    if ((content || "") !== current) {
      editor.setContent(content || "");
    }
  }, [content]);

  return (
    <textarea id={editorId} defaultValue={content} style={{ visibility: "hidden" }} />
  );
}
