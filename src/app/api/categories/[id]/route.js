
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const PUT = async (req, { params }) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: categoryId } = await params;
    const { name, slug, description, parentId, subcategories } = await req.json();

    if (parentId === categoryId) {
      return NextResponse.json({ error: "Category cannot be its own parent" }, { status: 400 });
    }

    // Ensure unique slug (excluding current category)
    let uniqueSlug = slug;
    let count = 1;
    while (true) {
      const existing = await prisma.category.findUnique({ where: { slug: uniqueSlug } });
      if (existing && existing.id !== categoryId) {
        uniqueSlug = `${slug}-${count}`;
        count++;
      } else {
        break;
      }
    }

    const data = { name, slug: uniqueSlug, description };
    if (parentId && parentId !== "none") {
      data.parentId = parentId;
    } else {
      data.parentId = null; // Remove parent if "none" selected
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data,
    });

    // Handle Subcategories Sync
    if (subcategories && Array.isArray(subcategories)) {
      // 1. Get existing children
      const existingChildren = await prisma.category.findMany({
        where: { parentId: categoryId },
      });

      // 2. Identify to Create (no ID)
      const toCreate = subcategories.filter(sub => !sub.id);

      // 3. Identify to Unlink (in DB but not in request list)
      const requestIds = subcategories.map(sub => sub.id).filter(Boolean);
      const toUnlink = existingChildren.filter(child => !requestIds.includes(child.id));

      // Execute Unlink
      for (const child of toUnlink) {
        await prisma.category.update({
          where: { id: child.id },
          data: { parentId: null }
        });
      }

      // Execute Create
      for (const sub of toCreate) {
        if (!sub.name) continue;

        let subSlug = sub.slug || sub.name.toLowerCase().replace(/\s+/g, "-");
        let subCount = 1;
        let uniqueSubSlug = subSlug;
        while (await prisma.category.findUnique({ where: { slug: uniqueSubSlug } })) {
          uniqueSubSlug = `${subSlug}-${subCount}`;
          subCount++;
        }

        await prisma.category.create({
          data: {
            name: sub.name,
            slug: uniqueSubSlug,
            parentId: categoryId
          }
        });
      }
    }

    try {
      await prisma.activity.create({
        data: {
          type: "category",
          action: "edited",
          title: updatedCategory.name,
          userId: session.user.id,
          metadata: { id: updatedCategory.id, slug: updatedCategory.slug },
        },
      });
    } catch (actErr) {
      console.error("Failed to record category edit activity:", actErr);
    }

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.log("error: ", error.message);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // if (session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const { id: categoryId } = await params;

    // Get category before delete to log its name
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Check for associated posts - REMOVED check to allow deletion (posts will have categoryId set to null)
    /*
    const postCount = await prisma.post.count({
      where: { categoryId: categoryId },
    });

    if (postCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category. It has ${postCount} associated posts.` },
        { status: 400 }
      );
    }
    */

    // Check for child categories
    const childCount = await prisma.category.count({
      where: { parentId: categoryId },
    });

    if (childCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category. It has ${childCount} subcategories.` },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    try {
      await prisma.activity.create({
        data: {
          type: "category",
          action: "deleted",
          title: category.name,
          userId: session.user.id,
          metadata: { id: category.id, slug: category.slug },
        },
      });
    } catch (actErr) {
      console.error("Failed to record category delete activity:", actErr);
    }

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error: ", error.message);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
};
