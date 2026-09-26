import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight, Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const travelLinks = [
  { label: "Kultur Tour", href: "/reisen/kultur" },
  { label: "Intensiv-Trekking", href: "/reisen/trekking" },
  { label: "Kyrchyn Tour", href: "/reisen/kyrchyn" },
];

const languages = [
  { code: "DE", label: "Deutsch" },
  { code: "EN", label: "English" },
  { code: "IT", label: "Italiano" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reisenOpen, setReisenOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHome = location.pathname === "/";
  const transparent = onHome && !scrolled && !mobileOpen;

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  const handleSectionClick = (e: React.MouseEvent, href: string) => {
    setMobileOpen(false);
    setLanguageOpen(false);
    if (!href.startsWith("/#")) return;

    const id = href.slice(2);
    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", href);
      }
    }
  };

  const handleTravelClick = () => {
    setReisenOpen(false);
    setMobileOpen(false);
    setLanguageOpen(false);
  };

  const selectLanguage = (code: string) => {
    setLanguageOpen(false);
    setLanguage(code as "DE" | "EN" | "IT");
  };

  const isTravelPage =
    location.pathname === "/reisen/kultur" ||
    location.pathname === "/reisen/trekking" ||
    location.pathname === "/reisen/kyrchyn";

  const languageMenu = (
    <div className="relative z-[200] shrink-0">
      <button
        type="button"
        onClick={() => {
          setReisenOpen(false);
          setLanguageOpen((open) => !open);
        }}
        className={`relative z-[201] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-transparent transition-colors ${
          transparent
            ? "text-white hover:bg-white/10 hover:border-white/20"
            : "text-foreground hover:bg-muted hover:border-border"
        }`}
        aria-label={t("Sprache auswählen")}
        aria-expanded={languageOpen}
        aria-haspopup="menu"
      >
        <Globe className="pointer-events-none h-5 w-5" strokeWidth={1.8} />
      </button>

      {languageOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[202] mt-2 w-40 rounded-lg border border-border bg-card p-1.5 shadow-xl"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="menuitem"
              onClick={() => selectLanguage(lang.code)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-muted hover:text-primary ${
                language === lang.code ? "bg-muted text-primary" : "text-foreground"
              }`}
            >
              <span>{lang.label}</span>
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">
                {lang.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`w-full border-b transition-all duration-500 ease-out ${
          transparent
            ? "bg-transparent border-transparent shadow-none"
            : "bg-card/95 backdrop-blur-xl border-border shadow-soft"
        }`}
      >
        <div className="container mx-auto flex w-full max-w-[1400px] items-center px-4 py-3 sm:px-6 sm:py-4">
          <Link
            to="/"
            onClick={(e) => {
              setMobileOpen(false);
              setReisenOpen(false);
              setLanguageOpen(false);
              if (location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.replaceState(null, "", "/");
              }
            }}
            className="flex shrink-0 flex-col items-start"
            aria-label="Kereztour – zur Startseite"
          >
            <span
              className={`font-display text-[32px] font-medium sm:text-[36px] lg:text-[40px] leading-none tracking-[0.01em] transition-colors duration-700 ${
                transparent ? "text-white" : "text-primary"
              }`}
              style={transparent ? { textShadow: "0 1px 14px rgba(0,0,0,0.45)" } : undefined}
            >
              Kereztour
            </span>
            <span className="mt-1.5 hidden text-[19px] font-semibold uppercase leading-none tracking-[0.3em] text-[hsl(var(--gold))] sm:block">
              Kirgisistan
            </span>
          </Link>

          <div className="ml-auto hidden items-center gap-7 lg:flex">
            <div className="flex items-center gap-7">
              <div
                className="relative"
                onMouseEnter={() => setReisenOpen(true)}
                onMouseLeave={() => setReisenOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setReisenOpen(!reisenOpen)}
                  className={`flex items-center gap-1.5 whitespace-nowrap text-[15px] font-medium tracking-wide transition-colors duration-500 ${
                    isTravelPage
                      ? "text-[hsl(var(--gold))]"
                      : transparent
                        ? "text-white/90"
                        : "text-foreground/85"
                  } hover:text-[hsl(var(--gold))]`}
                  style={transparent ? { textShadow: "0 1px 10px rgba(0,0,0,0.5)" } : undefined}
                  aria-expanded={reisenOpen}
                  aria-haspopup="true"
                >
                  {t("Reisen")}                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${reisenOpen ? "rotate-180" : ""}`} />
                </button>

                {reisenOpen && (
                  <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-4">
                    <div className="overflow-hidden rounded-sm border border-border/60 bg-card p-2 shadow-xl">
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
                          {t(link.label)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/#ueber-uns"
                onClick={(e) => handleSectionClick(e, "/#ueber-uns")}
                className={`whitespace-nowrap text-[17px] font-medium tracking-wide transition-colors duration-500 ${transparent ? "text-white/90" : "text-foreground/85"} hover:text-[hsl(var(--gold))]`}
                style={transparent ? { textShadow: "0 1px 10px rgba(0,0,0,0.5)" } : undefined}
              >
                {t("Über uns")}
              </Link>

              <Link
                to="/#kontakt"
                onClick={(e) => handleSectionClick(e, "/#kontakt")}
                className={`whitespace-nowrap text-[17px] font-medium tracking-wide transition-colors duration-500 ${transparent ? "text-white/90" : "text-foreground/85"} hover:text-[hsl(var(--gold))]`}
                style={transparent ? { textShadow: "0 1px 10px rgba(0,0,0,0.5)" } : undefined}
              >
                {t("Kontakt")}
              </Link>
            </div>

            {languageMenu}

            <Link
              to="/buchen"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[hsl(var(--gold))] px-5 py-2.5 text-sm font-semibold text-[#062c26] shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-md"
            >
              {t("Reise buchen")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            {languageMenu}
            <button
              className={`transition-colors duration-500 ${transparent ? "text-white" : "text-primary"}`}
              style={transparent ? { textShadow: "0 1px 10px rgba(0,0,0,0.5)" } : undefined}
              onClick={() => {
                setMobileOpen(!mobileOpen);
                setReisenOpen(false);
                setLanguageOpen(false);
              }}
              aria-label="Menü"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border/50 bg-card lg:hidden">
            <div className="px-6 py-3">
              <div className="border-b border-border/50">
                <button
                  type="button"
                  onClick={() => setReisenOpen(!reisenOpen)}
                  className="flex w-full items-center justify-between py-3.5 text-base font-medium text-foreground"
                >
                  <span>{t("Reisen")}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${reisenOpen ? "rotate-180" : ""}`} />
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
                        {t(link.label)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/#ueber-uns"
                onClick={(e) => handleSectionClick(e, "/#ueber-uns")}
                className="block border-b border-border/50 py-3.5 text-base font-medium text-foreground transition-colors hover:text-primary"
              >
                {t("Über uns")}              </Link>

              <Link
                to="/#kontakt"
                onClick={(e) => handleSectionClick(e, "/#kontakt")}
                className="block py-3.5 text-base font-medium text-foreground transition-colors hover:text-primary"
              >
                {t("Kontakt")}              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
