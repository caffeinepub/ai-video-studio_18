import { Film, FolderOpen, Home, Wifi, WifiOff, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { AppPage } from "../App";

interface NavigationProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  isOnlineMode: boolean;
  onToggleMode: () => void;
}

export default function Navigation({
  currentPage,
  onNavigate,
  isOnlineMode,
  onToggleMode,
}: NavigationProps) {
  const navItems: { id: AppPage; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
    { id: "create", label: "Create", icon: <Zap className="w-4 h-4" /> },
    {
      id: "projects",
      label: "Projects",
      icon: <FolderOpen className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            data-ocid="nav.home_link"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
              }}
            >
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight gradient-text hidden sm:block">
              AI Video Studio
            </span>
          </button>

          {/* Nav Links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => onNavigate(item.id)}
                data-ocid={`nav.${item.id}_link`}
                className={`
                  relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                  ${
                    currentPage === item.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }
                `}
              >
                {currentPage === item.id && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-md"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.72 0.22 210 / 0.15), oklch(0.62 0.28 295 / 0.15))",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{item.icon}</span>
                <span className="relative hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Mode Toggle */}
          <button
            type="button"
            onClick={onToggleMode}
            data-ocid="home.mode_toggle"
            className={`
              flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              ${
                isOnlineMode
                  ? "border-neon-cyan/40 text-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/20"
                  : "border-border text-muted-foreground bg-muted/30 hover:bg-muted/50"
              }
            `}
          >
            {isOnlineMode ? (
              <>
                <Wifi className="w-3 h-3" />
                <span className="hidden sm:inline">Advanced AI</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                <span className="hidden sm:inline">Basic Offline</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
