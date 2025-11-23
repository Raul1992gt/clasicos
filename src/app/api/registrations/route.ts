/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const runtime = "nodejs";
const RegistrationSchema = z.object({
  eventId: z.string().uuid(),
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  dni: z.string().min(3).max(50),
  telefono: z.string().min(3).max(50),
  modelo_coche: z.string().min(1).max(200),
  matricula: z.string().min(3).max(50),
  notas: z.string().max(2000).optional().nullable(),
  imagen_url: z.string().url().max(2000).optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 20);
    const eventId = searchParams.get("eventId");
    const eventTitle = searchParams.get("eventTitle");
    const email = searchParams.get("email");
    const dni = searchParams.get("dni");

    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (eventId) where.eventId = eventId;
    if (email) where.email = email;
    if (dni) where.dni = dni;
    if (eventTitle) {
      where.event = {
        ...(where.event || {}),
        title: {
          contains: eventTitle,
          mode: "insensitive",
        },
      };
    }

    const [items, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          event: true,
        },
      }),
      prisma.registration.count({ where }),
    ]);

    return NextResponse.json({ items, page, pageSize, total });
  } catch (err) {
    console.error("[GET /api/registrations]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { eventId, name, email, dni, telefono, modelo_coche, matricula, notas, imagen_url } = RegistrationSchema.parse(json);

    // Verifica que el evento exista y esté publicado
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || !event.isPublished) {
      return NextResponse.json({ error: "Evento no disponible" }, { status: 400 });
    }

    // Comprueba límite de inscripciones si maxRegistrations está definido
    if (typeof event.maxRegistrations === "number") {
      const currentCount = await prisma.registration.count({ where: { eventId } });
      if (currentCount >= event.maxRegistrations) {
        return NextResponse.json({ error: "El evento ya ha alcanzado el número máximo de inscripciones" }, { status: 409 });
      }
    }

    const registration = await prisma.registration.create({
      data: {
        eventId,
        name,
        email,
        dni,
        telefono,
        modelo_coche,
        matricula,
        notas: notas ?? undefined,
        imagen_url: imagen_url ?? undefined,
      },
    });

    return NextResponse.json({ registration }, { status: 201 });
  } catch (err: any) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      const metaTarget = (err.meta as any)?.target as string[] | string | undefined;
      const target = Array.isArray(metaTarget) ? metaTarget.join(",") : metaTarget ?? "";
      if (typeof target === "string") {
        if (target.includes("eventId") && target.includes("email")) {
          return NextResponse.json({ error: "Ya estás inscrito con ese email para este evento" }, { status: 409 });
        }
        if (target.includes("dni")) {
          return NextResponse.json({ error: "El DNI ya está registrado" }, { status: 409 });
        }
        if (target.includes("matricula")) {
          return NextResponse.json({ error: "La matrícula ya está registrada" }, { status: 409 });
        }
      }
      return NextResponse.json({ error: "Registro duplicado" }, { status: 409 });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: err.flatten() }, { status: 422 });
    }

    console.error("[POST /api/registrations]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

