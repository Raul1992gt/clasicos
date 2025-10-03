"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import RegisterForm from "@/components/RegisterForm";
import AttendeesGrid from "@/components/AttendeesGrid";
import EventDetailsModal, { type EventDetails } from "@/components/EventDetailsModal";
import PastEventModal, { type PastEventDetails } from "@/components/PastEventModal";
import Lightbox from "@/components/Lightbox";

export default function Home() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{ src: string; alt?: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [detailsEvent, setDetailsEvent] = useState<EventDetails | undefined>(undefined);
  const [pastOpen, setPastOpen] = useState(false);
  const [pastEvent, setPastEvent] = useState<PastEventDetails | undefined>(undefined);
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
          {/* Mini hero destacado */}
          <div className="card p-6 lg:p-8 flex flex-col gap-5">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
              <Image src="/images/clasico.jpg" alt="Ruta Costera" fill className="object-cover" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Quedada clásicos</h3>
              <p className="text-muted text-sm">
                Sábado 9 de octubre — Punto de encuentro: Paseo del puerto — 70km
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDetailsEvent({
                    title: "Quedada clásicos",
                    subtitle: "Sábado 9 de octubre · 07:00 · Paseo del puerto",
                    cover: "/images/clasico.jpg",
                    meetingTitle: "Punto de Encuentro",
                    meetingTime: "07:00",
                    meetingImage: "/images/reunion1.jpg",
                    gallery: ["/images/clio.jpg", "/images/bmw1.jpg", "/images/corrado.jpg"],
                    stats: { checkin: "06:30 · Salida 07:00", distance: "70 km", weather: "Despejado", parking: "Vigilado" },
                    stops: [
                      { name: "Mirador costero", km: "Km 24" },
                      { name: "Faro", km: "Km 40" },
                      { name: "Chiringuito", km: "Km 58" },
                    ],
                    quota: { available: 12, enrolled: 28 },
                  });
                  setDetailsOpen(true);
                }}
                className="btn-accent px-4 py-2 text-sm" style={{ borderColor: "var(--border)" }}
              >
                Ver detalles
              </button>
            </div>
          </div>

          {/* Formulario registro */}
          <div id="registro" className="card p-6 lg:p-7">
            <h3 className="text-lg font-semibold mb-6">Nuevo Registro</h3>
            <RegisterForm />
          </div>
        </div>

        {/* Inscritos (fila completa debajo) */}
        <div className="mt-8 card p-8 lg:p-10">
          <h3 className="text-lg font-semibold mb-6">Inscritos al Próximo Evento</h3>
          {(() => {
            const attendees = [
              { src: "/images/corrado.jpg", title: "Piloto 1", meta: "Corrado" },
              { src: "/images/bmw1.jpg", title: "Piloto 2", meta: "BMW" },
              { src: "/images/clio.jpg", title: "Piloto 3", meta: "Clio" },
              { src: "/images/corrado.jpg", title: "Piloto 1", meta: "Corrado" },
              { src: "/images/bmw1.jpg", title: "Piloto 2", meta: "BMW" },
              { src: "/images/clio.jpg", title: "Piloto 3", meta: "Clio" },
              { src: "/images/corrado.jpg", title: "Piloto 4", meta: "Corrado" },
              { src: "/images/bmw1.jpg", title: "Piloto 5", meta: "BMW" },
              { src: "/images/corrado.jpg", title: "Piloto 1", meta: "Corrado" },
              { src: "/images/bmw1.jpg", title: "Piloto 2", meta: "BMW" },
              { src: "/images/clio.jpg", title: "Piloto 3", meta: "Clio" },
              { src: "/images/corrado.jpg", title: "Piloto 1", meta: "Corrado" },
              { src: "/images/bmw1.jpg", title: "Piloto 2", meta: "BMW" },
              { src: "/images/clio.jpg", title: "Piloto 3", meta: "Clio" },
              { src: "/images/corrado.jpg", title: "Piloto 4", meta: "Corrado" },
              { src: "/images/bmw1.jpg", title: "Piloto 5", meta: "BMW" },
              { src: "/images/clio.jpg", title: "Piloto 6", meta: "Clio" },
              { src: "/images/corrado.jpg", title: "Piloto 7", meta: "Corrado" },
              { src: "/images/bmw1.jpg", title: "Piloto 8", meta: "BMW" },
              { src: "/images/clio.jpg", title: "Piloto 9", meta: "Clio" },
              { src: "/images/corrado.jpg", title: "Piloto 10", meta: "Corrado" },
              { src: "/images/bmw1.jpg", title: "Piloto 11", meta: "BMW" },
              { src: "/images/clio.jpg", title: "Piloto 12", meta: "Clio" },
              { src: "/images/corrado.jpg", title: "Piloto 13", meta: "Corrado" },
              { src: "/images/bmw1.jpg", title: "Piloto 14", meta: "BMW" },
              { src: "/images/clio.jpg", title: "Piloto 15", meta: "Clio" },
              { src: "/images/corrado.jpg", title: "Piloto 16", meta: "Corrado" },
              { src: "/images/bmw1.jpg", title: "Piloto 17", meta: "BMW" },
              { src: "/images/clio.jpg", title: "Piloto 18", meta: "Clio" },
              { src: "/images/corrado.jpg", title: "Piloto 19", meta: "Corrado" },
              { src: "/images/bmw1.jpg", title: "Piloto 20", meta: "BMW" },
              { src: "/images/clio.jpg", title: "Piloto 21", meta: "Clio" },
              { src: "/images/corrado.jpg", title: "Piloto 22", meta: "Corrado" },
              { src: "/images/bmw1.jpg", title: "Piloto 23", meta: "BMW" },
              { src: "/images/clio.jpg", title: "Piloto 24", meta: "Clio" },
              { src: "/images/corrado.jpg", title: "Piloto 25", meta: "Corrado" },
              { src: "/images/bmw1.jpg", title: "Piloto 26", meta: "BMW" },
              { src: "/images/clio.jpg", title: "Piloto 27", meta: "Clio" },
              { src: "/images/corrado.jpg", title: "Piloto 28", meta: "Corrado" },
              { src: "/images/bmw1.jpg", title: "Piloto 29", meta: "BMW" },
              { src: "/images/clio.jpg", title: "Piloto 30", meta: "Clio" },
            ];
            const limit = 24; // mostrar 24 inicialmente; botón "Ver más" carga +24
            return (
              <AttendeesGrid
                items={attendees}
                initialVisible={limit}
                maxColumns={4}
                showMore={true}
              />
            );
          })()}
        </div>
      </section>

      {/* Eventos pasados */}
      <section id="pasados" className="section-band band-4 space-y-6">
        <h3 className="text-lg font-semibold mb-6">Eventos pasados</h3>
        <div className="grid gap-8 md:grid-cols-2">
          {[
            {
              title: "Clásicos en la Plaza — Agosto 2025",
              desc: "Exhibición urbana con música, puestos y rutas cortas por el centro.",
              imgs: ["/images/reunion1.jpg", "/images/bmw.jpg", "/images/clasico2.jpg"],
            },
            {
              title: "Ruta de Montaña — Junio 2025",
              desc: "Puertos y miradores. 120km de curvas con radares de foto.",
              imgs: ["/images/clasico1.jpg", "/images/principal.jpg", "/images/corrado.jpg"],
            },
          ].map((card) => (
            <article key={card.title} className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <button
                  type="button"
                  onClick={() => {
                    setPastEvent({ title: card.title, description: card.desc, gallery: card.imgs });
                    setPastOpen(true);
                  }}
                  className="text-sm text-muted hover:text-foreground underline-offset-4 hover:underline"
                >
                  Detalles
                </button>
              </div>
              <p className="text-muted text-sm">{card.desc}</p>
              <div className="grid grid-cols-3 gap-2">
                {card.imgs.map((src, idx) => (
                  <button
                    key={src}
                    className="relative aspect-[4/3] w-full overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                    onClick={() => {
                      setLightboxImages(card.imgs.map((s) => ({ src: s, alt: card.title })));
                      setLightboxIndex(idx);
                      setLightboxOpen(true);
                    }}
                  >
                    <Image src={src} alt={card.title} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </article>
          ))}
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
