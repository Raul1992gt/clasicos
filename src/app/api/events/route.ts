import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const EventCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date().optional().nullable(),
  isPublished: z.boolean().optional().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 20);
    const isPublished = searchParams.get("isPublished");
    const scope = searchParams.get("scope"); // upcoming | past | all

    const skip = (page - 1) * pageSize;
    const now = new Date();

    const where: any = {};
    if (isPublished === "true") where.isPublished = true;
    if (isPublished === "false") where.isPublished = false;
    if (scope === "upcoming") where.startAt = { gte: now };
    if (scope === "past") where.startAt = { lt: now };

    const [items, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { startAt: "asc" },
        skip,
        take: pageSize,
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({ items, page, pageSize, total });
  } catch (err) {
    console.error("[GET /api/events]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = EventCreateSchema.parse(json);

    const created = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description ?? undefined,
        startAt: data.startAt,
        endAt: data.endAt ?? undefined,
        isPublished: data.isPublished ?? true,
      },
    });

    return NextResponse.json({ event: created }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: err.flatten() }, { status: 422 });
    }
    console.error("[POST /api/events]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
