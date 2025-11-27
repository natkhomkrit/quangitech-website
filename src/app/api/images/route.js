import { NextResponse } from "next/server";
import { put, del, list } from "@vercel/blob";

export async function GET(req) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Blob storage not configured. Add BLOB_READ_WRITE_TOKEN to Vercel environment variables." },
        { status: 500 }
      );
    }

    const { blobs } = await list();
    const images = blobs.map((blob) => ({
      url: blob.url,
    }));
    return NextResponse.json(images);
  } catch (err) {
    console.error("GET /api/images error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load images" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Blob storage not configured. Add BLOB_READ_WRITE_TOKEN to Vercel environment variables." },
        { status: 500 }
      );
    }

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
    return NextResponse.json({
      location: blob.url
    });
  } catch (err) {
    console.error("POST /api/images error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Blob storage not configured" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const url = formData.get("url")?.toString();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    await del(url);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/images error:", err);
    return NextResponse.json(
      { error: err.message || "File not found" },
      { status: 404 }
    );
  }
}
