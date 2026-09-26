import { CalendarDays, Command, Moon, Sun } from "lucide-react";
type Props = { viewTitle: string; theme: "midnight" | "daylight"; onToggleTheme: () => void; onOpenMobileNav: () => void; };
export default function Topbar({ viewTitle, theme, onToggleTheme, onOpenMobileNav }: Props) { return (
        <header className="topbar">
          <button
            className="mobile-menu icon-button"
            aria-label="Abrir navegação"
            onClick={() => onOpenMobileNav()}
          >
            <Command size={19} />
          </button>
          <div className="breadcrumb">
            <span>Seu espaço</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{viewTitle}</strong>
          </div>
          <div className="topbar-actions">
            <button
              className="theme-switch"
              onClick={() =>
                onToggleTheme()
              }
              aria-label={
                theme === "midnight"
                  ? "Ativar tema claro"
                  : "Ativar tema escuro"
              }
              title={
                theme === "midnight"
                  ? "Ativar tema claro"
                  : "Ativar tema escuro"
              }
            >
              <span
                className={
                  theme === "daylight"
                    ? "switch-thumb switch-right"
                    : "switch-thumb"
                }
              />
              {theme === "midnight" ? <Moon size={14} /> : <Sun size={14} />}
            </button>
            <div className="date-chip">
              <CalendarDays size={15} />
              <span>
                {new Intl.DateTimeFormat("pt-BR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                }).format(new Date())}
              </span>
            </div>
          </div>
        </header>

); }
