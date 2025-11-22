import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { del } from "@vercel/blob";

export const runtime = "nodejs";

// Elimina una imagen de la galería del evento
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ imageId: string }> }) {
  try {
    const { imageId } = await params;

    // Buscar primero para obtener la URL
    const existing = await prisma.eventImage.findUnique({
      where: { id: imageId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 });
    }

    // Borrar de la base de datos
    await prisma.eventImage.delete({ where: { id: imageId } });

    // Intentar borrar el blob asociado
    if (existing.url) {
      try {
        await del(existing.url, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
      } catch (delErr) {
        console.error("[DELETE event image blob]", delErr);
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[DELETE /api/admin/events/images/[imageId]]", err);
    return NextResponse.json({ error: "Error eliminando la imagen del evento" }, { status: 500 });
  }
}
