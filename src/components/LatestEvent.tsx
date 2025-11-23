/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type LatestEvent = {
  id: string;
  title: string;
  description?: string | null;
  startAt: string; // ISO from API
  endAt?: string | null;
  imagen_principal_url?: string | null;
};

export default function LatestEvent({ instagramUrl = "#" }: { instagramUrl?: string }) {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<LatestEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/events/latest", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!active) return;
        setEvent(data.event ?? null);
      } catch (_err: any) {
        setError("No se pudo cargar el evento");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="card-dark p-6 lg:p-8">
        <div className="text-sm text-muted">Cargando próximo evento...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-dark p-6 lg:p-8">
        <div className="text-sm text-muted">{error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="card-dark p-6 lg:p-8 flex items-start gap-4">
        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted/30">
          <Image src="/images/principal.jpeg" alt="Clásicos Esquivias" fill className="object-cover" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Estamos organizando el siguiente evento</h3>
          <p className="text-muted text-sm">No te lo pierdas. Síguenos para enterarte en primicia.</p>
          <Link href={instagramUrl} className="btn-accent px-4 py-2 text-sm w-fit" target="_blank" rel="noopener noreferrer">
            Ver en Instagram
          </Link>
        </div>
      </div>
    );
  }

  const start = new Date(event.startAt);
  const dateFmt = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="card-dark p-6 lg:p-8 flex flex-col gap-5">
      {event.imagen_principal_url && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
          <Image src={event.imagen_principal_url} alt={event.title} fill className="object-cover" />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="text-muted text-sm">{dateFmt.format(start)}</p>
        {event.description ? (
          <p className="text-muted text-sm line-clamp-3">{event.description}</p>
        ) : null}
      </div>
      <div className="flex gap-3">
        {/* Enlazar a una página de detalles si se implementa más adelante */}
        <Link href="#registro" className="btn-accent px-4 py-2 text-sm" style={{ borderColor: "var(--border)" }}>
          Apuntarme
        </Link>
      </div>
    </div>
  );
}
