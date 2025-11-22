import { NextRequest, NextResponse } from "next/server";
import { createAdminSessionToken, SESSION_COOKIE_NAME } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log("[ADMIN LOGIN] email len:", email.length, "adminEmail len:", adminEmail?.length ?? 0);
    console.log("[ADMIN LOGIN] password len:", password.length, "adminPassword len:", adminPassword?.length ?? 0);

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ error: "Configuración de admin incompleta" }, { status: 500 });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        {
          error: "Credenciales inválidas",
          // Info de depuración (solo longitudes, sin valores reales)
          debug:
            process.env.NODE_ENV === "production"
              ? {
                  emailLen: email.length,
                  adminEmailLen: adminEmail.length,
                  passwordLen: password.length,
                  adminPasswordLen: adminPassword.length,
                }
              : undefined,
        },
        { status: 401 },
      );
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
