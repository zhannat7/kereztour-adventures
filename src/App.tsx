import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Buchen from "./pages/Buchen.tsx";
import Zahlung from "./pages/Zahlung.tsx";
import Nomaden from "./pages/reisen/Nomaden.tsx";
import Kultur from "./pages/reisen/Kultur.tsx";
import Trekking from "./pages/reisen/Trekking.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/buchen" element={<Buchen />} />
          <Route path="/zahlung" element={<Zahlung />} />
          <Route path="/reisen/nomaden" element={<Nomaden />} />
          <Route path="/reisen/kultur" element={<Kultur />} />
          <Route path="/reisen/trekking" element={<Trekking />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
