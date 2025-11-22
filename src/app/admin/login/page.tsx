/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginInner />
    </Suspense>
  );
}

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo iniciar sesión");
      }
      const from = searchParams.get("from") || "/admin";
      router.push(from);
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-sm card p-6 space-y-4">
        <h1 className="text-lg font-semibold">Acceso administrador</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            className="bg-transparent border rounded-lg px-3 py-2 w-full"
            placeholder="Email administrador"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="bg-transparent border rounded-lg px-3 py-2 w-full"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-accent px-4 py-2 w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
