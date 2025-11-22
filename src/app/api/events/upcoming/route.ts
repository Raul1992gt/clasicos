import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 60; // ISR de 1 minuto para el próximo evento

export async function GET() {
  try {
    const now = new Date();
    const event = await prisma.event.findFirst({
      where: {
        isPublished: true,
        startAt: { gte: now },
      },
      orderBy: { startAt: "asc" },
      include: { registrations: false },
    });

    return NextResponse.json({ event });
  } catch (err) {
    console.error("[GET /api/events/upcoming]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
