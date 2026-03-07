/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface RegisterFormProps {
  onRegistered?: () => void;
  disabled?: boolean;
}

export default function RegisterForm({ onRegistered, disabled = false }: RegisterFormProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Campos del formulario
  const [name, setName] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [modelo, setModelo] = useState("");
  const [matricula, setMatricula] = useState("");
  const [anioFabricacion, setAnioFabricacion] = useState("");
  const [mostrarPublicamente, setMostrarPublicamente] = useState(true);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [aceptaResponsabilidad, setAceptaResponsabilidad] = useState(false);

  // Estado de envío
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  // Evento próximo para obtener eventId
  const [eventId, setEventId] = useState<string | null>(null);
  const [hasEvent, setHasEvent] = useState<boolean>(true);
  const [isEventFull, setIsEventFull] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  }

  useEffect(() => {
    // Obtener el evento actual y su aforo para extraer eventId y saber si está lleno
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/registrations/current", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!active) return;
        if (data?.event?.id) {
          setEventId(data.event.id);
          setHasEvent(true);
          setIsEventFull(Boolean(data.isFull));
        } else {
          setHasEvent(false);
          setIsEventFull(false);
        }
      } catch {
        if (active) {
          setHasEvent(false);
          setIsEventFull(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const isDisabled = !hasEvent || submitting || disabled || isEventFull;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitMsg(null);
    setSubmitError(null);
    setFieldErrors({});

    if (!eventId) {
      setSubmitError("No hay un evento disponible para registrar.");
      return;
    }

    if (isEventFull) {
      setSubmitError("Hemos llenado las plazas, gracias a todos, ¡nos vemos en breve! Gaaas!");
      return;
    }

    if (!file) {
      setSubmitError("Debes seleccionar una imagen del coche para continuar.");
      return;
    }

    if (!aceptaPrivacidad) {
      setSubmitError("Debes aceptar la Política de Privacidad para completar la inscripción.");
      return;
    }

    if (!aceptaResponsabilidad) {
      setSubmitError("Debes declarar que el vehículo cumple la normativa vigente y que eres responsable de su uso durante el evento.");
      return;
    }

    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("file", file);

      const uploadRes = await fetch("/api/upload-image", {
        method: "POST",
        body: fd,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        const msg = uploadData?.error || "No se pudo subir la imagen";
        throw new Error(msg);
      }

      const finalImageUrl: string | undefined = uploadData.url;

      const payload = {
        eventId,
        name: name.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
        modelo_coche: modelo.trim(),
        matricula: matricula.trim(),
        anio_fabricacion: anioFabricacion.trim(),
        mostrar_publicamente: mostrarPublicamente,
        consentimiento_privacidad: aceptaPrivacidad,
        imagen_url: finalImageUrl,
      };

      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 422 && data?.details?.fieldErrors) {
          const fe: Record<string, string | null> = {};
          const fieldErrorsFromApi = data.details.fieldErrors as Record<string, string[] | undefined>;
          for (const [key, messages] of Object.entries(fieldErrorsFromApi)) {
            if (messages && messages.length > 0) {
              fe[key] = messages[0];
            }
          }
          setFieldErrors(fe);
          setSubmitError("Hay errores en el formulario. Revisa los campos marcados.");
        } else {
          const msg = data?.error || "No se pudo completar el registro";
          throw new Error(msg);
        }
        return;
      }

      setSubmitMsg("Registro enviado correctamente");
      setName("");
      setApellido("");
      setTelefono("");
      setModelo("");
      setMatricula("");
      setAnioFabricacion("");
      setMostrarPublicamente(true);
      setAceptaPrivacidad(false);
      setAceptaResponsabilidad(false);
      // Limpieza de preview si venía de archivo
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
      setFile(null);

      if (onRegistered) {
        onRegistered();
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      {!hasEvent && (
        <div className="text-sm text-muted">No hay evento próximo disponible. El formulario se encuentra deshabilitado.</div>
      )}

      {hasEvent && isEventFull && (
        <div className="text-sm text-muted">
          Hemos llenado las plazas, gracias a todos, ¡nos vemos en breve! Gaaas!
        </div>
      )}

      <input
        className="bg-[#111111] border border-zinc-400 rounded-lg px-3 py-2 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-red-700"
        placeholder="Nombre"
        style={{ borderColor: "var(--border)", boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isDisabled}
        required
      />
      {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name}</p>}
      <input
        className="bg-[#111111] border border-zinc-400 rounded-lg px-3 py-2 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-red-700"
        placeholder="Apellido"
        style={{ borderColor: "var(--border)", boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        disabled={isDisabled}
        required
      />
      {fieldErrors.apellido && <p className="text-xs text-red-500">{fieldErrors.apellido}</p>}
      <input
        className="bg-[#111111] border border-zinc-400 rounded-lg px-3 py-2 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-red-700"
        placeholder="Teléfono"
        style={{ borderColor: "var(--border)", boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        disabled={isDisabled}
        required
      />
      {fieldErrors.telefono && <p className="text-xs text-red-500">{fieldErrors.telefono}</p>}
      <input
        className="bg-[#111111] border border-zinc-400 rounded-lg px-3 py-2 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-red-700"
        placeholder="Marca y modelo del coche"
        style={{ borderColor: "var(--border)", boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
        value={modelo}
        onChange={(e) => setModelo(e.target.value)}
        disabled={isDisabled}
        required
      />
      {fieldErrors.modelo_coche && <p className="text-xs text-red-500">{fieldErrors.modelo_coche}</p>}
      <input
        className="bg-[#111111] border border-zinc-400 rounded-lg px-3 py-2 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-red-700"
        placeholder="Matrícula"
        style={{ borderColor: "var(--border)", boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
        value={matricula}
        onChange={(e) => setMatricula(e.target.value)}
        disabled={isDisabled}
        required
      />
      {fieldErrors.matricula && <p className="text-xs text-red-500">{fieldErrors.matricula}</p>}
      <input
        type="number"
        className="bg-[#111111] border border-zinc-400 rounded-lg px-3 py-2 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-red-700"
        placeholder="Año de fabricación (ej. 1990)"
        style={{ borderColor: "var(--border)", boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
        value={anioFabricacion}
        onChange={(e) => setAnioFabricacion(e.target.value)}
        disabled={isDisabled}
        required
      />
      {fieldErrors.anio_fabricacion && <p className="text-xs text-red-500">{fieldErrors.anio_fabricacion}</p>}

      {/* Sección de imagen */}
      <div className="grid gap-2">
        <label className="text-sm text-muted">Imagen del coche</label>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="bg-[#111111] border border-zinc-400 rounded-lg p-3 flex items-center justify-center min-h-32">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Previsualización" className="max-h-48 rounded" />
            ) : (
              <span className="text-sm text-muted" style={{ color: "#e5e7eb" }}>Sin imagen seleccionada</span>
            )}
          </div>
          <label className="btn-accent px-4 py-2 cursor-pointer text-center self-start">
            Seleccionar imagen
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
              disabled={isDisabled}
              required
            />
          </label>
        </div>
      </div>

      <button type="submit" className="btn-accent px-4 py-2" disabled={isDisabled}>
        {submitting ? "Enviando..." : "Enviar Registro"}
      </button>
      {submitMsg && <p className="text-green-600 text-sm">{submitMsg}</p>}
      {submitError && <p className="text-red-600 text-sm">{submitError}</p>}
      <div className="space-y-2 text-xs text-muted">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={aceptaPrivacidad}
            onChange={(e) => setAceptaPrivacidad(e.target.checked)}
            disabled={isDisabled}
          />
          <span>
            He leído y acepto la{" "}
            <Link href="/politica-privacidad" className="underline">
              Política de Privacidad
            </Link>
            .
          </span>
        </label>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={aceptaResponsabilidad}
            onChange={(e) => setAceptaResponsabilidad(e.target.checked)}
            disabled={isDisabled}
          />
          <span>
            Declaro que el vehículo inscrito cumple la normativa vigente y que soy responsable de su uso durante el evento.
          </span>
        </label>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={mostrarPublicamente}
            onChange={(e) => setMostrarPublicamente(e.target.checked)}
            disabled={isDisabled}
          />
          <span>Autorizo a que mi vehículo aparezca públicamente en el listado de inscritos y en la galería del evento.</span>
        </label>
      </div>
    </form>
  );
}
