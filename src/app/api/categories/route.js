import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // import config nextauth
import prisma from "@/lib/prisma";


export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
      },
    });
    return NextResponse.json(categories);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ถ้าอยากเช็ค role ด้วย
    // if (session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const { name, description, slug, parentId, subcategories } = await req.json();

    // Ensure unique slug
    let uniqueSlug = slug;
    let count = 1;
    while (await prisma.category.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    const data = { name, slug: uniqueSlug, description };
    if (parentId && parentId !== "none") {
      data.parentId = parentId;
    }

    const newCategory = await prisma.category.create({
      data,
    });

    // Handle Subcategories Creation
    if (subcategories && Array.isArray(subcategories) && subcategories.length > 0) {
      for (const sub of subcategories) {
        if (!sub.name) continue;

        // Generate slug for subcategory
        let subSlug = sub.slug || sub.name.toLowerCase().replace(/\s+/g, "-");
        // Ensure unique slug
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
            parentId: newCategory.id
          }
        });
      }
    }

    try {
      await prisma.activity.create({
        data: {
          type: "category",
          action: "created",
          title: newCategory.name,
          userId: session.user.id,
          metadata: { id: newCategory.id, slug: newCategory.slug },
        },
      });
    } catch (actErr) {
      console.error("Failed to record category creation activity:", actErr);
    }

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/categories:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
