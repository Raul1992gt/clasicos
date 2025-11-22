import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const images = await prisma.eventImage.findMany({
      where: { eventId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items: images }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/events/[id]/images]", err);
    return NextResponse.json({ error: "Error obteniendo las imágenes del evento" }, { status: 500 });
  }
}
