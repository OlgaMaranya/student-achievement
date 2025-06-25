
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Achievements from "./pages/Achievements";
import AddAchievement from "./pages/AddAchievement";
import Archive from "./pages/Archive";
import Recommendations from "./pages/Recommendations";
import Settings from "./pages/Settings";
import ApiTest from "./pages/ApiTest";
import NotFound from "./pages/NotFound";
import Tst from "./components/tst";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gray-50">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Home />} />
                <Route path="achievements" element={<Achievements />} />
                <Route path="add-achievement" element={<AddAchievement />} />
                <Route path="archive" element={<Archive />} />
                <Route path="recommendations" element={<Recommendations />} />
                <Route path="settings" element={<Settings />} />
                <Route path="api-test" element={<ApiTest />} />
                <Route path="tst" element={<Tst />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
