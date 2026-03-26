import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:py-5">
        <Link to="/" className="font-display text-2xl font-bold text-primary">
          Kereztour
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <li key={l.label}>
              {l.isRoute ? (
                <Link
                  to={l.href}
                  className="font-body text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  href={l.href}
                  onClick={() => handleHashClick(l.href)}
                  className="font-body text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {l.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-md border-t border-border pb-4">
          <ul className="flex flex-col items-center gap-4 pt-4">
            {navLinks.map((l) => (
              <li key={l.label}>
                {l.isRoute ? (
                  <Link
                    to={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-body text-base font-medium text-foreground/80 hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    href={l.href}
                    onClick={() => handleHashClick(l.href)}
                    className="font-body text-base font-medium text-foreground/80 hover:text-primary transition-colors"
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
