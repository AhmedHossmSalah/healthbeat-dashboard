import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Doctors from "./pages/Doctors";
import RiskAssessment from "./pages/RiskAssessment";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/risk-assessment" element={<RiskAssessment />} />
            <Route path="/contact" element={<Contact />} />
            {/* Placeholder routes - will be implemented later */}
            <Route path="/labs" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl">معامل التحاليل - قريباً</h1></div>} />
            <Route path="/consultations" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl">الاستشارات - قريباً</h1></div>} />
            <Route path="/profile" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl">البروفايل - قريباً</h1></div>} />
            <Route path="/schools-insurance" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl">المدارس والتأمين - قريباً</h1></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
