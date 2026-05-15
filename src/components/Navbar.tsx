import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, Globe } from "lucide-react";

const navLinks = [
  { label: "Startseite", href: "/" },
  { label: "Kultur Tour", href: "/reisen/kultur" },
  { label: "Trekking", href: "/reisen/trekking" },
  { label: "Nomaden 2026", href: "/reisen/nomaden" },
  { label: "Kontakt", href: "/#kontakt" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-card/90 backdrop-blur-xl shadow-[0_1px_0_0_hsl(var(--border))]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-5 md:py-6">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl md:text-3xl text-primary tracking-tight">
          Kereztour
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.href}
                  className={`font-body text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-primary ${
                    location.pathname === l.href
                      ? "text-primary"
                      : scrolled
                      ? "text-foreground"
                      : "text-white/85"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Sprachumschalter */}
          <div className="flex items-center gap-1">
            <Globe
              className="h-4 w-4 mr-1"
              style={{ color: scrolled ? "hsl(var(--foreground))" : "rgba(255,255,255,0.7)" }}
            />
            {["DE", "EN", "IT"].map((lang, i) => (
              <span key={lang} className="flex items-center">
                <button
                  className={`text-xs font-semibold px-1 transition-colors hover:text-primary ${
                    lang === "DE"
                      ? "text-primary"
                      : scrolled
                      ? "text-foreground/50"
                      : "text-white/50"
                  }`}
                >
                  {lang}
                </button>
                {i < 2 && (
                  <span className={scrolled ? "text-border text-xs" : "text-white/30 text-xs"}>
                    |
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Buchen Button */}
          <Link
            to="/buchen"
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-secondary-foreground shadow-lg hover:shadow-secondary/40 transition-all duration-300 hover:scale-105"
          >
            Jetzt buchen <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü"
          style={{ color: scrolled ? "hsl(var(--foreground))" : "#fff" }}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card/98 backdrop-blur-xl border-t border-border">
          <ul className="flex flex-col items-center gap-5 py-8">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-body text-base font-semibold transition-colors hover:text-primary ${
                    location.pathname === l.href ? "text-primary" : "text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/buchen"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground"
              >
                Jetzt buchen <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <Globe className="h-4 w-4 text-muted-foreground mr-1" />
              {["DE", "EN", "IT"].map((lang, i) => (
                <span key={lang} className="flex items-center">
                  <button className={`text-xs font-semibold px-1 ${lang === "DE" ? "text-primary" : "text-muted-foreground"}`}>
                    {lang}
                  </button>
                  {i < 2 && <span className="text-border text-xs">|</span>}
                </span>
              ))}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
