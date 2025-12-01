import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { pageId, type, content, order } = body;

        if (!pageId || !type || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newSection = await prisma.section.create({
            data: {
                pageId,
                type,
                content,
                order: order || 0,
            },
        });

        try {
            const page = await prisma.page.findUnique({
                where: { id: pageId },
                select: { title: true, slug: true }
            });

            if (page) {
                await prisma.activity.create({
                    data: {
                        type: "page",
                        action: "updated",
                        title: page.title,
                        userId: session.user.id,
                        metadata: {
                            id: pageId,
                            slug: page.slug,
                            sectionId: newSection.id,
                            change: "section_created"
                        },
                    },
                });
            }
        } catch (actErr) {
            console.error("Failed to record section creation activity:", actErr);
        }

        return NextResponse.json(newSection, { status: 201 });
    } catch (error) {
        console.error("Error creating section:", error);
        return NextResponse.json({ error: "Failed to create section" }, { status: 500 });
    }
}
