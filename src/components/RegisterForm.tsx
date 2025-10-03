"use client";
import { useEffect, useState } from "react";

export default function RegisterForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: conectar con backend luego. De momento mock.
    alert("Registro enviado (mock). Imagen: " + (file?.name ?? "ninguna"));
  }

  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <input className="bg-transparent border rounded-lg px-3 py-2" placeholder="Nombre" style={{ borderColor: "var(--border)" }} />
      <input className="bg-transparent border rounded-lg px-3 py-2" placeholder="Correo electrónico" style={{ borderColor: "var(--border)" }} />
      <input className="bg-transparent border rounded-lg px-3 py-2" placeholder="Modelo del coche" style={{ borderColor: "var(--border)" }} />
      <textarea className="bg-transparent border rounded-lg px-3 py-2" placeholder="Notas (opcional)" rows={3} style={{ borderColor: "var(--border)" }} />

      {/* Sección de imagen */}
      <div className="grid gap-2">
        <label className="text-sm text-muted">Imagen del coche (opcional)</label>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="card-soft p-3 flex items-center justify-center min-h-32">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Previsualización" className="max-h-48 rounded" />
            ) : (
              <span className="text-sm text-muted">Sin imagen seleccionada</span>
            )}
          </div>
          <label className="btn-accent px-4 py-2 cursor-pointer text-center self-start">
            Seleccionar imagen
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <button type="submit" className="btn-accent px-4 py-2">Enviar Registro</button>
      <p className="text-muted text-xs">Al enviar aceptas nuestras condiciones y política de privacidad.</p>
    </form>
  );
}
