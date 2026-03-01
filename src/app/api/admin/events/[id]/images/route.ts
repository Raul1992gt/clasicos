import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const MAX_EVENT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const images = await prisma.eventImage.findMany({
      where: { eventId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items: images }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/admin/events/[id]/images]", err);
    return NextResponse.json({ error: "Error obteniendo las imágenes del evento" }, { status: 500 });
  }
}

// Sube una nueva imagen a la galería del evento
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

    if (file.size > MAX_EVENT_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "La imagen es demasiado grande. El tamaño máximo permitido es de 5 MB." },
        { status: 413 }
      );
    }

    const filename = `event-image-${id}-${Date.now()}-${file.name}`;

    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const image = await prisma.eventImage.create({
      data: {
        eventId: id,
        url: blob.url,
      },
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/events/[id]/images]", err);
    return NextResponse.json(
      { error: "Error subiendo la imagen del evento. Revisa que el archivo sea una imagen válida y no sea demasiado grande." },
      { status: 500 }
    );
  }
}
