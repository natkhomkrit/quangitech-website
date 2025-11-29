import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";


export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: userId } = await params;

    // get target user info for logging
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });

    await prisma.user.delete({
      where: { id: userId },
    });

    // record activity: user deleted (actor = admin)
    try {
      await prisma.activity.create({
        data: {
          type: "user",
          action: "deleted",
          title: targetUser ? targetUser.username : userId,
          postId: null,
          userId: session.user.id,
        },
      });
    } catch (actErr) {
      console.error("Failed to record user-delete activity:", actErr);
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;

    if (session.user.role !== "admin" && session.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await req.json();

    const updateData = {
      fullName: body.fullName,
      username: body.username,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      address: body.address,
      country: body.country,
      province: body.province,
      district: body.district,
      subDistrict: body.subDistrict,
      postalCode: body.postalCode,
      avatarUrl: body.avatarUrl,
    };

    if (session.user.role === "admin") {
      if (body.role) updateData.role = body.role;
      if (body.status) updateData.status = body.status;
    }

    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(body.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // record activity: user edited (actor = admin)
    try {
      await prisma.activity.create({
        data: {
          type: "user",
          action: "edited",
          title: updatedUser.username,
          postId: null,
          userId: session.user.id,
        },
      });
    } catch (actErr) {
      console.error("Failed to record user-edit activity:", actErr);
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
