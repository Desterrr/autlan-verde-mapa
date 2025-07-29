import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import RutasPage from "./pages/RutasPage";
import RecursosPage from "./pages/RecursosPage";
import ArticuloPage from "./pages/ArticuloPage";
import AcercaPage from "./pages/AcercaPage";
import ContactoPage from "./pages/ContactoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rutas" element={<RutasPage />} />
              <Route path="/recursos" element={<RecursosPage />} />
              <Route path="/recursos/articulo/:id" element={<ArticuloPage />} />
              <Route path="/acerca" element={<AcercaPage />} />
              <Route path="/contacto" element={<ContactoPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
