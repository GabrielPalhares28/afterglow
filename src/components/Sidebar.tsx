import { useNavigate, NavLink } from "react-router-dom";
import { CalendarDays, Check, ChevronDown, CircleCheck, CloudMoon, Coffee, LayoutDashboard, ListTodo, MoreHorizontal, Plus, Sparkles } from "lucide-react";
import type { Category, RoadmapItem, Task } from "../types/task";
import { today } from "../utils/dates";
type Props = { mobileNavOpen: boolean; onCloseMobileNav: () => void; tasks: Task[]; roadmap: RoadmapItem[]; categoryFilter: string; onCategoryChange: (category: Category) => void; onAddTask: () => void; onToggleRoadmap: (index: number) => void; };
export default function Sidebar({ mobileNavOpen, onCloseMobileNav, tasks, roadmap, categoryFilter, onCategoryChange, onAddTask, onToggleRoadmap }: Props) {
const navigate = useNavigate();
const completedCount = tasks.filter(task => task.completed).length;
const activeCount = tasks.length - completedCount;
const doneRoadmap = roadmap.filter(item => item.done).length;
const progress = Math.round((doneRoadmap / roadmap.length) * 100);
return (
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <NavLink
          className="brand"
          to="/today"
          onClick={() => onCloseMobileNav()}
        >
          <span className="brand-mark">
            <CloudMoon size={21} strokeWidth={1.8} />
          </span>
          <span>
            afterglow<span className="brand-period">.</span>
          </span>
        </NavLink>

        <div className="workspace-label">SEU ESPAÇO</div>
        <nav className="primary-nav" aria-label="Navegação principal">
          <NavLink
            to="/today"
            onClick={() => onCloseMobileNav()}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-active" : ""}`
            }
          >
            <LayoutDashboard size={17} />
            <span>Minhas tarefas</span>
            <span className="nav-count">{activeCount}</span>
          </NavLink>
          <NavLink
            to="/upcoming"
            onClick={() => onCloseMobileNav()}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-active" : ""}`
            }
          >
            <CalendarDays size={17} />
            <span>Vem por aí</span>
            <span className="nav-count">
              {
                tasks.filter(
                  (task) => !task.completed && task.dueDate > today(),
                ).length
              }
            </span>
          </NavLink>
          <NavLink
            to="/all"
            onClick={() => onCloseMobileNav()}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-active" : ""}`
            }
          >
            <ListTodo size={17} />
            <span>Todas as tarefas</span>
          </NavLink>
          <NavLink
            to="/completed"
            onClick={() => onCloseMobileNav()}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-active" : ""}`
            }
          >
            <CircleCheck size={17} />
            <span>Concluídas</span>
            <span className="nav-count">{completedCount}</span>
          </NavLink>
        </nav>

        <div className="sidebar-section-heading">
          <span>CATEGORIAS</span>
          <button
            className="icon-button tiny"
            aria-label="Adicionar tarefa"
            onClick={() => onAddTask()}
          >
            <Plus size={15} />
          </button>
        </div>
        <div className="category-list">
          <button
            className={`category-link ${categoryFilter === "Pessoal" ? "category-selected" : ""}`}
            onClick={() => {
              onCategoryChange("Pessoal");
              navigate("/all");
            }}
          >
            <span className="category-dot dot-lilac" />
            Pessoal
          </button>
          <button
            className={`category-link ${categoryFilter === "Trabalho" ? "category-selected" : ""}`}
            onClick={() => {
              onCategoryChange("Trabalho");
              navigate("/all");
            }}
          >
            <span className="category-dot dot-blue" />
            Trabalho
          </button>
          <button
            className={`category-link ${categoryFilter === "Estudos" ? "category-selected" : ""}`}
            onClick={() => {
              onCategoryChange("Estudos");
              navigate("/all");
            }}
          >
            <span className="category-dot dot-green" />
            Estudos
          </button>
          <button
            className={`category-link ${categoryFilter === "Bem-estar" ? "category-selected" : ""}`}
            onClick={() => {
              onCategoryChange("Bem-estar");
              navigate("/all");
            }}
          >
            <span className="category-dot dot-peach" />
            Bem-estar
          </button>
        </div>

        <details className="roadmap-panel" open>
          <summary>
            <span>
              <Sparkles size={15} /> Seu roadmap
            </span>
            <ChevronDown size={14} />
          </summary>
          <div className="roadmap-total">
            <strong>{progress}%</strong>
            <span>
              {doneRoadmap} de {roadmap.length} passos
            </span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="roadmap-phases">
            <div className="phase-label">
              FASE 1 · MVP{" "}
              <span>
                {roadmap.slice(0, 6).filter((item) => item.done).length}/6
              </span>
            </div>
            {roadmap.slice(0, 6).map((item, index) => (
              <button
                className={`roadmap-item ${item.done ? "roadmap-done" : ""}`}
                key={item.label}
                onClick={() => onToggleRoadmap(index)}
              >
                <span className="roadmap-check">
                  {item.done && <Check size={11} />}
                </span>
                {item.label}
              </button>
            ))}
            <div className="phase-label phase-next">
              FASE 2 · EVOLUÇÃO{" "}
              <span>
                {roadmap.slice(6, 9).filter((item) => item.done).length}/3
              </span>
            </div>
            {roadmap.slice(6, 9).map((item, index) => (
              <button
                className={`roadmap-item ${item.done ? "roadmap-done" : ""}`}
                key={item.label}
                onClick={() => onToggleRoadmap(index + 6)}
              >
                <span className="roadmap-check">
                  {item.done && <Check size={11} />}
                </span>
                {item.label}
              </button>
            ))}
            <div className="phase-label phase-next">
              FASE 3 · FULL-STACK{" "}
              <span>
                {roadmap.slice(9).filter((item) => item.done).length}/2
              </span>
            </div>
            {roadmap.slice(9).map((item, index) => (
              <button
                className={`roadmap-item ${item.done ? "roadmap-done" : ""}`}
                key={item.label}
                onClick={() => onToggleRoadmap(index + 9)}
              >
                <span className="roadmap-check">
                  {item.done && <Check size={11} />}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </details>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <Coffee size={17} />
            <span>Respira. Você está indo bem.</span>
          </div>
          <div className="profile-row">
            <div className="avatar">L</div>
            <div className="profile-copy">
              <strong>Seu cantinho</strong>
              <span>Um dia de cada vez</span>
            </div>
            <button className="icon-button tiny" aria-label="Mais opções">
              <MoreHorizontal size={17} />
            </button>
          </div>
        </div>
      </aside>

);
}
