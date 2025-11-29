import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";


export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Allow both admin and user to create posts
  // if (session.user.role !== "admin") {
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // }

  const formData = await req.formData();

  const title = formData.get("title")?.toString();
  const slug = formData.get("slug")?.toString();
  const excerpt = formData.get("excerpt")?.toString();
  const content = formData.get("content")?.toString();
  const status = formData.get("status")?.toString();
  const postType = formData.get("postType")?.toString();
  const isFeatured = formData.get("isFeatured") === "true";
  const metaTitle = formData.get("metaTitle")?.toString();
  const metaDescription = formData.get("metaDescription")?.toString();
  const metaKeyword = formData.get("metaKeyword")?.toString();
  const categoryId = formData.get("categoryId")?.toString();

  if (!title || !slug || !content || !categoryId) {
    return NextResponse.json(
      { error: "Title, slug, content, and categoryId are required" },
      { status: 400 }
    );
  }

  let thumbnailPath = null;
  const thumbnailFile = formData.get("thumbnail");

  if (thumbnailFile instanceof File) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
    const filename = `${Date.now()}-${thumbnailFile.name.replace(/\s+/g, "-")}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    thumbnailPath = `/uploads/${filename}`;
  } else if (typeof thumbnailFile === "string") {
    thumbnailPath = thumbnailFile;
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        status,
        postType,
        isFeatured,
        metaTitle,
        metaDescription,
        metaKeyword,
        category: { connect: { id: categoryId } },
        author: { connect: { id: session.user.id } },
        thumbnail: thumbnailPath,
        publishedAt: status === "published" ? new Date() : null,
      },
    });

    // record activity
    try {
      await prisma.activity.create({
        data: {
          type: "post",
          action: "created",
          title: newPost.title,
          postId: newPost.id,
          userId: session.user.id,
        },
      });
    } catch (actErr) {
      console.error("Failed to record activity:", actErr);
    }

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slugs = searchParams.getAll("slug");
    const postType = searchParams.get("postType");
    const categoryName = searchParams.get("category");
    const categoryId = searchParams.get("categoryId");
    const status = searchParams.get("status");
    const isFeatured = searchParams.get("isFeatured");

    // build dynamic where
    const where = {};

    if (slugs && slugs.length > 0) where.slug = { in: slugs };
    if (postType) where.postType = postType;
    if (status) where.status = status;
    if (isFeatured !== null) where.isFeatured = isFeatured === "true";

    if (categoryName) {
      // For Mongo/prisma safety: resolve category name to id first,
      // then filter by categoryId instead of using a relation-filter object.
      try {
        const cat = await prisma.category.findFirst({ where: { name: categoryName } });
        if (cat && cat.id) {
          where.categoryId = cat.id;
        } else {
          // no matching category -> return empty list early
          return NextResponse.json([], { status: 200 });
        }
      } catch (catErr) {
        console.error("Error resolving category by name:", catErr);
        if (catErr && catErr.stack) console.error(catErr.stack);
        return NextResponse.json(
          { error: "Failed to resolve category", details: catErr.message },
          { status: 500 }
        );
      }
    } else if (categoryId) {
      // direct id-based filter
      where.categoryId = categoryId;
    }

    console.debug("[DEBUG] posts where:", JSON.stringify(where));

    const posts = await prisma.post.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    if (error && error.stack) console.error(error.stack);
    return NextResponse.json(
      { error: "Failed to fetch posts", details: error.message },
      { status: 500 }
    );
  }
}
