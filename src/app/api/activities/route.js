import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    let activities;
    try {
      activities = await prisma.activity.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, username: true, fullName: true, avatarUrl: true },
          },
        },
      });
    } catch (includeErr) {
      console.warn("Activity include(user) failed, retrying without include:", includeErr.message || includeErr);
      // fallback: fetch activities without user relation
      activities = await prisma.activity.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      // try to resolve user info by userId for activities that have userId
      try {
        const userIds = Array.from(new Set(activities.filter(a => a.userId).map(a => a.userId)));
        if (userIds.length) {
          const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, username: true, fullName: true, avatarUrl: true },
          });
          const userMap = new Map(users.map(u => [u.id, u]));
          activities = activities.map(a => ({ ...a, user: a.user || userMap.get(a.userId) || null }));
        }
      } catch (resolveErr) {
        console.warn("Failed to resolve users for activities:", resolveErr.message || resolveErr);
      }
    }

    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
