/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await _req.json();
    const { name, email, dni, modelo_coche, matricula, notas } = body ?? {};

    const data: any = {};
    if (typeof name === "string") data.name = name.trim();
    if (typeof email === "string") data.email = email.trim();
    if (typeof dni === "string") data.dni = dni.trim();
    if (typeof modelo_coche === "string") data.modelo_coche = modelo_coche.trim();
    if (typeof matricula === "string") data.matricula = matricula.trim();
    if (typeof notas === "string" || notas === null) data.notas = notas?.trim() || null;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No hay datos para actualizar" }, { status: 400 });
    }

    const registration = await prisma.registration.update({
      where: { id },
      data,
    });

    return NextResponse.json({ registration }, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/admin/registrations/[id]]", err);
    return NextResponse.json({ error: "Error actualizando el registro" }, { status: 500 });
  }
}
