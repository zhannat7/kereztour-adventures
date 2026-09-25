import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index.tsx";
import Buchen from "./pages/Buchen.tsx";
import Zahlung from "./pages/Zahlung.tsx";
import Certificate from "./pages/Certificate.tsx";
import Impressum from "./pages/Impressum.tsx";
import Admin from "./pages/Admin.tsx";

import Nomaden from "./pages/reisen/Nomaden.tsx";
import Kultur from "./pages/reisen/Kultur.tsx";
import Trekking from "./pages/reisen/Trekking.tsx";
import Kyrchyn from "./pages/reisen/Kyrchyn.tsx";

import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

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
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/buchen" element={<Buchen />} />
          <Route path="/zahlung" element={<Zahlung />} />
          <Route path="/registrierung" element={<Certificate />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="/reisen/nomaden" element={<Nomaden />} />
          <Route path="/reisen/kultur" element={<Kultur />} />
          <Route path="/reisen/trekking" element={<Trekking />} />
          <Route path="/reisen/kyrchyn" element={<Kyrchyn />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
