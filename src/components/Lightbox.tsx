"use client";
import Image from "next/image";
import { useEffect } from "react";

interface Props {
  open: boolean;
  images: { src: string; alt?: string }[];
  index: number;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}

export default function Lightbox({ open, images, index, onClose, onIndexChange }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, index, images.length, onClose, onIndexChange]);

  if (!open || images.length === 0) return null;

  const current = images[index];

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} aria-hidden />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl">
          {/* Image area */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)" }}>
            <Image src={current.src} alt={current.alt ?? "Imagen"} fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-contain" />
          </div>
          {/* Controls */}
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <button aria-label="Anterior" className="bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full grid place-items-center" onClick={() => onIndexChange((index - 1 + images.length) % images.length)}>
              ◀
            </button>
            <button aria-label="Siguiente" className="bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full grid place-items-center" onClick={() => onIndexChange((index + 1) % images.length)}>
              ▶
            </button>
          </div>
          {/* Footer */}
          <div className="mt-3 flex items-center justify-between text-xs text-muted">
            <span>{index + 1} / {images.length}</span>
            <button onClick={onClose} className="border rounded-lg px-3 py-1.5" style={{ borderColor: "var(--border)" }}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
