import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Navigation from "./components/Navigation";
import CreateWizard from "./pages/CreateWizard";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";

export type AppPage = "home" | "create" | "projects";

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>("home");
  const [isOnlineMode, setIsOnlineMode] = useState(true);

  const navigate = (page: AppPage) => setCurrentPage(page);

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <Navigation
        currentPage={currentPage}
        onNavigate={navigate}
        isOnlineMode={isOnlineMode}
        onToggleMode={() => setIsOnlineMode((v) => !v)}
      />

      <main className="flex-1">
        {currentPage === "home" && (
          <HomePage
            onCreateClick={() => navigate("create")}
            isOnlineMode={isOnlineMode}
            onToggleMode={() => setIsOnlineMode((v) => !v)}
          />
        )}
        {currentPage === "create" && (
          <CreateWizard
            isOnlineMode={isOnlineMode}
            onDone={() => navigate("projects")}
            onCancel={() => navigate("home")}
          />
        )}
        {currentPage === "projects" && (
          <ProjectsPage onCreateNew={() => navigate("create")} />
        )}
      </main>

      <Toaster position="bottom-center" />
    </div>
  );
}
