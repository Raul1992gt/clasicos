/* eslint-disable @typescript-eslint/no-explicit-any */
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
import RevealOnScroll from "@/components/RevealOnScroll";

export default function Home() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages] = useState<{ src: string; alt?: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [detailsEvent] = useState<EventDetails | undefined>(undefined);
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
  const [currentMaxRegistrations, setCurrentMaxRegistrations] = useState<number | null>(null);
  const [currentRegistrationsTotal, setCurrentRegistrationsTotal] = useState<number>(0);
  const fullTitle = "Quiénes Somos";
  const fullDescription =
    "Somos una comunidad de amantes y usuarios de los coches clásicos. Nos enfocamos en experiencias seguras, disfrutables y con rutas bien planificadas por lugares pintorescos.";
  const [typedDescription, setTypedDescription] = useState<string>("");
  const [heroParallax, setHeroParallax] = useState<number>(0);

  useEffect(() => {
    function handleScroll() {
      if (typeof window === "undefined") return;
      const y = window.scrollY;
      const clamped = Math.min(Math.max(y, 0), 400);
      setHeroParallax(clamped * -0.06);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setTypedDescription(fullDescription.slice(0, index));
      if (index >= fullDescription.length) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [fullDescription]);

  async function openPastEventDetails(ev: {
    id: string;
    title: string;
    description?: string | null;
  }) {
    const title = ev.title;
    const desc = ev.description ?? "";
    let imgs: string[] = []; // EventImage
    let extraFromRegistrations: string[] = []; // inscritos

    // Primero intentamos cargar imágenes específicas del evento (EventImage)
    try {
      const res = await fetch(`/api/events/${encodeURIComponent(ev.id)}/images`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        imgs = items
          .map((img: any) => img.url as string | null | undefined)
          .filter((u: unknown): u is string => typeof u === "string" && u.length > 0);
      }
    } catch {
      // ignoramos errores aquí, haremos fallback abajo
    }

    // Siempre añadimos también las fotos de inscritos, para combinarlas
    try {
      const res = await fetch(`/api/registrations?eventId=${encodeURIComponent(ev.id)}&page=1&pageSize=100`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        extraFromRegistrations = items
          .map((r: any) => r.imagen_url as string | null | undefined)
          .filter((u: unknown): u is string => typeof u === "string" && u.length > 0);
      }
    } catch {
    }

    // Quitar duplicados dentro de cada grupo y entre ambos
    const seen = new Set<string>();
    const galleryEvent: string[] = [];
    const galleryRegistrations: string[] = [];

    for (const url of imgs) {
      if (!seen.has(url)) {
        seen.add(url);
        galleryEvent.push(url);
      }
    }
    for (const url of extraFromRegistrations) {
      if (!seen.has(url)) {
        seen.add(url);
        galleryRegistrations.push(url);
      }
    }

    setPastEvent({ title, description: desc, galleryEvent, galleryRegistrations });
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
      const total = typeof data.total === "number" ? data.total : items.length;
      const maxRegs = data.event && typeof data.event.maxRegistrations === "number" ? data.event.maxRegistrations : null;
      const mapped = items.map((r: any) => ({
        src: r.imagen_url || undefined,
        title: r.name || "Inscrito",
        meta: r.modelo_coche || r.email || "",
      }));
      setAttendeesItems(mapped);
      setCurrentRegistrationsTotal(total);
      setCurrentMaxRegistrations(maxRegs);
      setAttendeesError(null);
    } catch (_err: any) {
      setAttendeesError("No se pudieron cargar los inscritos");
    } finally {
      setAttendeesLoading(false);
    }
  }

  useEffect(() => {
    void loadAttendees();
  }, []);

  const isRegistrationClosed =
    currentMaxRegistrations !== null && currentRegistrationsTotal >= currentMaxRegistrations;

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
      } catch (_err: any) {
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
    <div className="space-y-16">
      {/* Hero = Quiénes Somos */}
      <section className="section-band hero-band hero-section grid gap-8 lg:gap-14 lg:grid-cols-2 items-center">
        <RevealOnScroll className="space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-white">
            {fullTitle}
          </h1>
          <p className="text-muted max-w-prose">
            {typedDescription || fullDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Link href="#eventos" className="btn-accent btn-pulse px-5 py-3 text-sm">Próximo evento</Link>
          </div>
        </RevealOnScroll>
        <RevealOnScroll className="glass-card hero-glow overflow-hidden p-3 lg:p-4">
          <div
            className="relative aspect-[16/10] w-full"
            style={{ transform: `translateY(${heroParallax}px)`, transition: "transform 0.15s ease-out" }}
          >
            <Image src="/images/principal.jpeg" alt="Ruta clásica" fill className="object-contain rounded-lg" />
          </div>
        </RevealOnScroll>
      </section>

      {/* Modal de detalles del evento */}
      <EventDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} event={detailsEvent} />

      

      {/* Evento + Registro, y debajo inscritos */}
      <section id="eventos" className="section-band band-2 space-y-8">
        <div className="event-panel">
          <div className="event-panel-inner grid gap-7 lg:gap-10 md:grid-cols-2">
            {/* Destacado dinámico del próximo evento o fallback */}
            <RevealOnScroll>
              <LatestEvent instagramUrl="#" />
            </RevealOnScroll>

            {/* Formulario registro */}
            <RevealOnScroll className="card-dark p-6 lg:p-7">
              <div id="registro">
                <h3 className="text-lg font-semibold mb-6">Nuevo Registro</h3>
                {isRegistrationClosed ? (
                  <div className="text-sm text-muted">Inscripciones cerradas, gracias a todos y nos vemos en breve.</div>
                ) : (
                  <RegisterForm
                    onRegistered={loadAttendees}
                    disabled={currentMaxRegistrations !== null && currentRegistrationsTotal >= currentMaxRegistrations}
                  />
                )}
              </div>
            </RevealOnScroll>
          </div>
          {currentMaxRegistrations !== null && currentRegistrationsTotal >= currentMaxRegistrations && (
            <div className="mt-6 bg-black/70 text-white text-sm text-center rounded-lg px-4 py-3">
              Inscripciones cerradas, gracias a todos y nos vemos en breve.
            </div>
          )}
        </div>

        {/* Inscritos (fila completa debajo) */}
        <RevealOnScroll className="mt-8 section-divider">
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
        </RevealOnScroll>
      </section>

      {/* Eventos pasados */}
      <section id="pasados" className="section-band band-2 space-y-6 mt-10">
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
                <RevealOnScroll key={ev.id}>
                  <article className="card-dark p-6 space-y-4">
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
                      className="btn-outline-accent"
                    >
                      Detalles
                    </button>
                  </div>
                  {desc ? <p className="text-muted text-sm">{desc}</p> : null}
                </article>
                </RevealOnScroll>
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
