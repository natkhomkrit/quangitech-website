import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
    try {
        const services = await prisma.service.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, content, slug, image } = await req.json();

        if (!title || !slug) {
            return NextResponse.json({ error: "Title and Slug are required" }, { status: 400 });
        }

        // Ensure unique slug
        let uniqueSlug = slug;
        let count = 1;
        while (await prisma.service.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${count}`;
            count++;
        }

        const newService = await prisma.service.create({
            data: {
                title,
                slug: uniqueSlug,
                content,
                image,
            },
        });

        return NextResponse.json(newService, { status: 201 });
    } catch (error) {
        console.error("Error creating service:", error);
        return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
    }
}
