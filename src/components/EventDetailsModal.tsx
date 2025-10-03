"use client";
import Image from "next/image";
import { useEffect } from "react";

export interface EventDetails {
  title: string;
  subtitle?: string; // fecha · hora · lugar
  cover?: string;
  meetingTitle?: string;
  meetingTime?: string;
  meetingImage?: string;
  gallery?: string[];
  stats?: { checkin?: string; distance?: string; weather?: string; parking?: string };
  stops?: { name: string; km: string }[];
  quota?: { available?: number; enrolled?: number };
}

interface Props {
  open: boolean;
  onClose: () => void;
  event?: EventDetails;
}

export default function EventDetailsModal({ open, onClose, event }: Props) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  // Defaults to avoid undefined
  const ev: EventDetails = {
    title: event?.title ?? "Detalles de evento",
    subtitle: event?.subtitle ?? "",
    cover: event?.cover ?? "/images/principal.jpg",
    meetingTitle: event?.meetingTitle ?? "Punto de Encuentro",
    meetingTime: event?.meetingTime ?? "06:00",
    meetingImage: event?.meetingImage ?? "/images/reunion1.jpg",
    gallery: event?.gallery ?? ["/images/clio.jpg", "/images/bmw.jpg", "/images/corrado.jpg"],
    stats: event?.stats ?? { checkin: "05:40 · Salida 06:15", distance: "90 km", weather: "Despejado", parking: "Vigilado" },
    stops: event?.stops ?? [
      { name: "Mirador del Acantilado", km: "Km 34" },
      { name: "Café en Puerto Viejo", km: "Km 52" },
      { name: "Punto fotográfico", km: "Km 70" },
    ],
    quota: event?.quota ?? { available: 12, enrolled: 28 },
  };

  const hasStats = Boolean(ev.stats && (ev.stats.checkin || ev.stats.distance || ev.stats.weather || ev.stats.parking));
  const hasStops = Boolean(ev.stops && ev.stops.length);
  const hasMeeting = Boolean(ev.meetingTitle || ev.meetingImage);
  const hasGallery = Boolean(ev.gallery && ev.gallery.length);

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <div className="absolute inset-x-0 bottom-0 top-0 overflow-auto">
        <div className="container-app py-6">
          <div className="card p-5 sm:p-6 lg:p-7 relative">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold">Detalles — {ev.title}</h3>
                {ev.subtitle && <p className="text-muted text-sm">{ev.subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="border rounded-lg px-3 py-1.5 text-sm"
                style={{ borderColor: "var(--border)" }}
                aria-label="Cerrar"
              >
                Cerrar
              </button>
            </div>

            {/* Content grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Left column */}
              <div className="space-y-4">
                <div className="card-soft p-2">
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                    <Image src={ev.cover!} alt="Cover" fill className="object-cover" />
                  </div>
                </div>

                {hasStats && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="card-soft p-3 flex items-center gap-3">
                      <span className="btn-accent px-2.5 py-1 text-xs rounded-md">Próximo evento</span>
                      <span className="text-xs text-muted">Matrícula e imágenes del coche requeridas para el registro</span>
                    </div>
                    <div className="card-soft p-3 grid grid-cols-2 gap-3 text-sm">
                      {ev.stats?.checkin && (
                        <div>
                          <div className="text-muted">Check-in</div>
                          <div>{ev.stats.checkin}</div>
                        </div>
                      )}
                      {ev.stats?.distance && (
                        <div>
                          <div className="text-muted">Distancia</div>
                          <div>{ev.stats.distance}</div>
                        </div>
                      )}
                    </div>
                    {ev.stats?.weather && (
                      <div className="card-soft p-3 text-sm">
                        <div className="text-muted">Clima estimado</div>
                        <div>{ev.stats.weather}</div>
                      </div>
                    )}
                    {ev.stats?.parking && (
                      <div className="card-soft p-3 text-sm">
                        <div className="text-muted">Aparcamiento</div>
                        <div>{ev.stats.parking}</div>
                      </div>
                    )}
                  </div>
                )}

                {hasStops && (
                  <div className="card-soft p-3">
                    <h4 className="font-medium mb-2">Paradas y puntos clave</h4>
                    <ul className="text-sm space-y-1">
                      {ev.stops?.map((s) => (
                        <li key={s.name} className="flex justify-between"><span>{s.name}</span><span className="text-muted">{s.km}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {hasMeeting && (
                  <div className="card-soft p-3">
                    <h4 className="font-medium mb-2">{ev.meetingTitle ?? "Punto de Encuentro"}</h4>
                    {ev.meetingTime && <p className="text-sm text-muted">{ev.meetingTime}</p>}
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mt-2">
                      <Image src={ev.meetingImage!} alt="Mapa" fill className="object-cover" />
                    </div>
                    <p className="text-xs text-muted mt-2">Coordenadas: 36.720, -4.420</p>
                  </div>
                )}

                {hasGallery && (
                  <div className="card-soft p-3">
                    <h4 className="font-medium mb-2">Galería del evento</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {ev.gallery?.map((src) => (
                        <div key={src} className="relative aspect-[4/3] w-full overflow-hidden rounded">
                          <Image src={src} alt="Galería" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(ev.quota?.available != null || ev.quota?.enrolled != null) && (
                  <div className="card-soft p-3">
                    <h4 className="font-medium mb-2">Cupo y normas</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {ev.quota?.available != null && (
                        <div>
                          <div className="text-muted">Plazas disponibles</div>
                          <div>{ev.quota.available}</div>
                        </div>
                      )}
                      {ev.quota?.enrolled != null && (
                        <div>
                          <div className="text-muted">Vehículos inscritos</div>
                          <div>{ev.quota.enrolled}</div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-2">Respetar distancias, nada de acelerones en zonas urbanas. Llevar extintor y seguro vigente.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="text-xs text-muted card-soft px-3 py-2 rounded-md">Duración estimada: 3h 15m</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
