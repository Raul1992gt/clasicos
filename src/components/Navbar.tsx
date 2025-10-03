"use client";
import Link from "next/link";
import { useState } from "react";
import Container from "@/components/Container";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/#sobre", label: "Sobre" },
    { href: "/#registro", label: "Registro" },
    { href: "/#eventos", label: "Eventos" },
    { href: "/#pasados", label: "Pasados" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: "var(--border)", background: "rgba(11,18,32,0.8)", backdropFilter: "saturate(1.2) blur(8px)" }}>
      <Container className="h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold tracking-tight">
            Ruta Clásicos
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          aria-label="Abrir menú"
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded border"
          style={{ borderColor: "var(--border)" }}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menú</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </Container>
      {open && (
        <div className="md:hidden border-t" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <Container className="py-3 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="py-2 text-sm text-muted hover:text-foreground" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </Container>
        </div>
      )}
    </header>
  );
}
