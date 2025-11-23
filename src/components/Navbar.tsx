"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Container from "@/components/Container";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/#registro", label: "Registro" },
    { href: "/#eventos", label: "Eventos" },
    { href: "/#pasados", label: "Pasados" },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b shadow-sm"
      style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.96)", backdropFilter: "saturate(1.2) blur(14px)" }}
    >
      <Container className="h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center" aria-label="Ir al inicio">
            <div className="relative h-10 w-24 sm:h-12 sm:w-28">
              <Image
                src="/images/principal.jpeg"
                alt="Clásicos Esquivias"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-muted hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          aria-label="Abrir menú"
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded border text-foreground"
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
