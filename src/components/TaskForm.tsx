import type { FormEvent } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { categories } from "../data/defaults";
import { today } from "../utils/dates";
import type { Task } from "../types/task";
type Props = {editorOpen: boolean; editingTask: Task | null; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void;};
export default function TaskForm({editorOpen, editingTask, onClose, onSubmit}: Props) {const saveTask = onSubmit; return (<>
      {editorOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <section
            className="task-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <div className="dialog-heading">
              <div>
                <span className="dialog-kicker">UM PASSO DE CADA VEZ</span>
                <h2 id="dialog-title">
                  {editingTask ? "Editar tarefa" : "Uma nova tarefa"}
                </h2>
              </div>
              <button
                className="icon-button"
                aria-label="Fechar"
                onClick={() => onClose()}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={saveTask}>
              <label className="form-label" htmlFor="task-title">
                O que você quer fazer?
              </label>
              <input
                id="task-title"
                name="title"
                className="form-input title-input"
                placeholder="Ex.: estudar um pouquinho"
                defaultValue={editingTask?.title ?? ""}
                autoFocus
                required
                maxLength={100}
              />
              <label className="form-label" htmlFor="task-notes">
                Uma nota para você <span>opcional</span>
              </label>
              <textarea
                id="task-notes"
                name="notes"
                className="form-input notes-input"
                placeholder="Algum detalhe que vale lembrar?"
                defaultValue={editingTask?.notes ?? ""}
                rows={3}
                maxLength={300}
              />
              <div className="form-grid">
                <div>
                  <label className="form-label" htmlFor="task-category">
                    Categoria
                  </label>
                  <div className="select-control">
                    <select
                      id="task-category"
                      name="category"
                      defaultValue={editingTask?.category ?? "Pessoal"}
                    >
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} />
                  </div>
                </div>
                <div>
                  <label className="form-label" htmlFor="task-priority">
                    Prioridade
                  </label>
                  <div className="select-control">
                    <select
                      id="task-priority"
                      name="priority"
                      defaultValue={editingTask?.priority ?? "Média"}
                    >
                      <option>Baixa</option>
                      <option>Média</option>
                      <option>Alta</option>
                    </select>
                    <ChevronDown size={15} />
                  </div>
                </div>
              </div>
              <label className="form-label" htmlFor="task-date">
                Quando? <span>opcional</span>
              </label>
              <input
                id="task-date"
                name="dueDate"
                className="form-input date-input"
                type="date"
                defaultValue={editingTask?.dueDate ?? today()}
              />
              <div className="dialog-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => onClose()}
                >
                  Deixar para depois
                </button>
                <button type="submit" className="primary-button">
                  <Plus size={16} />
                  {editingTask ? "Salvar mudanças" : "Adicionar tarefa"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
</>); }
