import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
    try {
        const pages = await prisma.page.findMany({
            orderBy: { createdAt: "asc" },
        });
        return NextResponse.json(pages);
    } catch (error) {
        console.error("Error fetching pages:", error);
        return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, slug } = body;

        if (!title || !slug) {
            return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
        }

        const existingPage = await prisma.page.findUnique({ where: { slug } });
        if (existingPage) {
            return NextResponse.json({ error: "Page with this slug already exists" }, { status: 400 });
        }

        const newPage = await prisma.page.create({
            data: { title, slug },
        });

        try {
            await prisma.activity.create({
                data: {
                    type: "page",
                    action: "created",
                    title: newPage.title,
                    userId: session.user.id,
                    metadata: { id: newPage.id, slug: newPage.slug },
                },
            });
        } catch (actErr) {
            console.error("Failed to record page creation activity:", actErr);
        }

        return NextResponse.json(newPage, { status: 201 });
    } catch (error) {
        console.error("Error creating page:", error);
        return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
    }
}
