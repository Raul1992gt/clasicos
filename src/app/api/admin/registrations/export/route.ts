/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const eventIds = (body?.eventIds as string[] | undefined)?.filter((id) => typeof id === "string" && id.length > 0);

    const where: any = {};
    if (eventIds && eventIds.length > 0) {
      where.eventId = { in: eventIds };
    }

    const registrations = await prisma.registration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { event: true },
    });

    const header = [
      "eventId",
      "eventTitle",
      "eventStartAt",
      "name",
      "email",
      "dni",
      "modelo_coche",
      "matricula",
      "notas",
      "createdAt",
    ];

    const rows = registrations.map((r) => [
      r.eventId,
      r.event?.title ?? "",
      r.event?.startAt.toISOString() ?? "",
      r.name,
      r.email,
      r.dni,
      r.modelo_coche,
      r.matricula,
      r.notas ?? "",
      r.createdAt.toISOString(),
    ]);

    const escape = (value: string) => {
      if (value.includes("\"") || value.includes(",") || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => escape(String(cell ?? ""))).join(","))
      .join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=inscritos.csv",
      },
    });
  } catch (err) {
    console.error("[POST /api/admin/registrations/export]", err);
    return NextResponse.json({ error: "Error generando CSV" }, { status: 500 });
  }
}
