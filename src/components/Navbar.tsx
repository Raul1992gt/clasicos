"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Container from "@/components/Container";

const WHATSAPP_URL = "https://wa.me/34611962701";
const INSTAGRAM_URL = "https://www.instagram.com/clasicos25esquivias?igsh=c3ozeTJlaWtoMW5z";

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
      <Container className="h-16 flex items-center justify-between gap-4">
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
        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Contactar por WhatsApp"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 32 32"
              className="w-4 h-4"
            >
              <path
                fill="currentColor"
                d="M16 3C9.383 3 4 8.383 4 15c0 2.145.57 4.144 1.566 5.887L4 29l8.336-1.527A11.89 11.89 0 0 0 16 27c6.617 0 12-5.383 12-12S22.617 3 16 3zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10a9.87 9.87 0 0 1-3.977-.84l-.284-.123-4.9.898.936-4.641-.148-.239A9.93 9.93 0 0 1 6 15c0-5.514 4.486-10 10-10zm-3.07 5.004c-.238 0-.648.092-.986.46-.338.369-1.293 1.262-1.293 3.077 0 1.815 1.325 3.566 1.51 3.813.185.246 2.54 4.064 6.27 5.532 3.098 1.219 3.731.977 4.404.916.673-.062 2.176-.889 2.484-1.748.308-.86.308-1.597.216-1.748-.092-.153-.338-.246-.708-.431-.37-.185-2.176-1.073-2.512-1.196-.338-.123-.584-.185-.83.185-.246.369-.953 1.196-1.168 1.442-.216.246-.431.277-.8.092-.37-.185-1.561-.576-2.973-1.838-1.099-.98-1.84-2.191-2.055-2.56-.216-.369-.023-.569.162-.754.167-.167.37-.431.555-.646.185-.215.246-.369.37-.615.123-.246.062-.461-.031-.647-.092-.185-.831-2.016-1.138-2.764-.3-.726-.6-.753-.838-.761z"
              />
            </svg>
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Ver Instagram"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition-colors"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 32 32"
              className="w-4 h-4"
            >
              <path
                fill="currentColor"
                d="M11 4C7.14 4 4 7.14 4 11v10c0 3.86 3.14 7 7 7h10c3.86 0 7-3.14 7-7V11c0-3.86-3.14-7-7-7H11zm0 2h10c2.773 0 5 2.227 5 5v10c0 2.773-2.227 5-5 5H11c-2.773 0-5-2.227-5-5V11c0-2.773 2.227-5 5-5zm11.5 2a1.5 1.5 0 1 0 0 3.001A1.5 1.5 0 0 0 22.5 8zM16 9a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"
              />
            </svg>
          </a>
        </div>
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
