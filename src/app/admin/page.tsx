import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/adminAuth";
import AdminRegistrations from "./AdminRegistrations";
import AdminEvents from "./AdminEvents";
import AdminLogoutButton from "./AdminLogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const email = verifyAdminSessionToken(token);

  if (!email) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div className="container-app py-8 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Panel de administración</h1>
          <AdminLogoutButton />
        </header>

        <p className="text-sm text-muted">
          Has accedido como <span className="font-mono">{email}</span>.
        </p>

        <AdminRegistrations />
        <AdminEvents />
      </div>
    </div>
  );
}
