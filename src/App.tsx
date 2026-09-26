import { useEffect, useState, type FormEvent } from "react";
import { FolderHeart, Moon, Plus, Sparkles, X } from "lucide-react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { SortBy, Task, RoadmapItem } from "./types/task";
import { defaultTasks, defaultRoadmap, priorityOrder } from "./data/defaults";
import { today } from "./utils/dates";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import SummaryCards from "./components/SummaryCards";
import TaskFilters from "./components/TaskFilters";
import TaskCard from "./components/TaskCard";
import TaskForm from "./components/TaskForm";

function App() {
  const [sortBy, setSortBy] = useState<SortBy>("priority");
  const location = useLocation();
  const [tasks, setTasks] = useLocalStorage<Task[]>("afterglow-tasks", defaultTasks);
  const [theme, setTheme] = useLocalStorage<"midnight" | "daylight">("afterglow-theme", "midnight");
  const [roadmap, setRoadmap] = useLocalStorage<RoadmapItem[]>("afterglow-roadmap", defaultRoadmap);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas as categorias");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [menuTask, setMenuTask] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  const path = location.pathname;

  const visibleTasks = tasks
    .filter((task) => {
      if (path === "/completed") return task.completed;
      if (path === "/upcoming")
        return !task.completed && task.dueDate > today();
      if (path === "/all") return true;
      return !task.completed && (!task.dueDate || task.dueDate <= today());
    })
    .filter(
      (task) =>
        categoryFilter === "Todas as categorias" ||
        task.category === categoryFilter,
    )
    .filter((task) =>
      `${task.title} ${task.notes} ${task.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort((a, b) => {
      const completedDifference = Number(a.completed) - Number(b.completed);

      if (completedDifference !== 0) {
        return completedDifference;
      }

      if (sortBy === "date") {
        return (a.dueDate || "9999-12-31").localeCompare(
          b.dueDate || "9999-12-31",
        );
      }

      if (sortBy === "name") {
        return a.title.localeCompare(b.title, "pt-BR");
      }

      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const viewTitle =
    path === "/completed"
      ? "Feitas com calma"
      : path === "/upcoming"
        ? "Vem por aí"
        : path === "/all"
          ? "Todas as tarefas"
          : "Minhas tarefas";
  const viewSubtitle =
    path === "/completed"
      ? "Olha só tudo o que você já tirou do caminho."
      : path === "/upcoming"
        ? "Um passo de cada vez. O futuro pode esperar um pouquinho."
        : "Um passo de cada vez já é um bom começo.";

  function openEditor(task?: Task) {
    setEditingTask(task ?? null);
    setEditorOpen(true);
    setMenuTask(null);
  }

  function saveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title")).trim();
    if (!title) return;
    const task: Task = {
      id:
        editingTask?.id ??
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      notes: String(form.get("notes")).trim(),
      category: form.get("category") as Category,
      priority: form.get("priority") as Priority,
      dueDate: String(form.get("dueDate")),
      completed: editingTask?.completed ?? false,
    };
    setTasks((current) =>
      editingTask
        ? current.map((item) => (item.id === editingTask.id ? task : item))
        : [task, ...current],
    );
    setEditorOpen(false);
    setEditingTask(null);
  }

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
    setMenuTask(null);
  }

  function toggleRoadmap(index: number) {
    setRoadmap((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, done: !item.done } : item,
      ),
    );
  }

  return (
    <div className="app-shell">
      <Sidebar mobileNavOpen={mobileNavOpen} onCloseMobileNav={() => setMobileNavOpen(false)} tasks={tasks} roadmap={roadmap} categoryFilter={categoryFilter} onCategoryChange={setCategoryFilter} onAddTask={() => openEditor()} onToggleRoadmap={toggleRoadmap} />

      {mobileNavOpen && (
        <button
          className="mobile-scrim"
          aria-label="Fechar navegação"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <main className="main-content">
        <Topbar viewTitle={viewTitle} theme={theme} onToggleTheme={() => setTheme(theme === "midnight" ? "daylight" : "midnight")} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <div className="page-wrap">
          <Routes>
            <Route path="/" element={<Navigate to="/today" replace />} />
            <Route
              path="*"
              element={
                <>
                  <section className="welcome-row">
                    <div>
                      <div className="eyebrow">
                        <span className="eyebrow-sparkle">✳</span> UM RESPIRO NO
                        MEIO DO DIA
                      </div>
                      <h1>
                        {viewTitle}
                        <span className="title-period">.</span>
                      </h1>
                      <p className="welcome-copy">{viewSubtitle}</p>
                    </div>
                    <button
                      className="primary-button"
                      onClick={() => openEditor()}
                    >
                      <Plus size={17} />
                      Nova tarefa
                    </button>
                  </section>

                  <SummaryCards tasks={tasks} />

                  <section className="tasks-section">
                    <TaskFilters sortBy={sortBy} onSortChange={setSortBy} query={query} onQueryChange={setQuery} categoryFilter={categoryFilter} onCategoryChange={setCategoryFilter} visibleCount={visibleTasks.length} />
                    <div className="task-list">
                      {visibleTasks.map((task) => (
                        <TaskCard key={task.id} task={task} menuTask={menuTask} onToggle={toggleTask} onEdit={openEditor} onDelete={deleteTask} onMenuChange={setMenuTask} />
                      ))}
                      {visibleTasks.length === 0 && (
                        <div className="empty-state">
                          <span className="empty-icon">
                            <FolderHeart size={24} />
                          </span>
                          <strong>Nenhuma tarefa por aqui</strong>
                          <p>
                            {query
                              ? "Tente buscar por outro termo."
                              : "Esse espaço está livre. Aproveite o respiro ou adicione uma tarefa."}
                          </p>
                          {!query && (
                            <button
                              className="text-button"
                              onClick={() => openEditor()}
                            >
                              <Plus size={15} />
                              Criar uma tarefa
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    {visibleTasks.length > 0 && (
                      <div className="list-footer">
                        <span>
                          <span className="footer-spark">✳</span> Você não
                          precisa fazer tudo hoje.
                        </span>
                        <button
                          onClick={() => {
                            setCategoryFilter("Todas as categorias");
                            setQuery("");
                          }}
                        >
                          Limpar filtros <X size={13} />
                        </button>
                      </div>
                    )}
                  </section>

                  <footer className="page-footer">
                    <span>feito com cuidado, no seu ritmo</span>
                    <span className="footer-moon">
                      <Moon size={13} /> afterglow
                    </span>
                  </footer>
                </>
              }
            />
          </Routes>
        </div>
      </main>

      <TaskForm editorOpen={editorOpen} editingTask={editingTask} onClose={() => setEditorOpen(false)} onSubmit={saveTask} />
    </div>
  );
}

export default App;
