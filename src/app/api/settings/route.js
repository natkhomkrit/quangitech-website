import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const settings = await prisma.siteSettings.findFirst();
        return NextResponse.json(settings || {});
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        // if (!session || session.user.role !== "admin") {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        const { siteName, siteUrl, logoUrl, description, seoKeywords, themeColor } = await req.json();

        const updateData = {
            siteName,
            siteUrl,
            logoUrl,
            description,
            seoKeywords,
            themeColor,
        };

        // Check if settings exist
        const existingSettings = await prisma.siteSettings.findFirst();

        let settings;
        if (existingSettings) {
            settings = await prisma.siteSettings.update({
                where: { id: existingSettings.id },
                data: updateData,
            });
        } else {
            settings = await prisma.siteSettings.create({
                data: updateData,
            });
        }

        try {
            await prisma.activity.create({
                data: {
                    type: "settings",
                    action: "updated",
                    title: "Site Settings",
                    userId: session.user.id,
                },
            });
        } catch (actErr) {
            console.error("Failed to record settings update activity:", actErr);
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Failed to update settings:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
