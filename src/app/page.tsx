"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import RegisterForm from "@/components/RegisterForm";
import AttendeesGrid from "@/components/AttendeesGrid";
import EventDetailsModal, { type EventDetails } from "@/components/EventDetailsModal";
import PastEventModal, { type PastEventDetails } from "@/components/PastEventModal";
import Lightbox from "@/components/Lightbox";
import LatestEvent from "@/components/LatestEvent";

export default function Home() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{ src: string; alt?: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [detailsEvent, setDetailsEvent] = useState<EventDetails | undefined>(undefined);
  const [pastOpen, setPastOpen] = useState(false);
  const [pastEvent, setPastEvent] = useState<PastEventDetails | undefined>(undefined);
  const [attendeesItems, setAttendeesItems] = useState<{ src: string; title: string; meta: string }[]>([]);
  const [attendeesLoading, setAttendeesLoading] = useState(true);
  const [attendeesError, setAttendeesError] = useState<string | null>(null);
  const [pastItems, setPastItems] = useState<
    { id: string; title: string; description?: string | null; endAt?: string | null; imagen_principal_url?: string | null }[]
  >([]);
  const [pastLoading, setPastLoading] = useState(true);
  const [pastError, setPastError] = useState<string | null>(null);

  async function openPastEventDetails(ev: {
    id: string;
    title: string;
    description?: string | null;
  }) {
    const title = ev.title;
    const desc = ev.description ?? "";
    let imgs: string[] = [];

    try {
      const res = await fetch(`/api/registrations?eventId=${encodeURIComponent(ev.id)}&page=1&pageSize=100`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        imgs = items
          .map((r: any) => r.imagen_url as string | null | undefined)
          .filter((u: unknown): u is string => typeof u === "string" && u.length > 0);
      }
    } catch {
    }

    setPastEvent({ title, description: desc, gallery: imgs });
    setPastOpen(true);
  }

  // Cargar inscritos del evento actual
  async function loadAttendees() {
    try {
      setAttendeesLoading(true);
      const res = await fetch("/api/registrations/current", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = Array.isArray(data.items) ? data.items : [];
      const mapped = items.map((r: any) => ({
        src: r.imagen_url || undefined,
        title: r.name || "Inscrito",
        meta: r.modelo_coche || r.email || "",
      }));
      setAttendeesItems(mapped);
      setAttendeesError(null);
    } catch (e: any) {
      setAttendeesError("No se pudieron cargar los inscritos");
    } finally {
      setAttendeesLoading(false);
    }
  }

  useEffect(() => {
    void loadAttendees();
  }, []);

  // Cargar eventos pasados
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setPastLoading(true);
        const res = await fetch("/api/events/past?page=1&pageSize=8", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!active) return;
        const items = Array.isArray(data.items) ? data.items : [];
        setPastItems(items);
        setPastError(null);
      } catch (e: any) {
        if (active) setPastError("No se pudieron cargar los eventos pasados");
      } finally {
        if (active) setPastLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="section-band band-1 grid gap-8 lg:gap-14 lg:grid-cols-2 items-center">
        <div className="space-y-4">
          <p className="text-sm text-muted">Clásicos Esquivias</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
            Encuentra tu próxima quedada de coches clásicos
          </h1>
          <p className="text-muted max-w-prose">
            Organizamos salidas sociales, culturales y gastronómicas, orientadas a
            quienes disfrutan viajar con coches clásicos conservando su esencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Link href="#eventos" className="btn-accent px-5 py-3 text-sm">Próximo evento</Link>
          </div>
        </div>
        <div className="card overflow-hidden p-3 lg:p-4">
          <div className="relative aspect-[16/10] w-full">
            <Image src="/images/principal.jpg" alt="Ruta clásica" fill className="object-cover rounded-lg" />
          </div>
        </div>
      </section>

      {/* Modal de detalles del evento */}
      <EventDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} event={detailsEvent} />

      {/* Sobre / Métricas */}
      <section id="sobre" className="section-band band-2 grid gap-8 lg:gap-14 lg:grid-cols-2 items-start">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Quiénes Somos</h2>
          <p className="text-muted max-w-prose">
            Somos una comunidad de amantes y usuarios de los coches clásicos. Nos
            enfocamos en experiencias seguras, disfrutables y con rutas bien
            planificadas por lugares pintorescos.
          </p>
          <div className="grid grid-cols-2 gap-5 lg:gap-6">
            <div className="card p-4">
              <div className="text-2xl font-semibold">1.2k+</div>
              <div className="text-muted text-sm">Miembros</div>
            </div>
            <div className="card p-4">
              <div className="text-2xl font-semibold">80+</div>
              <div className="text-muted text-sm">Rutas</div>
            </div>
          </div>
        </div>
        <div className="card overflow-hidden p-3 lg:p-4">
          <div className="relative aspect-[16/10] w-full">
            <Image src="/images/reunion.jpg" alt="Reunión de clásicos" fill className="object-cover rounded-lg" />
          </div>
        </div>
      </section>

      {/* Evento + Registro, y debajo inscritos */}
      <section id="eventos" className="section-band band-3 space-y-8">
        {/* Fila principal: destacado + registro */}
        <div className="grid gap-7 lg:gap-10 md:grid-cols-2">
          {/* Destacado dinámico del próximo evento o fallback */}
          <LatestEvent instagramUrl="#" />

          {/* Formulario registro */}
          <div id="registro" className="card p-6 lg:p-7">
            <h3 className="text-lg font-semibold mb-6">Nuevo Registro</h3>
            <RegisterForm onRegistered={loadAttendees} />
          </div>
        </div>

        {/* Inscritos (fila completa debajo) */}
        <div className="mt-8 card p-8 lg:p-10">
          <h3 className="text-lg font-semibold mb-6">Inscritos al Próximo Evento</h3>
          {attendeesLoading ? (
            <div className="text-sm text-muted">Cargando inscritos...</div>
          ) : attendeesError ? (
            <div className="text-sm text-muted">{attendeesError}</div>
          ) : attendeesItems.length === 0 ? (
            <div className="text-sm text-muted">No hay inscritos para el próximo evento</div>
          ) : (
            <AttendeesGrid items={attendeesItems} initialVisible={24} maxColumns={4} showMore={true} />
          )}
        </div>
      </section>

      {/* Eventos pasados */}
      <section id="pasados" className="section-band band-4 space-y-6">
        <h3 className="text-lg font-semibold mb-6">Eventos pasados</h3>
        <div className="grid gap-8 md:grid-cols-2">
          {pastLoading ? (
            <div className="text-sm text-muted">Cargando eventos pasados...</div>
          ) : pastError ? (
            <div className="text-sm text-muted">{pastError}</div>
          ) : pastItems.length === 0 ? (
            <div className="text-sm text-muted">No hay eventos pasados</div>
          ) : (
            pastItems.map((ev) => {
              const title = ev.title;
              const desc = ev.description ?? "";
              const mainImg = ev.imagen_principal_url ?? undefined;
              return (
                <article key={ev.id} className="card p-6 space-y-4">
                  {mainImg && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                      <Image src={mainImg} alt={title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                      type="button"
                      onClick={() => {
                        void openPastEventDetails(ev);
                      }}
                      className="text-sm text-muted hover:text-foreground underline-offset-4 hover:underline"
                    >
                      Detalles
                    </button>
                  </div>
                  {desc ? <p className="text-muted text-sm">{desc}</p> : null}
                </article>
              );
            })
          )}
        </div>
      </section>
      {/* Lightbox gallery */}
      <Lightbox
        open={lightboxOpen}
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(next) => setLightboxIndex(typeof next === "number" ? next : 0)}
      />
      <PastEventModal open={pastOpen} onClose={() => setPastOpen(false)} event={pastEvent} />
    </div>
  );
}
