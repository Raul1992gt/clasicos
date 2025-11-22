import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 20);
    const skip = (page - 1) * pageSize;

    const now = new Date();
    const event = await prisma.event.findFirst({
      where: { isPublished: true, startAt: { gte: now } },
      orderBy: { startAt: "asc" },
      select: { id: true, title: true, startAt: true },
    });

    if (!event) {
      return NextResponse.json({ event: null, items: [], page, pageSize, total: 0 });
    }

    const [items, total] = await Promise.all([
      prisma.registration.findMany({
        where: { eventId: event.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.registration.count({ where: { eventId: event.id } }),
    ]);

    return NextResponse.json({ event, items, page, pageSize, total });
  } catch (err) {
    console.error("[GET /api/registrations/current]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
