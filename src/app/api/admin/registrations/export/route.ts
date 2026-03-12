/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx-js-style";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const eventIds = (body?.eventIds as string[] | undefined)?.filter(
      (id) => typeof id === "string" && id.length > 0
    );

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
      "Nombre y Apellido",
      "Marca y modelo",
      "Matrícula",
      "Año de fabricación",
      "Poblacion",
      "Teléfono",
    ];

    const rows = registrations.map((r) => [
      `${r.name}${r.apellido ? ` ${r.apellido}` : ""}`,
      r.modelo_coche,
      r.matricula,
      r.anio_fabricacion,
      r.poblacion_provincia,
      r.telefono,
    ]);

    const data = [header, ...rows];

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    /*
    =================================
    NEGRITA EN ENCABEZADOS
    =================================
    */

    header.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });

      if (!worksheet[cellAddress]) return;

      worksheet[cellAddress].s = {
        font: { bold: true },
      };
    });

    /*
    =================================
    AUTOAJUSTE DE COLUMNAS
    =================================
    */

    const colWidths = header.map((_, i) => {
      const maxLength = data.reduce((acc, row) => {
        const cell = row[i] ? row[i].toString() : "";
        return Math.max(acc, cell.length);
      }, 10);

      return { wch: maxLength + 2 };
    });

    worksheet["!cols"] = colWidths;

    /*
    =================================
    WORKBOOK
    =================================
    */

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inscritos");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=inscritos.xlsx",
      },
    });
  } catch (err) {
    console.error("[POST /api/admin/registrations/export]", err);
    return NextResponse.json({ error: "Error generando Excel" }, { status: 500 });
  }
}