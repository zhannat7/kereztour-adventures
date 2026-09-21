import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";

const travelLinks = [
  {
    label: "Kultur Tour",
    href: "/reisen/kultur",
  },
  {
    label: "Intensiv-Trekking",
    href: "/reisen/trekking",
  },
  {
    label: "Kyrchyn Tour",
    href: "/reisen/kyrchyn",
  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reisenOpen, setReisenOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
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

  const handleSectionClick = (
    e: React.MouseEvent,
    href: string
  ) => {
    setMobileOpen(false);

    if (!href.startsWith("/#")) return;

    const id = href.slice(2);

    if (location.pathname === "/") {
      const element = document.getElementById(id);

      if (element) {
        e.preventDefault();

        element.scrollIntoView({
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

  const handleTravelClick = () => {
    setReisenOpen(false);
    setMobileOpen(false);
  };

  const isTravelPage =
    location.pathname === "/reisen/kultur" ||
    location.pathname === "/reisen/trekking" ||
    location.pathname === "/reisen/kyrchyn";

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
              setReisenOpen(false);

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
          <div className="ml-auto hidden items-center gap-8 lg:flex">

            <div className="flex items-center gap-7">

              {/* REISEN DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={() => setReisenOpen(true)}
                onMouseLeave={() => setReisenOpen(false)}
              >
                <button
                  type="button"
                  onClick={() =>
                    setReisenOpen(!reisenOpen)
                  }
                  className={`flex items-center gap-1.5 whitespace-nowrap text-[17px] font-medium tracking-wide transition-colors duration-500 ${
                    isTravelPage
                      ? "text-[hsl(var(--gold))]"
                      : transparent
                        ? "text-white/90"
                        : "text-foreground/85"
                  } hover:text-[hsl(var(--gold))]`}
                  style={
                    transparent
                      ? {
                          textShadow:
                            "0 1px 10px rgba(0,0,0,0.5)",
                        }
                      : undefined
                  }
                  aria-expanded={reisenOpen}
                  aria-haspopup="true"
                >
                  Reisen
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      reisenOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {/* DROPDOWN */}
                {reisenOpen && (
                  <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-4">
                    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white p-2 shadow-xl">

                      {travelLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={handleTravelClick}
                          className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                            location.pathname === link.href
                              ? "bg-muted text-primary"
                              : "text-foreground hover:bg-muted hover:text-primary"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}

                    </div>
                  </div>
                )}
              </div>

              {/* ÜBER UNS */}
              <Link
                to="/#ueber-uns"
                onClick={(e) =>
                  handleSectionClick(
                    e,
                    "/#ueber-uns"
                  )
                }
                className={`whitespace-nowrap text-[17px] font-medium tracking-wide transition-colors duration-500 ${
                  transparent
                    ? "text-white/90"
                    : "text-foreground/85"
                } hover:text-[hsl(var(--gold))]`}
                style={
                  transparent
                    ? {
                        textShadow:
                          "0 1px 10px rgba(0,0,0,0.5)",
                      }
                    : undefined
                }
              >
                Über uns
              </Link>

              {/* KONTAKT */}
              <Link
                to="/#kontakt"
                onClick={(e) =>
                  handleSectionClick(
                    e,
                    "/#kontakt"
                  )
                }
                className={`whitespace-nowrap text-[17px] font-medium tracking-wide transition-colors duration-500 ${
                  transparent
                    ? "text-white/90"
                    : "text-foreground/85"
                } hover:text-[hsl(var(--gold))]`}
                style={
                  transparent
                    ? {
                        textShadow:
                          "0 1px 10px rgba(0,0,0,0.5)",
                      }
                    : undefined
                }
              >
                Kontakt
              </Link>

            </div>

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
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setReisenOpen(false);
            }}
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

            <div className="px-6 py-3">

              {/* REISEN */}
              <div className="border-b border-border/50">

                <button
                  type="button"
                  onClick={() =>
                    setReisenOpen(!reisenOpen)
                  }
                  className="flex w-full items-center justify-between py-3.5 text-base font-medium text-foreground"
                >
                  <span>Reisen</span>

                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      reisenOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {reisenOpen && (
                  <div className="pb-3 pl-3">

                    {travelLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={handleTravelClick}
                        className="block py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ))}

                  </div>
                )}

              </div>

              {/* ÜBER UNS */}
              <Link
                to="/#ueber-uns"
                onClick={(e) =>
                  handleSectionClick(
                    e,
                    "/#ueber-uns"
                  )
                }
                className="block border-b border-border/50 py-3.5 text-base font-medium text-foreground transition-colors hover:text-primary"
              >
                Über uns
              </Link>

              {/* KONTAKT */}
              <Link
                to="/#kontakt"
                onClick={(e) =>
                  handleSectionClick(
                    e,
                    "/#kontakt"
                  )
                }
                className="block py-3.5 text-base font-medium text-foreground transition-colors hover:text-primary"
              >
                Kontakt
              </Link>

            </div>

            {/* MOBILE BOOKING CTA */}
            <div className="px-6 pb-6 pt-3">
              <Link
                to="/buchen"
                onClick={() => {
                  setMobileOpen(false);
                  setReisenOpen(false);
                }}
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
