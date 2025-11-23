/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

interface AdminEventItem {
  id: string;
  title: string;
  startAt: string;
  endAt: string | null;
  imagen_principal_url: string | null;
  maxRegistrations: number | null;
  _count: { registrations: number };
}

export default function AdminEvents() {
  const [items, setItems] = useState<AdminEventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetEventId, setTargetEventId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editing, setEditing] = useState<AdminEventItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [galleryEvent, setGalleryEvent] = useState<AdminEventItem | null>(null);
  const [deleting, setDeleting] = useState<AdminEventItem | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (title.trim()) {
        params.set("title", title.trim());
      }
      const res = await fetch(`/api/admin/events?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudieron cargar los eventos");
      }
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  async function onDownloadPdf() {
    try {
      const body = selectedIds.length > 0 ? { eventIds: selectedIds } : {};
      const res = await fetch("/api/admin/registrations/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "No se pudo generar el PDF");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "inscritos.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err?.message || "Error descargando PDF");
    } finally {
      setDownloadMenuOpen(false);
    }
  }

  async function onDownloadCsv() {
    try {
      const body = selectedIds.length > 0 ? { eventIds: selectedIds } : {};
      const res = await fetch("/api/admin/registrations/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "No se pudo generar el CSV");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "inscritos.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err?.message || "Error descargando CSV");
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    void load();
  }

  function onClear() {
    setTitle("");
    void load();
  }

  function toggleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds(items.map((ev) => ev.id));
    } else {
      setSelectedIds([]);
    }
  }

  function toggleSelectOne(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      if (checked) {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      }
      return prev.filter((x) => x !== id);
    });
  }

  function triggerFileDialog(eventId: string) {
    setTargetEventId(eventId);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const eventId = targetEventId;
    if (!file || !eventId) return;
    try {
      setUpdatingId(eventId);
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/admin/events/${eventId}/main-image`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo actualizar la imagen");
      }
      // Refrescar lista para ver la nueva imagen
      await load();
    } catch (err: any) {
      alert(err?.message || "Error actualizando la imagen");
    } finally {
      setUpdatingId(null);
      setTargetEventId(null);
    }
  }

  return (
    <section className="card p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-semibold">Eventos</h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="border rounded-lg px-3 py-2 text-sm"
            style={{ borderColor: "var(--border)" }}
            onClick={() => setCreating(true)}
            disabled={loading}
          >
            Nuevo evento
          </button>
          <div className="relative">
            <button
              type="button"
              className="btn-accent px-4 py-2 text-sm"
              onClick={() => setDownloadMenuOpen((o) => !o)}
              disabled={loading}
            >
              Descargar ▾
            </button>
            {downloadMenuOpen && (
              <div className="absolute right-0 mt-1 w-40 card p-2 z-[130]">
                <button
                  type="button"
                  className="w-full text-left text-xs px-2 py-1 hover:bg-muted/20 rounded"
                  onClick={onDownloadCsv}
                  disabled={loading}
                >
                  CSV
                </button>
                <button
                  type="button"
                  className="w-full text-left text-xs px-2 py-1 hover:bg-muted/20 rounded"
                  onClick={onDownloadPdf}
                  disabled={loading}
                >
                  PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={onSearch} className="grid gap-2 md:grid-cols-[2fr_auto] items-center">
        <input
          className="bg-transparent border rounded-lg px-3 py-2 text-sm"
          placeholder="Buscar por título de evento"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />

      {loading && items.length === 0 ? (
        <p className="text-sm text-muted">Cargando eventos...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted">No hay eventos que coincidan con los filtros.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted border-b" style={{ borderColor: "var(--border)" }}>
                <th className="py-2 pr-2">
                  <input
                    type="checkbox"
                    checked={items.length > 0 && selectedIds.length === items.length}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="py-2 pr-2">Fecha</th>
                <th className="py-2 pr-2">Título</th>
                <th className="py-2 pr-2">Inscritos</th>
                <th className="py-2 pr-2">Imagen principal</th>
                <th className="py-2 pr-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((ev) => {
                const start = new Date(ev.startAt);
                return (
                  <tr key={ev.id} className="border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
                    <td className="py-1.5 pr-2 align-top text-xs">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(ev.id)}
                        onChange={(e) => toggleSelectOne(ev.id, e.target.checked)}
                      />
                    </td>
                    <td className="py-1.5 pr-2 align-top whitespace-nowrap text-xs">
                      {start.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="py-1.5 pr-2 align-top">{ev.title}</td>
                    <td className="py-1.5 pr-2 align-top text-xs">{ev._count?.registrations ?? 0}</td>
                    <td className="py-1.5 pr-2 align-top text-xs">
                      {ev.imagen_principal_url ? (
                        <a
                          href={ev.imagen_principal_url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline text-xs"
                        >
                          Ver imagen
                        </a>
                      ) : (
                        <span className="text-muted text-xs">Sin imagen</span>
                      )}
                    </td>
                    <td className="py-1.5 pr-2 align-top text-xs">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="border rounded px-2 py-1"
                          style={{ borderColor: "var(--border)" }}
                          onClick={() => {
                            const params = new URLSearchParams();
                            params.set("eventTitle", ev.title);
                            window.location.href = `/admin?${params.toString()}`;
                          }}
                        >
                          Ver inscritos
                        </button>
                        <button
                          type="button"
                          className="border rounded px-2 py-1"
                          style={{ borderColor: "var(--border)" }}
                          onClick={() => setEditing(ev)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="border rounded px-2 py-1 text-red-500"
                          style={{ borderColor: "var(--border)" }}
                          onClick={() => setDeleting(ev)}
                        >
                          Eliminar
                        </button>
                        <button
                          type="button"
                          className="border rounded px-2 py-1"
                          style={{ borderColor: "var(--border)" }}
                          onClick={() => setGalleryEvent(ev)}
                        >
                          Galería
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
      {editing && (
        <EditEventModal
          event={editing}
          onClose={() => setEditing(null)}
          onUpdated={async () => {
            setEditing(null);
            await load();
          }}
        />
      )}
      {creating && (
        <CreateEventModal
          onClose={() => setCreating(false)}
          onCreated={async () => {
            setCreating(false);
            await load();
          }}
        />
      )}
      {galleryEvent && (
        <EventImagesModal
          event={galleryEvent}
          onClose={() => setGalleryEvent(null)}
        />
      )}
      {deleting && (
        <ConfirmDeleteEventModal
          event={deleting}
          onCancel={() => setDeleting(null)}
          onDeleted={async () => {
            setDeleting(null);
            await load();
          }}
        />
      )}
    </section>
  );
}

interface EditEventModalProps {
  event: AdminEventItem;
  onClose: () => void;
  onUpdated: () => void | Promise<void>;
}

function EditEventModal({ event, onClose, onUpdated }: EditEventModalProps) {
  const [title, setTitle] = useState(event.title ?? "");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState(() => {
    const d = new Date(event.startAt);
    return d.toISOString().slice(0, 16);
  });
  const [endAt, setEndAt] = useState(() => {
    if (!event.endAt) return "";
    const d = new Date(event.endAt);
    return d.toISOString().slice(0, 16);
  });
  const [maxRegistrations, setMaxRegistrations] = useState<string>(() => {
    return event.maxRegistrations != null ? String(event.maxRegistrations) : "";
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          startAt: startAt ? new Date(startAt).toISOString() : undefined,
          endAt: endAt ? new Date(endAt).toISOString() : null,
          maxRegistrations:
            maxRegistrations.trim() === ""
              ? null
              : Number.isNaN(Number(maxRegistrations))
              ? null
              : Number(maxRegistrations),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo actualizar el evento");
      }
      await onUpdated();
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
      const res = await fetch(`/api/admin/events/${event.id}/main-image`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo actualizar la imagen");
      }
      // al refrescar tras guardar se verá la nueva imagen
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
              <h2 className="text-lg font-semibold">Editar evento</h2>
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
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                placeholder="Descripción"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="grid md:grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <span className="text-xs text-muted">Inicio</span>
                  <input
                    type="datetime-local"
                    className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-muted">Fin (opcional)</span>
                  <input
                    type="datetime-local"
                    className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-muted">Máximo de inscripciones (opcional)</span>
                  <input
                    type="number"
                    min={1}
                    className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                    value={maxRegistrations}
                    onChange={(e) => setMaxRegistrations(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <span className="text-xs text-muted">Imagen principal</span>
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
                <button
                  type="submit"
                  className="btn-accent px-4 py-2 text-sm"
                  disabled={saving}
                >
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

interface CreateEventModalProps {
  onClose: () => void;
  onCreated: () => void | Promise<void>;
}

function CreateEventModal({ onClose, onCreated }: CreateEventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [maxRegistrations, setMaxRegistrations] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      setSaving(true);
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          startAt: startAt ? new Date(startAt).toISOString() : undefined,
          endAt: endAt ? new Date(endAt).toISOString() : null,
          maxRegistrations:
            maxRegistrations.trim() === ""
              ? null
              : Number.isNaN(Number(maxRegistrations))
              ? null
              : Number(maxRegistrations),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo crear el evento");
      }

      const newEventId: string | undefined = data?.event?.id;

      if (imageFile && newEventId) {
        try {
          setUploadingImage(true);
          const fd = new FormData();
          fd.append("file", imageFile);
          const imgRes = await fetch(`/api/admin/events/${newEventId}/main-image`, {
            method: "POST",
            body: fd,
          });
          const imgData = await imgRes.json();
          if (!imgRes.ok) {
            throw new Error(imgData?.error || "No se pudo subir la imagen principal");
          }
        } finally {
          setUploadingImage(false);
        }
      }

      await onCreated();
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
    } finally {
      setSaving(false);
    }
  }

  function onChangeImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  }

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div className="absolute inset-0 overflow-auto">
        <div className="container-app py-8 max-w-xl mx-auto">
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Nuevo evento</h2>
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
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                placeholder="Descripción"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="grid md:grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <span className="text-xs text-muted">Inicio</span>
                  <input
                    type="datetime-local"
                    className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-muted">Fin (opcional)</span>
                  <input
                    type="datetime-local"
                    className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <span className="text-xs text-muted">Imagen principal (opcional)</span>
                <label className="border rounded-lg px-3 py-2 text-sm cursor-pointer w-fit" style={{ borderColor: "var(--border)" }}>
                  {uploadingImage ? "Subiendo..." : imageFile ? imageFile.name : "Seleccionar imagen"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onChangeImage}
                    disabled={saving || uploadingImage}
                  />
                </label>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="border rounded-lg px-3 py-1.5 text-sm"
                  style={{ borderColor: "var(--border)" }}
                  onClick={onClose}
                  disabled={saving || uploadingImage}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-accent px-4 py-2 text-sm" disabled={saving || uploadingImage}>
                  {saving ? "Creando..." : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EventImagesModalProps {
  event: AdminEventItem;
  onClose: () => void;
}

function EventImagesModal({ event, onClose }: EventImagesModalProps) {
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadImages() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/events/${event.id}/images`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudieron cargar las imágenes");
      }
      setImages(Array.isArray(data.items) ? data.items : []);
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setError(null);
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/admin/events/${event.id}/images`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo subir la imagen");
      }
      await loadImages();
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onDelete(imageId: string) {
    try {
      setError(null);
      const res = await fetch(`/api/admin/events/images/${imageId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo eliminar la imagen");
      }
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
    }
  }

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div className="absolute inset-0 overflow-auto">
        <div className="container-app py-8 max-w-xl mx-auto">
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Galería de imágenes</h2>
              <button
                type="button"
                className="border rounded-lg px-3 py-1.5 text-sm"
                style={{ borderColor: "var(--border)" }}
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>

            <p className="text-xs text-muted">Evento: {event.title}</p>

            <div className="grid gap-2">
              <span className="text-xs text-muted">Añadir imagen a la galería</span>
              <label
                className="border rounded-lg px-3 py-2 text-sm cursor-pointer w-fit"
                style={{ borderColor: "var(--border)" }}
              >
                {uploading ? "Subiendo..." : "Seleccionar imagen"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            {loading ? (
              <p className="text-xs text-muted">Cargando imágenes...</p>
            ) : images.length === 0 ? (
              <p className="text-xs text-muted">Este evento no tiene imágenes en la galería.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {images.map((img) => (
                  <div key={img.id} className="space-y-1 text-xs">
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block relative aspect-[4/3] w-full overflow-hidden rounded border"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <img src={img.url} alt="Imagen de evento" className="h-full w-full object-cover" />
                    </a>
                    <div className="flex justify-end items-center gap-2">
                      <button
                        type="button"
                        className="border rounded px-2 py-0.5"
                        style={{ borderColor: "var(--border)" }}
                        onClick={() => void onDelete(img.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ConfirmDeleteEventModalProps {
  event: AdminEventItem;
  onCancel: () => void;
  onDeleted: () => void | Promise<void>;
}

function ConfirmDeleteEventModal({ event, onCancel, onDeleted }: ConfirmDeleteEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onConfirm() {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo eliminar el evento");
      }
      await onDeleted();
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} aria-hidden />
      <div className="absolute inset-0 overflow-auto">
        <div className="container-app py-8 max-w-md mx-auto">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Eliminar evento</h2>
            <p className="text-sm">
              ¿Seguro que quieres eliminar el evento "{event.title}"? Esta acción no se puede deshacer.
            </p>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="border rounded-lg px-3 py-1.5 text-sm"
                style={{ borderColor: "var(--border)" }}
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="border rounded-lg px-3 py-1.5 text-sm text-red-500"
                style={{ borderColor: "var(--border)" }}
                onClick={() => void onConfirm()}
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

