/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");

    const where: any = {};
    if (title) {
      where.title = {
        contains: title,
        mode: "insensitive",
      };
    }

    const events = await prisma.event.findMany({
      orderBy: { startAt: "desc" },
      where,
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    return NextResponse.json({ items: events });
  } catch (err) {
    console.error("[GET /api/admin/events]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, startAt, endAt, maxRegistrations } = body ?? {};

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
    }
    if (typeof startAt !== "string" || !startAt) {
      return NextResponse.json({ error: "La fecha de inicio es obligatoria" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: typeof description === "string" ? description.trim() : null,
        startAt: new Date(startAt),
        endAt: typeof endAt === "string" && endAt ? new Date(endAt) : null,
        maxRegistrations:
          typeof maxRegistrations === "number"
            ? maxRegistrations
            : typeof maxRegistrations === "string" && maxRegistrations.trim() !== ""
            ? Number(maxRegistrations)
            : null,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/events]", err);
    return NextResponse.json({ error: "Error creando el evento" }, { status: 500 });
  }
}
