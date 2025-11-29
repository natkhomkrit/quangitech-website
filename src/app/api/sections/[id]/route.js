import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
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

        return NextResponse.json(updatedSection);
    } catch (error) {
        console.error("Error updating section:", error);
        return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await prisma.section.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Section deleted successfully" });
    } catch (error) {
        console.error("Error deleting section:", error);
        return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
    }
}
