import Container from "@/components/Container";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t" style={{ borderColor: "var(--border)" }}>
      <Container className="py-8 text-sm text-muted flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} Ruta Clásicos</div>
        <nav className="flex gap-6">
          <Link href="#sobre" className="hover:text-foreground">Sobre</Link>
          <Link href="#registro" className="hover:text-foreground">Registro</Link>
          <Link href="#eventos" className="hover:text-foreground">Eventos</Link>
          <Link href="#pasados" className="hover:text-foreground">Pasados</Link>
        </nav>
      </Container>
    </footer>
  );
}
