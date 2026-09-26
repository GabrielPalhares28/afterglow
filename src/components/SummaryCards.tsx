import { CheckCheck, Clock3, Sparkles } from "lucide-react";
import type { Task } from "../types/task";
import { today } from "../utils/dates";
export default function SummaryCards({ tasks }: {tasks: Task[]}) {
const completedCount = tasks.filter(task => task.completed).length;
const activeCount = tasks.length - completedCount;
return (
                  <section
                    className="summary-grid"
                    aria-label="Resumo das tarefas"
                  >
                    <div className="summary-card summary-focus">
                      <div className="summary-icon">
                        <Sparkles size={17} />
                      </div>
                      <span className="summary-label">Para hoje</span>
                      <strong>
                        {
                          tasks.filter(
                            (task) =>
                              !task.completed &&
                              (!task.dueDate || task.dueDate <= today()),
                          ).length
                        }
                        <small> tarefas</small>
                      </strong>
                      <span className="summary-foot">
                        pequenos passos, grandes coisas
                      </span>
                    </div>
                    <div className="summary-card">
                      <div className="summary-icon icon-mint">
                        <CheckCheck size={17} />
                      </div>
                      <span className="summary-label">Já concluídas</span>
                      <strong>
                        {completedCount}
                        <small> tarefas</small>
                      </strong>
                      <span className="summary-foot">você está no caminho</span>
                    </div>
                    <div className="summary-card">
                      <div className="summary-icon icon-blue">
                        <Clock3 size={17} />
                      </div>
                      <span className="summary-label">Ainda em aberto</span>
                      <strong>
                        {activeCount}
                        <small> tarefas</small>
                      </strong>
                      <span className="summary-foot">
                        sem pressa, no seu ritmo
                      </span>
                    </div>
                  </section>

); }
