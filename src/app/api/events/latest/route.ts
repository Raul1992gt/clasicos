/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const now = new Date();
    // Próximo evento publicado (futuro más cercano)
    const event = await prisma.event.findFirst({
      where: { isPublished: true, startAt: { gte: now } },
      orderBy: { startAt: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        startAt: true,
        endAt: true,
        imagen_principal_url: true,
      },
    });

    if (!event) {
      return NextResponse.json({ event: null }, { status: 200 });
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (err: any) {
    console.error("[GET /api/events/latest]", err);
    if (process.env.NODE_ENV !== "production") {
      const message = typeof err?.message === "string" ? err.message : "Internal Server Error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
