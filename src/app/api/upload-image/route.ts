import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No se ha enviado ningún archivo" }, { status: 400 });
    }

    if (!file.type || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen (JPG, PNG, etc.)." }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "La imagen es demasiado grande. El tamaño máximo permitido es de 5 MB." },
        { status: 413 }
      );
    }

    const filename = `${Date.now()}-${file.name}`;

    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/upload-image]", err);
    return NextResponse.json(
      { error: "Error subiendo la imagen. Revisa que el archivo sea una imagen válida y no sea demasiado grande." },
      { status: 500 }
    );
  }
}
