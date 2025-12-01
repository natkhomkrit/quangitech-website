import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { content, order, isActive } = body;

        const updateData = {};
        if (content !== undefined) updateData.content = content;
        if (order !== undefined) updateData.order = order;
        if (isActive !== undefined) updateData.isActive = isActive;

        const updatedSection = await prisma.section.update({
            where: { id },
            data: updateData,
        });

        try {
            const page = await prisma.page.findUnique({
                where: { id: updatedSection.pageId },
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
                            id: updatedSection.pageId,
                            slug: page.slug,
                            sectionId: updatedSection.id,
                            change: "section_updated"
                        },
                    },
                });
            }
        } catch (actErr) {
            console.error("Failed to record section update activity:", actErr);
        }

        return NextResponse.json(updatedSection);
    } catch (error) {
        console.error("Error updating section:", error);
        return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Get the section before deleting to know its pageId and order
        const sectionToDelete = await prisma.section.findUnique({
            where: { id },
            select: { pageId: true, order: true }
        });

        if (!sectionToDelete) {
            return NextResponse.json({ error: "Section not found" }, { status: 404 });
        }

        // Delete the section
        await prisma.section.delete({
            where: { id },
        });

        // Reorder remaining sections to ensure strict sequence (1, 2, 3...)
        const remainingSections = await prisma.section.findMany({
            where: {
                pageId: sectionToDelete.pageId
            },
            orderBy: { order: 'asc' }
        });

        // Update orders to be sequential
        for (let i = 0; i < remainingSections.length; i++) {
            const section = remainingSections[i];
            const newOrder = i + 1;

            if (section.order !== newOrder) {
                await prisma.section.update({
                    where: { id: section.id },
                    data: { order: newOrder }
                });
            }
        }

        try {
            const page = await prisma.page.findUnique({
                where: { id: sectionToDelete.pageId },
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
                            id: sectionToDelete.pageId,
                            slug: page.slug,
                            sectionId: id,
                            change: "section_deleted"
                        },
                    },
                });
            }
        } catch (actErr) {
            console.error("Failed to record section deletion activity:", actErr);
        }

        return NextResponse.json({ message: "Section deleted successfully" });
    } catch (error) {
        console.error("Error deleting section:", error);
        return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
    }
}
