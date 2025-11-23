/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

interface RegistrationItem {
  id: string;
  eventId: string;
  name: string;
  email: string;
  dni: string;
  modelo_coche: string;
  matricula: string;
  createdAt: string;
  event?: {
    title: string;
    startAt: string;
  } | null;
}

export default function AdminRegistrations() {
  const [items, setItems] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);

  const [eventTitle, setEventTitle] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [editing, setEditing] = useState<RegistrationItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDni, setEditDni] = useState("");
  const [editModelo, setEditModelo] = useState("");
  const [editMatricula, setEditMatricula] = useState("");
  const [editNotas, setEditNotas] = useState("");
  const [editImageUploading, setEditImageUploading] = useState(false);
  const [deleting, setDeleting] = useState<RegistrationItem | null>(null);

  async function loadWithFilters(targetPage: number, targetEventTitle: string, targetEmail: string, targetDni: string) {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set("page", String(targetPage));
      params.set("pageSize", String(pageSize));
      if (targetEventTitle.trim()) params.set("eventTitle", targetEventTitle.trim());
      if (targetEmail.trim()) params.set("email", targetEmail.trim());
      if (targetDni.trim()) params.set("dni", targetDni.trim());

      const res = await fetch(`/api/registrations?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudieron cargar los inscritos");
      }
      setItems(Array.isArray(data.items) ? data.items : []);
      setTotal(typeof data.total === "number" ? data.total : 0);
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  async function load() {
    await loadWithFilters(page, eventTitle, email, dni);
  }

  useEffect(() => {
    // Inicializar filtros desde la query string solo una vez
    if (!initialized) {
      try {
        const params = new URLSearchParams(window.location.search);
        const qEventTitle = params.get("eventTitle") ?? "";
        const qEmail = params.get("email") ?? "";
        const qDni = params.get("dni") ?? "";
        const qPage = Number(params.get("page") ?? 1);

        if (qEventTitle) setEventTitle(qEventTitle);
        if (qEmail) setEmail(qEmail);
        if (qDni) setDni(qDni);
        if (!Number.isNaN(qPage) && qPage > 0) {
          setPage(qPage);
        }
      } catch {
        // ignorar errores de parseo de URL
      }
      setInitialized(true);
      return;
    }

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, initialized]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    void loadWithFilters(1, eventTitle, email, dni);
  }

  function onClear() {
    setEventTitle("");
    setEmail("");
    setDni("");
    setPage(1);
    void loadWithFilters(1, "", "", "");
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="card p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-semibold">Inscritos</h2>
        <span className="text-xs text-muted">Total: {total}</span>
      </div>

      <form onSubmit={onSearch} className="grid gap-2 md:grid-cols-4">
        <input
          className="bg-transparent border rounded-lg px-3 py-2 text-sm"
          placeholder="Evento"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        <input
          className="bg-transparent border rounded-lg px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="bg-transparent border rounded-lg px-3 py-2 text-sm"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />
        <div className="flex gap-2">
          <button type="submit" className="btn-accent px-4 py-2 text-sm" disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
          <button
            type="button"
            className="border rounded-lg px-3 py-2 text-sm"
            style={{ borderColor: "var(--border)" }}
            onClick={onClear}
            disabled={loading}
          >
            Limpiar
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-muted">Cargando inscritos...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted">No hay inscritos que coincidan con los filtros.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted border-b" style={{ borderColor: "var(--border)" }}>
                <th className="py-2 pr-2">Fecha evento</th>
                <th className="py-2 pr-2">Evento</th>
                <th className="py-2 pr-2">Nombre</th>
                <th className="py-2 pr-2">Email</th>
                <th className="py-2 pr-2">DNI</th>
                <th className="py-2 pr-2">Modelo</th>
                <th className="py-2 pr-2">Matrícula</th>
                <th className="py-2 pr-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => {
                const createdDate = new Date(r.createdAt);
                const eventDate = r.event?.startAt ? new Date(r.event.startAt) : null;
                const eventTitle = r.event?.title ?? r.eventId ?? "(Sin título)";
                return (
                  <tr key={r.id} className="border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
                    <td className="py-1.5 pr-2 align-top whitespace-nowrap text-xs">
                      {eventDate
                        ? eventDate.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })
                        : createdDate.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="py-1.5 pr-2 align-top text-xs break-all">{eventTitle}</td>
                    <td className="py-1.5 pr-2 align-top">{r.name}</td>
                    <td className="py-1.5 pr-2 align-top text-xs break-all">{r.email}</td>
                    <td className="py-1.5 pr-2 align-top">{r.dni}</td>
                    <td className="py-1.5 pr-2 align-top">{r.modelo_coche}</td>
                    <td className="py-1.5 pr-2 align-top">{r.matricula}</td>
                    <td className="py-1.5 pr-2 align-top text-xs">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="border rounded px-2 py-1"
                          style={{ borderColor: "var(--border)" }}
                          onClick={() => {
                            setEditing(r);
                            setEditName(r.name ?? "");
                            setEditEmail(r.email ?? "");
                            setEditDni(r.dni ?? "");
                            setEditModelo(r.modelo_coche ?? "");
                            setEditMatricula(r.matricula ?? "");
                            setEditNotas("");
                          }}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="border rounded px-2 py-1 text-red-500"
                          style={{ borderColor: "var(--border)" }}
                          onClick={() => setDeleting(r)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 text-xs text-muted">
        <span>
          Página {page} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="border rounded px-2 py-1"
            style={{ borderColor: "var(--border)" }}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
          >
            Anterior
          </button>
          <button
            type="button"
            className="border rounded px-2 py-1"
            style={{ borderColor: "var(--border)" }}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
          >
            Siguiente
          </button>
        </div>
      </div>

      {editing && (
        <EditRegistrationModal
          item={editing}
          name={editName}
          setName={setEditName}
          email={editEmail}
          setEmail={setEditEmail}
          dni={editDni}
          setDni={setEditDni}
          modelo={editModelo}
          setModelo={setEditModelo}
          matricula={editMatricula}
          setMatricula={setEditMatricula}
          notas={editNotas}
          setNotas={setEditNotas}
          uploadingImage={editImageUploading}
          setUploadingImage={setEditImageUploading}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void load();
          }}
        />
      )}
      {deleting && (
        <ConfirmDeleteRegistrationModal
          item={deleting}
          onCancel={() => setDeleting(null)}
          onDeleted={() => {
            setDeleting(null);
            void load();
          }}
        />
      )}
    </section>
  );
}

interface EditModalProps {
  item: RegistrationItem;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  dni: string;
  setDni: (v: string) => void;
  modelo: string;
  setModelo: (v: string) => void;
  matricula: string;
  setMatricula: (v: string) => void;
  notas: string;
  setNotas: (v: string) => void;
  uploadingImage: boolean;
  setUploadingImage: (v: boolean) => void;
  onClose: () => void;
  onSaved: () => void;
}

function EditRegistrationModal({
  item,
  name,
  setName,
  email,
  setEmail,
  dni,
  setDni,
  modelo,
  setModelo,
  matricula,
  setMatricula,
  notas,
  setNotas,
  uploadingImage,
  setUploadingImage,
  onClose,
  onSaved,
}: EditModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/registrations/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          dni,
          modelo_coche: modelo,
          matricula,
          notas,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo guardar el registro");
      }
      onSaved();
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
    } finally {
      setSaving(false);
    }
  }

  async function onChangeImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/admin/registrations/${item.id}/image`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo actualizar la imagen");
      }
      // nada más, al cerrar y recargar se verá la nueva imagen donde se use
    } catch (err: any) {
      setError(err?.message || "Error actualizando la imagen");
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div className="absolute inset-0 overflow-auto">
        <div className="container-app py-8 max-w-xl mx-auto">
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Editar inscrito</h2>
              <button
                type="button"
                className="border rounded-lg px-3 py-1.5 text-sm"
                style={{ borderColor: "var(--border)" }}
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={onSubmit} className="grid gap-3">
              <input
                className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                placeholder="DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
              <input
                className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                placeholder="Modelo del coche"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                required
              />
              <input
                className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                placeholder="Matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                required
              />
              <textarea
                className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                placeholder="Notas"
                rows={3}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
              />

              <div className="grid gap-2">
                <span className="text-xs text-muted">Imagen del coche</span>
                <label className="border rounded-lg px-3 py-2 text-sm cursor-pointer w-fit" style={{ borderColor: "var(--border)" }}>
                  {uploadingImage ? "Subiendo..." : "Cambiar imagen"}
                  <input type="file" accept="image/*" className="hidden" onChange={onChangeImage} disabled={uploadingImage} />
                </label>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="border rounded-lg px-3 py-1.5 text-sm"
                  style={{ borderColor: "var(--border)" }}
                  onClick={onClose}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-accent px-4 py-2 text-sm" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ConfirmDeleteRegistrationModalProps {
  item: RegistrationItem;
  onCancel: () => void;
  onDeleted: () => void;
}

function ConfirmDeleteRegistrationModal({ item, onCancel, onDeleted }: ConfirmDeleteRegistrationModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onConfirm() {
    try {
      setSaving(true);
      setError(null);
      const res = await fetch(`/api/admin/registrations/${item.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo eliminar el inscrito");
      }
      onDeleted();
    } catch (err: any) {
      setError(err?.message || "Error eliminando el inscrito");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} aria-hidden />
      <div className="absolute inset-0 overflow-auto">
        <div className="container-app py-8 max-w-md mx-auto">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Eliminar inscrito</h2>
            <p className="text-sm text-muted">
              ¿Seguro que quieres eliminar el registro "{item.name}"?
            </p>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="border rounded-lg px-3 py-1.5 text-sm"
                style={{ borderColor: "var(--border)" }}
                onClick={onCancel}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-accent px-4 py-2 text-sm bg-red-600 hover:bg-red-700"
                onClick={onConfirm}
                disabled={saving}
              >
                {saving ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
