import { PrismaClient } from "@/generated/prisma";
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
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: categoryId } = await params;
    const { name, slug, description } = await req.json();

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { name, slug, description },
    });

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
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: categoryId } = await params;

    // Get category before delete to log its name
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
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
