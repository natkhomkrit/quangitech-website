import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";


export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // if (!currentUser) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
        role: true,
        permissions: true,
      },
    });

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // if (!currentUser) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const { fullName, username, email, password, role, firstName, lastName, permissions } = await req.json();

    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { error: "Full name, username, email, and password are required" },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json(
        { error: "User with this username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await prisma.user.create({
        data: {
          fullName,
          firstName,
          lastName,
          username,
          email,
          password: hashedPassword,
          role: role || "user",
          permissions: role === "admin" ? [] : permissions || [],
        },
      });

      // record activity for user creation (actor = current admin)
      try {
        await prisma.activity.create({
          data: {
            type: "user",
            action: "created",
            title: newUser.username,
            postId: null,
            userId: currentUser.id,
          },
        });
      } catch (actErr) {
        console.error("Failed to record user-create activity:", actErr);
      }

      return NextResponse.json(newUser, { status: 201 });
    } catch (dbError) {
      if (dbError.code === 'P2002') {
        const target = dbError.meta?.target;
        return NextResponse.json(
          { error: `User with this ${target ? target : 'email or username'} already exists` },
          { status: 400 }
        );
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 }
    );
  }
}
