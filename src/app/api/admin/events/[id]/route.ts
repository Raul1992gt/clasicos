/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, startAt, endAt, isPublished } = body ?? {};

    const data: any = {};
    if (typeof title === "string") data.title = title.trim();
    if (typeof description === "string" || description === null) data.description = description?.trim() || null;
    if (typeof startAt === "string") data.startAt = new Date(startAt);
    if (typeof endAt === "string" || endAt === null) data.endAt = endAt ? new Date(endAt) : null;
    if (typeof isPublished === "boolean") data.isPublished = isPublished;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No hay datos para actualizar" }, { status: 400 });
    }

    const event = await prisma.event.update({
      where: { id },
      data,
    });

    return NextResponse.json({ event }, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/admin/events/[id]]", err);
    return NextResponse.json({ error: "Error actualizando el evento" }, { status: 500 });
  }
}
