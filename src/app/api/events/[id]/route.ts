/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const EventUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  startAt: z.coerce.date().optional().nullable(),
  endAt: z.coerce.date().optional().nullable(),
  isPublished: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json({ event });
  } catch (err) {
    console.error("[GET /api/events/[id]]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const json = await req.json();
    const data = EventUpdateSchema.parse(json);

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...("title" in data ? { title: data.title! } : {}),
        ...("description" in data ? { description: data.description ?? null } : {}),
        ...("startAt" in data ? { startAt: data.startAt ?? undefined } : {}),
        ...("endAt" in data ? { endAt: data.endAt ?? null } : {}),
        ...("isPublished" in data ? { isPublished: data.isPublished } : {}),
      },
    });

    return NextResponse.json({ event: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: err.flatten() }, { status: 422 });
    }
    console.error("[PATCH /api/events/[id]]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/events/[id]]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
