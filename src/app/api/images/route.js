import { NextResponse } from "next/server";
import { put, del, list } from "@vercel/blob";

export async function GET(req) {
  try {
    const { blobs } = await list();
    const images = blobs.map((blob) => ({
      url: blob.url,
    }));
    return NextResponse.json(images);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load images" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    // Support both "file" (from Froala) and "image" (from TinyMCE)
    const file = formData.get("file") || formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    
    const blob = await put(filename, file, {
      access: "public",
    });

    // Return format for compatibility (Froala expects "link", TinyMCE expects various formats)
    return NextResponse.json({ link: blob.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const formData = await req.formData();
    const url = formData.get("url")?.toString();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    await del(url);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
