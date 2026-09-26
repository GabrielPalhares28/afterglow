import { ArrowDownWideNarrow, ChevronDown, Filter, Search } from "lucide-react";
import { categories } from "../data/defaults";
import type { SortBy } from "../types/task";
type Props = {sortBy: SortBy; onSortChange: (value: SortBy) => void; query: string; onQueryChange: (value: string) => void; categoryFilter: string; onCategoryChange: (value: string) => void; visibleCount: number;};
export default function TaskFilters({ sortBy, onSortChange, query, onQueryChange, categoryFilter, onCategoryChange, visibleCount }: Props) { return (<>
                    <div className="section-heading">
                      <div>
                        <h2>Seu espaço de foco</h2>
                        <p>Escolha uma coisa. O resto pode esperar.</p>
                      </div>

                      <label className="sort-button">
                        <ArrowDownWideNarrow size={16} />

                        <select
                          aria-label="Organizar tarefas"
                          value={sortBy}
                          onChange={(event) =>
                            onSortChange(event.target.value as SortBy)
                          }
                        >
                          <option value="priority">Prioridade</option>
                          <option value="date">Data</option>
                          <option value="name">Nome</option>
                        </select>
                      </label>
                    </div>
                    <div className="filter-bar">
                      <label className="search-field">
                        <Search size={16} />
                        <input
                          aria-label="Buscar tarefas"
                          placeholder="Buscar uma tarefa..."
                          value={query}
                          onChange={(event) => onQueryChange(event.target.value)}
                        />
                        <kbd>/</kbd>
                      </label>
                      <label className="category-select-wrap">
                        <Filter size={15} />
                        <select
                          aria-label="Filtrar por categoria"
                          value={categoryFilter}
                          onChange={(event) =>
                            onCategoryChange(event.target.value)
                          }
                        >
                          <option>Todas as categorias</option>
                          {categories.map((category) => (
                            <option key={category}>{category}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} />
                      </label>
                      <span className="result-count">
                        {visibleCount}{" "}
                        {visibleCount === 1 ? "tarefa" : "tarefas"}
                      </span>
                    </div>

</>); }
