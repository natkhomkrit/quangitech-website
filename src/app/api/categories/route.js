import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // import config nextauth
import prisma from "@/lib/prisma";


export async function GET() {
  try {
    const categories = await prisma.category.findMany();
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
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, description, slug } = await req.json();

    const newCategory = await prisma.category.create({
      data: { name, slug, description },
    });

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
