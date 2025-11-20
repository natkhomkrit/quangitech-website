import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req) {
  try {
    const menuItems = await prisma.menuItem.findMany()
    return NextResponse.json(menuItems, { status: 200 })
  } catch (error) {
    console.error("Error fetching menu items: ", error)
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { menuId, name, url, parentId } = body

    let sortOrder
    const maxSort = await prisma.menuItem.aggregate({
      _max: { sortOrder: true },
      where: {
        menuId,
        parentId: parentId ?? null
      }
    })

    sortOrder = (maxSort._max.sortOrder ?? 0) + 1

    const newItem = await prisma.menuItem.create({
      data: {
        menuId,
        name,
        url,
        sortOrder,
        parentId: parentId ?? null,
      }
    })

    try {
      await prisma.activity.create({
        data: {
          type: "menuItem",
          action: "created",
          title: newItem.name,
          userId: session.user.id,
          metadata: {
            id: newItem.id,
            menuId: newItem.menuId,
          },
        }
      })
    } catch (actErr) {
      console.error("Failed to record activity: ", actErr)
    }

    return NextResponse.json(newItem, { status: 201 })

  } catch (error) {
    console.error("Error creating menu item: ", error)
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    )
  }
}
