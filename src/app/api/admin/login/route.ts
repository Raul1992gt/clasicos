import { NextRequest, NextResponse } from "next/server";
import { createAdminSessionToken, SESSION_COOKIE_NAME } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ error: "Configuración de admin incompleta" }, { status: 500 });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const token = createAdminSessionToken(email);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 6, // 6 horas
    });
    return res;
  } catch (err) {
    console.error("[POST /api/admin/login]", err);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}
