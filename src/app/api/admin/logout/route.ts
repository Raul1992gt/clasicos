import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST() {
  try {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return res;
  } catch (err) {
    console.error("[POST /api/admin/logout]", err);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}
