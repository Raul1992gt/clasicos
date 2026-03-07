import Container from "@/components/Container";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t" style={{ borderColor: "var(--border)", backgroundColor: "#1c1c1c", color: "#ffffff" }}>
      <Container className="py-8 text-sm flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} Clásicos Esquivias</div>
        <nav className="flex flex-wrap gap-4 md:gap-6">
          <Link href="#top" className="hover:text-muted">Quiénes Somos</Link>
          <Link href="#registro" className="hover:text-muted">Registro</Link>
          <Link href="#eventos" className="hover:text-muted">Eventos</Link>
          <Link href="#pasados" className="hover:text-muted">Pasados</Link>
          <Link href="/aviso-legal" className="hover:text-muted">Aviso legal</Link>
          <Link href="/politica-privacidad" className="hover:text-muted">Política de Privacidad</Link>
        </nav>
      </Container>
    </footer>
  );
}
