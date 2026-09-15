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

  // Nach Navigation (z. B. von einer Unterseite) zum Anker scrollen
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    setMobileOpen(false);
    if (!href.startsWith("/#")) return;
    const id = href.slice(2);
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", href);
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`w-full border-b transition-all duration-500 ease-out ${
          transparent
            ? "bg-transparent border-transparent shadow-none"
            : "bg-white/90 backdrop-blur-xl border-border/50 shadow-soft"
        }`}
      >
        <div className="flex w-full items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16 py-3.5 sm:py-4">
          <Link
            to="/"
            onClick={(e) => {
              setMobileOpen(false);
              if (location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.replaceState(null, "", "/");
              }
            }}
            className="flex items-baseline gap-3 shrink-0"
            aria-label="Kereztour – zur Startseite"
          >
            <span
              className={`font-display text-[45px] leading-none tracking-tight transition-colors duration-700 ${
                transparent ? "text-white" : "text-primary"
              }`}
              style={transparent ? { textShadow: "0 1px 14px rgba(0,0,0,0.45)" } : undefined}
            >
              Kereztour
            </span>
            <span className="hidden sm:block text-[25px] uppercase tracking-[0.3em] font-semibold text-[hsl(var(--gold))]">
              Kirgisistan
            </span>
          </Link>

          <div className="hidden lg:flex flex-1 items-center justify-end pl-10 pr-10">
            <ul className="flex items-center gap-7 xl:gap-9">
              {navLinks.map((l) => (
                <li key={l.label} className="relative">
                  <Link
                    to={l.href}
                    onClick={(e) => handleNavClick(e, l.href)}
                    className={`whitespace-nowrap text-[19px] font-medium tracking-wide transition-colors duration-500 hover:text-[hsl(var(--gold))] ${
                      location.pathname === l.href
                        ? "text-[hsl(var(--gold))]"
                        : transparent
                          ? "text-white/90"
                          : "text-foreground/85"
                    }`}
                    style={
                      transparent && location.pathname !== l.href
                        ? { textShadow: "0 1px 10px rgba(0,0,0,0.5)" }
                        : undefined
                    }
                  >
                    {l.label}
                  </Link>
                  {l.label === "Nomaden 2026" && (
                    <span className="absolute -top-4 -right-4 rounded-full bg-[hsl(var(--gold))] px-2 py-0.5 text-[11px] font-bold text-[#062c26]">
                      Neu
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/buchen"
            className="hidden lg:flex group shrink-0 items-center gap-2 rounded-md border border-[hsl(var(--gold))] px-6 py-2.5 text-[19px] font-semibold text-[hsl(var(--gold))] transition-all duration-300 hover:bg-[hsl(var(--gold))] hover:text-[#062c26]"
          >
            <span>Anfrage senden</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <button
            className={`lg:hidden transition-colors duration-500 ${
              transparent ? "text-white" : "text-primary"
            }`}
            style={transparent ? { textShadow: "0 1px 10px rgba(0,0,0,0.5)" } : undefined}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-border/50">
            <ul className="flex flex-col px-6 py-3">
              {navLinks.map((l) => (
                <li key={l.label} className="border-b border-border/50 last:border-0">
                  <Link
                    to={l.href}
                    onClick={(e) => handleNavClick(e, l.href)}
                    className="block py-3.5 text-base font-medium text-foreground hover:text-[hsl(var(--gold))] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="px-6 pb-6 pt-4 flex flex-col gap-3">
              <Link
                to="/buchen"
                onClick={() => setMobileOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[hsl(var(--gold))] px-6 py-3 text-sm font-semibold text-[#062c26]"
              >
                Anfrage senden <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+393474867408"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground"
              >
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
