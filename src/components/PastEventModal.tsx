"use client";
import Image from "next/image";
import { useEffect } from "react";

export interface PastEventDetails {
  title: string;
  description: string;
  galleryEvent: string[]; // imágenes del evento (EventImage)
  galleryRegistrations: string[]; // imágenes de inscritos
}

interface Props {
  open: boolean;
  onClose: () => void;
  event?: PastEventDetails;
}

export default function PastEventModal({ open, onClose, event }: Props) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open || !event) return null;

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div className="absolute inset-0 overflow-auto">
        <div className="container-app py-6">
          <div className="card p-5 sm:p-6 lg:p-7">
            <div className="flex items-start justify-between gap-4 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold">{event.title}</h3>
                <p className="text-muted text-sm">{event.description}</p>
              </div>
              <button onClick={onClose} className="border rounded-lg px-3 py-1.5 text-sm" style={{ borderColor: "var(--border)" }}>
                Cerrar
              </button>
            </div>

            {event.galleryEvent.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-sm">Fotos del evento</h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  {event.galleryEvent.map((src) => (
                    <div key={src} className="relative aspect-[4/3] w-full overflow-hidden rounded">
                      <Image src={src} alt={event.title} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.galleryRegistrations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Fotos de inscritos</h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  {event.galleryRegistrations.map((src) => (
                    <div key={src} className="relative aspect-[4/3] w-full overflow-hidden rounded">
                      <Image src={src} alt={event.title} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
