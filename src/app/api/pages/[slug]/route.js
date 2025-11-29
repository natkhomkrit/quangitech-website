import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
    // Delete page - Admin only
    return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
