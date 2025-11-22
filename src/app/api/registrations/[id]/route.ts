/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const runtime = "nodejs";

const RegistrationUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().max(320).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const registration = await prisma.registration.findUnique({ where: { id } });
    if (!registration) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json({ registration });
  } catch (err) {
    console.error("[GET /api/registrations/[id]]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const json = await req.json();
    const data = RegistrationUpdateSchema.parse(json);

    const updated = await prisma.registration.update({
      where: { id },
      data: {
        ...("name" in data ? { name: data.name! } : {}),
        ...("email" in data ? { email: data.email! } : {}),
      },
    });

    return NextResponse.json({ registration: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: err.flatten() }, { status: 422 });
    }
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "Ya existe una inscripción con ese email para este evento" }, { status: 409 });
    }
    console.error("[PATCH /api/registrations/[id]]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.registration.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/registrations/[id]]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
