import { CalendarDays, Check, Circle, MoreHorizontal, Pencil, Tag, Trash2 } from "lucide-react";
import type { Task } from "../types/task";
import { today, formatDate } from "../utils/dates";
type Props = {task: Task; menuTask: string | null; onToggle: (id: string) => void; onEdit: (task: Task) => void; onDelete: (id: string) => void; onMenuChange: (id: string | null) => void;};
export default function TaskCard({task, menuTask, onToggle, onEdit, onDelete, onMenuChange}: Props) {
const toggleTask = onToggle, openEditor = onEdit, deleteTask = onDelete, setMenuTask = onMenuChange;
return (
                        <article
                          className={`task-row ${task.completed ? "task-completed" : ""}`}
                          key={task.id}
                        >
                          <button
                            className={`task-check ${task.completed ? "task-check-done" : ""}`}
                            aria-label={
                              task.completed
                                ? `Marcar ${task.title} como pendente`
                                : `Marcar ${task.title} como concluída`
                            }
                            onClick={() => toggleTask(task.id)}
                          >
                            {task.completed ? (
                              <Check size={14} />
                            ) : (
                              <Circle size={18} />
                            )}
                          </button>
                          <div className="task-main">
                            <button
                              className="task-title"
                              onClick={() => openEditor(task)}
                            >
                              {task.title}
                            </button>
                            {task.notes && (
                              <p className="task-notes">{task.notes}</p>
                            )}
                            <div className="task-meta">
                              <span
                                className={`category-tag tag-${task.category.toLowerCase().replace("-", "")}`}
                              >
                                <Tag size={11} />
                                {task.category}
                              </span>
                              <span
                                className={`priority-tag priority-${task.priority.toLowerCase()}`}
                              >
                                <span />
                                {task.priority}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`due-date ${task.dueDate === today() && !task.completed ? "due-today" : ""}`}
                          >
                            <CalendarDays size={14} />
                            {formatDate(task.dueDate)}
                          </div>
                          <div className="task-actions">
                            <button
                              className="icon-button"
                              aria-label={`Editar ${task.title}`}
                              onClick={() => openEditor(task)}
                            >
                              <Pencil size={15} />
                            </button>
                            <div className="task-menu-wrap">
                              <button
                                className="icon-button"
                                aria-label={`Opções de ${task.title}`}
                                onClick={() =>
                                  setMenuTask(
                                    menuTask === task.id ? null : task.id,
                                  )
                                }
                              >
                                <MoreHorizontal size={17} />
                              </button>
                              {menuTask === task.id && (
                                <div className="task-menu">
                                  <button onClick={() => openEditor(task)}>
                                    <Pencil size={14} />
                                    Editar tarefa
                                  </button>
                                  <button
                                    className="delete-action"
                                    onClick={() => deleteTask(task.id)}
                                  >
                                    <Trash2 size={14} />
                                    Excluir tarefa
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </article>
); }
