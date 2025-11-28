import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";


export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // เช็ค role
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: itemId } = params;
    const { sortOrder, name, url } = await req.json();

    const dataToUpdate = {};
    if (sortOrder !== undefined) dataToUpdate.sortOrder = sortOrder;
    if (name !== undefined) dataToUpdate.name = name;
    if (url !== undefined) dataToUpdate.url = url;

    const updatedItem = await prisma.menuItem.update({
      where: { id: itemId },
      data: dataToUpdate,
    });

    try {
      await prisma.activity.create({
        data: {
          type: "menuItem",
          action: "edited",
          title: updatedItem.name || updatedItem.url || `menuItem:${updatedItem.id}`,
          userId: session.user.id,
          metadata: {
            id: updatedItem.id,
            menuId: updatedItem.menuId,
          },
        }
      })
    } catch (actErr) {
      console.error("Failed to record activity: ", actErr)
    }
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Failed to update menu item:", error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: itemId } = params;

    const deletedItem = await prisma.menuItem.delete({
      where: { id: itemId },
    });

    try {
      await prisma.activity.create({
        data: {
          type: "menuItem",
          action: "deleted",
          title: deletedItem.name || deletedItem.url || `menuItem:${deletedItem.id}`,
          userId: session.user.id,
          metadata: { id: deletedItem.id, menuId: deletedItem.menuId, parentId: deletedItem.parentId || null },
        },
      });
    } catch (actErr) {
      console.error("Failed to record menuItem delete activity:", actErr);
    }

    return NextResponse.json(deletedItem, { status: 200 });
  } catch (error) {
    console.error("Failed to delete menu item:", error);
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}
