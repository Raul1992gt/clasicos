"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface AttendeeItem {
  src?: string;
  title: string;
  meta: string;
}

interface Props {
  items: AttendeeItem[];
  maxPerColumn?: number; // filas máximas por columna (equilibra columnas)
  maxColumns?: number; // límite superior de columnas
  initialVisible?: number; // cuántos mostrar inicialmente (para Ver más)
  showMore?: boolean; // mostrar control "Ver más"
}

export default function AttendeesGrid({
  items,
  maxPerColumn = 9999, // no se usa en el modo fila-primero
  maxColumns = 4,
  initialVisible = 24,
  showMore = true,
}: Props) {
  const [visible, setVisible] = useState<number>(Math.min(initialVisible, items.length));

  const list = items.slice(0, visible);

  // Calcular columnas según viewport (responsive)
  const [bpCols, setBpCols] = useState(4);
  useEffect(() => {
    function updateCols() {
      const w = window.innerWidth;
      if (w < 640) setBpCols(1); // mobile
      else if (w < 1024) setBpCols(2); // tablet
      else if (w < 1280) setBpCols(3); // laptop
      else setBpCols(4); // desktop
    }
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  const cols = Math.max(1, Math.min(maxColumns, bpCols, list.length || 1));

  // Ajustar visible automáticamente al cambiar de breakpoint
  useEffect(() => {
    const base = bpCols === 1 ? 6 : initialVisible; // móvil: 6, desktop: initialVisible
    setVisible((v) => Math.min(Math.max(base, Math.min(v, items.length)), items.length));
  }, [bpCols, items.length, initialVisible]);

  // Grid en modo fila-primero; en móvil no limitamos el ancho para que ocupe todo
  const colWidth = 340; // px aproximados por columna en >= sm
  const gap = 24; // coincide con gap-6
  const maxWidthPx = cols * colWidth + (cols - 1) * gap;
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    maxWidth: bpCols === 1 ? "100%" : `${maxWidthPx}px`,
  };

  const baseVisible = initialVisible;

  // Condicionales de estilo para móvil 1-col
  const avatarClass = bpCols === 1 ? "w-24 h-24" : "w-12 h-12 sm:w-16 sm:h-16"; // móvil: 96px
  const itemGapClass = bpCols === 1 ? "gap-4" : "gap-3 sm:gap-4";
  const nameClass = bpCols === 1 ? "text-lg font-medium leading-tight" : "text-sm font-medium leading-tight";
  const metaClass = bpCols === 1 ? "text-sm text-muted leading-tight" : "text-xs text-muted leading-tight";

  return (
    <div className="space-y-6">
      <ul className="grid gap-5 sm:gap-6 mx-auto w-full" style={gridStyle}>
        {list.map((e, i) => (
          <li key={i} className={`card-soft p-2 flex items-center ${itemGapClass}`}>
            {e.src && (
              <div className={`relative ${avatarClass} overflow-hidden rounded`}>
                <Image src={e.src} alt={e.title} fill sizes={bpCols === 1 ? "96px" : "64px"} className="object-cover" />
              </div>
            )}
            <div className="flex-1">
              <div className={nameClass}>{e.title}</div>
              <div className={metaClass}>{e.meta}</div>
            </div>
          </li>
        ))}
      </ul>

      {showMore && (
        <div className="flex justify-center gap-3">
          {visible < items.length && (
            <button
              type="button"
              className="border rounded-lg px-4 py-2 text-sm"
              style={{ borderColor: "var(--border)" }}
              onClick={() => setVisible((v) => Math.min(v + (bpCols === 1 ? 6 : 24), items.length))}
            >
              Ver más ({Math.max(0, items.length - visible)} más)
            </button>
          )}
          {visible > (bpCols === 1 ? 6 : baseVisible) && (
            <button
              type="button"
              className="border rounded-lg px-4 py-2 text-sm"
              style={{ borderColor: "var(--border)" }}
              onClick={() => setVisible((v) => Math.max(bpCols === 1 ? 6 : baseVisible, v - (bpCols === 1 ? 6 : 24)))}
            >
              Ver menos
            </button>
          )}
        </div>
      )}
    </div>
  );
}
