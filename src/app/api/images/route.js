import { NextResponse } from "next/server";
import { writeFile, readdir } from "fs/promises";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDir() {
  try {
    await readdir(uploadDir); 
  } catch {
    await fs.promises.mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, ".keep"), "");
  }
}

function getFullUrl(req, filePath) {
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host") || "localhost:3000";
  return `${protocol}://${host}${filePath}`;
}

export async function GET(req) {
  try {
    const files = await readdir(uploadDir);
    const images = files.map((file) => ({
      url: getFullUrl(req, `/uploads/${file}`)
    }));
    return NextResponse.json(images);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load images" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureUploadDir();
    const formData = await req.formData();
    // Support both "file" (from Froala) and "image" (from React Quill)
    const file = formData.get("file") || formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Return both formats for compatibility (Froala expects "link", Quill expects "url")
    const imageUrl = getFullUrl(req, `/uploads/${filename}`);
    return NextResponse.json({ link: imageUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const formData = await req.formData();
    const src = formData.get("src")?.toString();

    if (!src) {
      return NextResponse.json({ error: "No src provided" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", src.replace(/^\/+/, ""));
    await fs.promises.unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
