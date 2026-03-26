import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Reiseplan", href: "#reiseplan", isRoute: false },
  { label: "Preise", href: "#preise", isRoute: false },
  { label: "Buchen", href: "/buchen", isRoute: true },
  { label: "Kontakt", href: "#kontakt", isRoute: false },
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

  const handleHashClick = (href: string) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      window.location.href = "/" + href;
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-card/90 backdrop-blur-xl shadow-[0_1px_0_0_hsl(var(--border))]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-5 md:py-6">
        <Link to="/" className="font-display text-2xl md:text-3xl text-primary tracking-tight">
          Kereztour
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navLinks.filter(l => !l.isRoute).map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => handleHashClick(l.href)}
                  className="font-body text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-primary"
                  style={{ color: scrolled ? "hsl(var(--foreground))" : "hsla(0,0%,100%,0.85)" }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            to="/buchen"
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-secondary-foreground shadow-lg shadow-secondary/25 hover:shadow-secondary/40 transition-all duration-300 hover:scale-105"
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
        <div className="md:hidden bg-card/98 backdrop-blur-xl border-t border-border animate-fade-in">
          <ul className="flex flex-col items-center gap-6 py-8">
            {navLinks.map((l) => (
              <li key={l.label}>
                {l.isRoute ? (
                  <Link
                    to={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-body text-base font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    href={l.href}
                    onClick={() => handleHashClick(l.href)}
                    className="font-body text-base font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
