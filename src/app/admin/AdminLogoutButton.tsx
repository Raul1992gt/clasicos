"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    try {
      setLoading(true);
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignorar errores de logout
    } finally {
      setLoading(false);
      router.push("/admin/login");
    }
  }

  return (
    <button
      type="button"
      className="border rounded-lg px-3 py-1.5 text-sm"
      style={{ borderColor: "var(--border)" }}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
