import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Reisen", href: "/#reisen" },
  { label: "Kultur Tour", href: "/reisen/kultur" },
  { label: "Trekking", href: "/reisen/trekking" },
  { label: "Kyrchyn Tour", href: "/reisen/kyrchyn" },
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

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  const onHome = location.pathname === "/";
  const transparent =
    onHome && !scrolled && !mobileOpen;

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.slice(1);

    const t = window.setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 80);

    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  const handleNavClick = (
    e: React.MouseEvent,
    href: string
  ) => {
    setMobileOpen(false);

    if (!href.startsWith("/#")) return;

    const id = href.slice(2);

    if (location.pathname === "/") {
      const el = document.getElementById(id);

      if (el) {
        e.preventDefault();

        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        window.history.replaceState(
          null,
          "",
          href
        );
      }
    }
  };

  const linkClass = (href: string) =>
    `whitespace-nowrap text-[17px] font-medium tracking-wide transition-colors duration-500 hover:text-[hsl(var(--gold))] ${
      location.pathname === href
        ? "text-[hsl(var(--gold))]"
        : transparent
          ? "text-white/90"
          : "text-foreground/85"
    }`;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">

      <nav
        className={`w-full border-b transition-all duration-500 ease-out ${
          transparent
            ? "bg-transparent border-transparent shadow-none"
            : "bg-white/90 backdrop-blur-xl border-border/50 shadow-soft"
        }`}
      >

        <div className="container mx-auto flex w-full max-w-[1600px] items-center px-6 py-3.5 sm:py-4">

          {/* LOGO */}
          <Link
            to="/"
            onClick={(e) => {
              setMobileOpen(false);

              if (location.pathname === "/") {
                e.preventDefault();

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });

                window.history.replaceState(
                  null,
                  "",
                  "/"
                );
              }
            }}
            className="flex shrink-0 flex-col items-start"
            aria-label="Kereztour – zur Startseite"
          >
            <span
              className={`font-display text-[45px] font-medium leading-none tracking-[0.01em] transition-colors duration-700 ${
                transparent
                  ? "text-white"
                  : "text-primary"
              }`}
              style={
                transparent
                  ? {
                      textShadow:
                        "0 1px 14px rgba(0,0,0,0.45)",
                    }
                  : undefined
              }
            >
              Kereztour
            </span>

            <span className="mt-2 hidden text-[25px] font-semibold uppercase leading-none tracking-[0.3em] text-[hsl(var(--gold))] sm:block">
              Kirgisistan
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="ml-auto hidden items-center gap-7 lg:flex">

            <ul className="flex items-center gap-5">
              {navLinks.map((link) => (
                <li
                  key={link.label}
                  className="relative"
                >
                  <Link
                    to={link.href}
                    onClick={(e) =>
                      handleNavClick(
                        e,
                        link.href
                      )
                    }
                    className={linkClass(
                      link.href
                    )}
                    style={
                      transparent
                        ? {
                            textShadow:
                              "0 1px 10px rgba(0,0,0,0.5)",
                          }
                        : undefined
                    }
                  >
                    {link.label}
                  </Link>

                  {link.label ===
                    "Nomaden 2026" && (
                    <span className="absolute -top-4 -right-4 rounded-full bg-[hsl(var(--gold))] px-2 py-0.5 text-[10px] font-bold text-[#062c26]">
                      Neu
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {/* BOOKING CTA */}
            <Link
              to="/buchen"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[hsl(var(--gold))] px-5 py-2.5 text-sm font-semibold text-[#062c26] shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-md"
            >
              Reise buchen
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className={`ml-auto lg:hidden transition-colors duration-500 ${
              transparent
                ? "text-white"
                : "text-primary"
            }`}
            style={
              transparent
                ? {
                    textShadow:
                      "0 1px 10px rgba(0,0,0,0.5)",
                  }
                : undefined
            }
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            aria-label="Menü"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>

        {/* MOBILE NAVIGATION */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border/50 bg-white">

            <ul className="flex flex-col px-6 py-3">

              {navLinks.map((link) => (
                <li
                  key={link.label}
                  className="border-b border-border/50 last:border-0"
                >
                  <Link
                    to={link.href}
                    onClick={(e) =>
                      handleNavClick(
                        e,
                        link.href
                      )
                    }
                    className="block py-3.5 text-base font-medium text-foreground transition-colors hover:text-[hsl(var(--gold))]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

            </ul>

            <div className="px-6 pb-6 pt-3">

              <Link
                to="/buchen"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--gold))] px-6 py-3.5 text-sm font-semibold text-[#062c26] shadow-sm"
              >
                Reise buchen
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

          </div>
        )}

      </nav>
    </div>
  );
};

export default Navbar;
