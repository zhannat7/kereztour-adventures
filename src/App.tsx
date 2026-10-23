import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Component, type ErrorInfo, type ReactNode, useEffect, lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index.tsx";
const Buchen = lazy(() => import("./pages/Buchen.tsx"));
const Zahlung = lazy(() => import("./pages/Zahlung.tsx"));
const Certificate = lazy(() => import("./pages/Certificate.tsx"));
const Impressum = lazy(() => import("./pages/Impressum.tsx"));
const Datenschutz = lazy(() => import("./pages/Datenschutz.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const Kultur = lazy(() => import("./pages/reisen/Kultur.tsx"));
const Trekking = lazy(() => import("./pages/reisen/Trekking.tsx"));

import { HelmetProvider } from "react-helmet-async";
import RouteSeo from "./components/RouteSeo";
import { LanguageProvider } from "@/i18n/LanguageContext";

const queryClient = new QueryClient();

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Kereztour app error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6">
          <div className="max-w-lg rounded-sm border border-border bg-card p-8 text-center shadow-lift">
            <h1 className="font-display text-3xl text-foreground">Kereztour</h1>
            <p className="mt-3 text-muted-foreground">
              Die Website konnte gerade nicht vollständig geladen werden.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground"
            >
              Website neu laden
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
};

const App = () => (
  <AppErrorBoundary>
    <LanguageProvider>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />

            <BrowserRouter>
              <ScrollToTop />
              <RouteSeo />
              <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/buchen" element={<Buchen />} />
                <Route path="/zahlung" element={<Zahlung />} />
                <Route path="/registrierung" element={<Certificate />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/datenschutz" element={<Datenschutz />} />
                <Route path="/admin" element={<Admin />} />

                <Route path="/reisen/kultur" element={<Kultur />} />
                <Route path="/reisen/trekking" element={<Trekking />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </LanguageProvider>
  </AppErrorBoundary>
);

export default App;
