import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 300; // 5 minutos para eventos pasados

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 20);
    const skip = (page - 1) * pageSize;

    const now = new Date();

    const [items, total] = await Promise.all([
      prisma.event.findMany({
        where: { isPublished: true, endAt: { lt: now } },
        orderBy: { endAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.event.count({ where: { isPublished: true, endAt: { lt: now } } }),
    ]);

    return NextResponse.json({ items, page, pageSize, total });
  } catch (err) {
    console.error("[GET /api/events/past]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
