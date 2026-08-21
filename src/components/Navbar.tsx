import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, Phone } from "lucide-react";

const navLinks = [
  { label: "Reisen", href: "/#reisen" },
  { label: "Kultur Tour", href: "/reisen/kultur" },
  { label: "Trekking", href: "/reisen/trekking" },
  { label: "Nomaden 2026", href: "/reisen/nomaden" },
  { label: "Über uns", href: "/#ueber-uns" },
  { label: "Kontakt", href: "/#kontakt" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHome = location.pathname === "/";
  const transparent = onHome && !scrolled && !mobileOpen;

  return (
    <div className={`${onHome ? "absolute" : "relative"} top-0 left-0 right-0 z-50`}>
      <nav
        className={`transition-all duration-500 ${
          transparent
            ? "bg-transparent border-b border-transparent"
            : "bg-background/85 backdrop-blur-xl border-b border-border"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-baseline gap-2">
            <span
              className={`font-display text-2xl md:text-[27px] tracking-tight ${
                transparent ? "text-primary-foreground" : "text-primary"
              }`}
            >
              Kereztour
            </span>
            <span
              className={`hidden sm:block text-[10px] uppercase tracking-[0.28em] ${
                transparent ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}
            >
              Kirgisistan
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-9">
            <ul className="flex items-center gap-7">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className={`text-sm font-medium transition-colors duration-300 hover:text-secondary ${
                      location.pathname === l.href
                        ? "text-secondary"
                        : transparent
                        ? "text-primary-foreground/90"
                        : "text-foreground/80"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              to="/buchen"
              className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                transparent
                  ? "bg-primary/40 backdrop-blur-md border border-primary-foreground/20 text-primary-foreground hover:bg-primary/60"
                  : "bg-primary text-primary-foreground hover:bg-primary-glow"
              }`}
            >
              Anfrage senden <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            className={`lg:hidden ${transparent ? "text-primary-foreground" : "text-foreground"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-background border-t border-border">
            <ul className="flex flex-col px-6 py-4">
              {navLinks.map((l) => (
                <li key={l.label} className="border-b border-border/60 last:border-0">
                  <Link
                    to={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3.5 text-base font-medium text-foreground hover:text-secondary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="px-6 pb-6 flex flex-col gap-3">
              <Link to="/buchen" onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                Anfrage senden <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:+393474867408" className="btn-ghost w-full">
                <Phone className="h-4 w-4" /> +39 347 486 7408
              </a>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
