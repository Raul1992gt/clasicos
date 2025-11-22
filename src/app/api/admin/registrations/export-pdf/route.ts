import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// Usamos la build standalone de pdfkit para evitar dependencias de fuentes en disco
// Tipamos como any porque no hay tipos oficiales para este bundle
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const PDFDocument: any = require("pdfkit/js/pdfkit.standalone.js");

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

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({ margin: 40 });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk: any) => chunks.push(chunk as Buffer));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      doc.fontSize(16).text("Listado de inscritos", { align: "center" });
      doc.moveDown();

      registrations.forEach((r) => {
        const evTitle = r.event?.title ?? "(Sin título)";
        const evDate = r.event?.startAt ? new Date(r.event.startAt).toLocaleString("es-ES") : "";
        doc.fontSize(10).text(`Evento: ${evTitle} (${evDate})`);
        doc.text(`Nombre: ${r.name}`);
        doc.text(`Email: ${r.email}`);
        doc.text(`DNI: ${r.dni}`);
        doc.text(`Modelo: ${r.modelo_coche}`);
        doc.text(`Matrícula: ${r.matricula}`);
        if (r.notas) doc.text(`Notas: ${r.notas}`);
        doc.text(`Alta: ${new Date(r.createdAt).toLocaleString("es-ES")}`);
        doc.moveDown();
      });

      if (registrations.length === 0) {
        doc.fontSize(12).text("No hay inscritos para los filtros seleccionados.");
      }

      doc.end();
    });

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=inscritos.pdf",
      },
    });
  } catch (err) {
    console.error("[POST /api/admin/registrations/export-pdf]", err);
    return NextResponse.json({ error: "Error generando PDF" }, { status: 500 });
  }
}
