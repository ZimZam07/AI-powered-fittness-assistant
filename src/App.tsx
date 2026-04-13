import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Auth from "./pages/Auth";
import CreateAccount from "./pages/CreateAccount";
import Index from "./pages/Index";
import FitnessReport from "./pages/FitnessReport";
import DailyLog from "./pages/DailyLog";
import MLModels from "./pages/MLModels";
import Clustering from "./pages/Clustering";
import QuickAssistant from "./pages/QuickAssistant";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { session, profile, loading } = useAuth();
  const [page, setPage] = useState<"login" | "signup">("login");
  const [successMessage, setSuccessMessage] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session || !profile) {
    if (page === "signup") {
      return (
        <CreateAccount
          onSwitchToLogin={(msg) => {
            setSuccessMessage(msg || "");
            setPage("login");
          }}
        />
      );
    }
    return (
      <Auth
        onSwitchToSignup={() => { setSuccessMessage(""); setPage("signup"); }}
        successMessage={successMessage}
      />
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/report" element={<FitnessReport />} />
        <Route path="/daily-log" element={<DailyLog />} />
        <Route path="/ml-models" element={<MLModels />} />
        <Route path="/clustering" element={<Clustering />} />
        <Route path="/assistant" element={<QuickAssistant />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
