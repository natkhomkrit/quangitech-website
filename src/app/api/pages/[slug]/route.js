import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
    try {
        const { slug } = await params;

        const page = await prisma.page.findUnique({
            where: { slug },
            include: {
                sections: {
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!page) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error) {
        console.error("Error fetching page:", error);
        return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    // Update page details (title, slug) - Admin only
    // Implementation skipped for brevity, focusing on sections for now
    return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;

        // Check if page exists
        const page = await prisma.page.findUnique({
            where: { slug },
        });

        if (!page) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        // Delete page (sections will be deleted automatically due to onDelete: Cascade)
        await prisma.page.delete({
            where: { slug },
        });

        try {
            await prisma.activity.create({
                data: {
                    type: "page",
                    action: "deleted",
                    title: page.title,
                    userId: session.user.id,
                    metadata: { id: page.id, slug: page.slug },
                },
            });
        } catch (actErr) {
            console.error("Failed to record page deletion activity:", actErr);
        }

        return NextResponse.json({ message: "Page deleted successfully" });
    } catch (error) {
        console.error("Error deleting page:", error);
        return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
    }
}
