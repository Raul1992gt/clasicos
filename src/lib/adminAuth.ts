import crypto from "crypto";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "admin_session";

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET no está definido en las variables de entorno");
  }
  return secret;
}

export function createAdminSessionToken(email: string): string {
  const secret = getSecret();
  const payload = `${email}:${Date.now()}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const token = Buffer.from(`${payload}:${sig}`).toString("base64url");
  return token;
}

export function verifyAdminSessionToken(token: string | undefined | null): string | null {
  if (!token) return null;
  try {
    const secret = getSecret();
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [email, ts, sig] = decoded.split(":");
    if (!email || !ts || !sig) return null;
    const payload = `${email}:${ts}`;
    const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return null;
    }
    return email;
  } catch {
    return null;
  }
}

export function getAdminEmailFromRequest(req: NextRequest): string | null {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(cookie);
}

export { SESSION_COOKIE_NAME };
