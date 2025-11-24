import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req) {
  try {
    const url = new URL(req.url);
    const nameFilter = url.searchParams.get("name"); 

    const menus = await prisma.menu.findMany({
      where: nameFilter ? { name: nameFilter } : undefined,
      include: { items: true },
    });

    const result = menus.map(menu => {
      const map = {};
      const roots = [];

      menu.items.forEach(item => {
        map[item.id] = { ...item, children: [] };
      });

      // วาง children ลง parent
      menu.items.forEach(item => {
        if (item.parentId && map[item.parentId]) {
          map[item.parentId].children.push(map[item.id]);
        } else if (!item.parentId) {
          roots.push(map[item.id]);
        }
      });

      // sort top-level items
      roots.sort((a, b) => a.sortOrder - b.sortOrder);

      return {
        ...menu,
        items: roots,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching menus:", err);
    if (err && err.stack) console.error(err.stack);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
