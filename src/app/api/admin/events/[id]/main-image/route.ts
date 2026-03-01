import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { put, del } from "@vercel/blob";

export const runtime = "nodejs";

const MAX_MAIN_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No se ha enviado ningún archivo" }, { status: 400 });
    }

    if (!file.type || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen (JPG, PNG, etc.)." }, { status: 400 });
    }

    if (file.size > MAX_MAIN_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "La imagen es demasiado grande. El tamaño máximo permitido es de 5 MB." },
        { status: 413 }
      );
    }

    // Obtener URL anterior para borrarla después
    const existing = await prisma.event.findUnique({
      where: { id },
      select: { imagen_principal_url: true },
    });

    const filename = `event-${id}-${Date.now()}-${file.name}`;

    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const event = await prisma.event.update({
      where: { id },
      data: { imagen_principal_url: blob.url },
    });

    // Borrar blob anterior si existía
    if (existing?.imagen_principal_url) {
      try {
        await del(existing.imagen_principal_url, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
      } catch (delErr) {
        console.error("[DELETE old event image blob]", delErr);
      }
    }

    return NextResponse.json({ event, url: blob.url }, { status: 200 });
  } catch (err) {
    console.error("[POST /api/admin/events/[id]/main-image]", err);
    return NextResponse.json(
      { error: "Error actualizando la imagen. Revisa que el archivo sea una imagen válida y no sea demasiado grande." },
      { status: 500 }
    );
  }
}
