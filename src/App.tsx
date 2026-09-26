import { useEffect, useState, type FormEvent } from 'react'
import {
  ArrowDownWideNarrow,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  Circle,
  CircleCheck,
  Clock3,
  CloudMoon,
  Coffee,
  Command,
  Filter,
  FolderHeart,
  LayoutDashboard,
  ListTodo,
  Moon,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Sun,
  Tag,
  Trash2,
  X,
} from 'lucide-react'
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

type Priority = 'Baixa' | 'Média' | 'Alta'
type Category = 'Pessoal' | 'Trabalho' | 'Estudos' | 'Bem-estar'
type Task = {
  id: string
  title: string
  notes: string
  category: Category
  priority: Priority
  dueDate: string
  completed: boolean
}
type RoadmapItem = { label: string; done: boolean }

const categories: Category[] = ['Pessoal', 'Trabalho', 'Estudos', 'Bem-estar']
const priorityOrder: Record<Priority, number> = { Alta: 0, Média: 1, Baixa: 2 }
const localDateString = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const today = () => localDateString(new Date())
const dateOffset = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return localDateString(date)
}

const defaultTasks: Task[] = [
  { id: 'task-1', title: 'Revisar os componentes de React', notes: 'Uma coisa de cada vez, sem pressa.', category: 'Estudos', priority: 'Alta', dueDate: today(), completed: false },
  { id: 'task-2', title: 'Responder às mensagens da equipe', notes: '', category: 'Trabalho', priority: 'Média', dueDate: today(), completed: false },
  { id: 'task-3', title: 'Separar um tempo para ler', notes: 'Pelo menos 20 páginas antes de dormir.', category: 'Pessoal', priority: 'Baixa', dueDate: dateOffset(1), completed: false },
  { id: 'task-4', title: 'Fazer uma pausa para caminhar', notes: '', category: 'Bem-estar', priority: 'Baixa', dueDate: today(), completed: true },
]

const defaultRoadmap = [
  { label: 'Criar, editar e excluir tarefas', done: true },
  { label: 'Marcar tarefas como concluídas', done: true },
  { label: 'Prioridades e categorias', done: true },
  { label: 'Filtros e pesquisa', done: true },
  { label: 'Salvar no LocalStorage', done: true },
  { label: 'Alternar tema claro e escuro', done: true },
  { label: 'Datas de vencimento e calendário', done: true },
  { label: 'Arrastar tarefas entre colunas', done: false },
  { label: 'Estatísticas e gráficos', done: false },
  { label: 'API e autenticação', done: false },
  { label: 'Sincronização entre dispositivos', done: false },
]

function readStorage<T,>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) as T : fallback
  } catch {
    return fallback
  }
}

function formatDate(value: string) {
  if (!value) return 'Sem data'
  const date = new Date(`${value}T12:00:00`)
  if (value === today()) return 'Hoje'
  if (value === dateOffset(1)) return 'Amanhã'
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(date)
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>(() => readStorage('afterglow-tasks', defaultTasks))
  const [theme, setTheme] = useState<'midnight' | 'daylight'>(() => readStorage('afterglow-theme', 'midnight'))
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>(() => readStorage('afterglow-roadmap', defaultRoadmap))
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todas as categorias')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [menuTask, setMenuTask] = useState<string | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('afterglow-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('afterglow-theme', JSON.stringify(theme))
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    localStorage.setItem('afterglow-roadmap', JSON.stringify(roadmap))
  }, [roadmap])

  const completedCount = tasks.filter((task) => task.completed).length
  const activeCount = tasks.length - completedCount
  const doneRoadmap = roadmap.filter((item) => item.done).length
  const progress = Math.round((doneRoadmap / roadmap.length) * 100)
  const path = location.pathname

  const visibleTasks = tasks
    .filter((task) => {
      if (path === '/completed') return task.completed
      if (path === '/upcoming') return !task.completed && task.dueDate > today()
      if (path === '/all') return true
      return !task.completed && (!task.dueDate || task.dueDate <= today())
    })
    .filter((task) => categoryFilter === 'Todas as categorias' || task.category === categoryFilter)
    .filter((task) => `${task.title} ${task.notes} ${task.category}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => Number(a.completed) - Number(b.completed) || priorityOrder[a.priority] - priorityOrder[b.priority])

  const viewTitle = path === '/completed' ? 'Feitas com calma' : path === '/upcoming' ? 'Vem por aí' : path === '/all' ? 'Todas as tarefas' : 'Minhas tarefas'
  const viewSubtitle = path === '/completed'
    ? 'Olha só tudo o que você já tirou do caminho.'
    : path === '/upcoming'
      ? 'Um passo de cada vez. O futuro pode esperar um pouquinho.'
      : 'Um passo de cada vez já é um bom começo.'

  function openEditor(task?: Task) {
    setEditingTask(task ?? null)
    setEditorOpen(true)
    setMenuTask(null)
  }

  function saveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const title = String(form.get('title')).trim()
    if (!title) return
    const task: Task = {
      id: editingTask?.id ?? globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      notes: String(form.get('notes')).trim(),
      category: form.get('category') as Category,
      priority: form.get('priority') as Priority,
      dueDate: String(form.get('dueDate')),
      completed: editingTask?.completed ?? false,
    }
    setTasks((current) => editingTask
      ? current.map((item) => item.id === editingTask.id ? task : item)
      : [task, ...current])
    setEditorOpen(false)
    setEditingTask(null)
  }

  function toggleTask(id: string) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id))
    setMenuTask(null)
  }

  function toggleRoadmap(index: number) {
    setRoadmap((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, done: !item.done } : item))
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <NavLink className="brand" to="/today" onClick={() => setMobileNavOpen(false)}>
          <span className="brand-mark"><CloudMoon size={21} strokeWidth={1.8} /></span>
          <span>afterglow<span className="brand-period">.</span></span>
        </NavLink>

        <div className="workspace-label">SEU ESPAÇO</div>
        <nav className="primary-nav" aria-label="Navegação principal">
          <NavLink to="/today" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}><LayoutDashboard size={17} /><span>Minhas tarefas</span><span className="nav-count">{activeCount}</span></NavLink>
          <NavLink to="/upcoming" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}><CalendarDays size={17} /><span>Vem por aí</span><span className="nav-count">{tasks.filter((task) => !task.completed && task.dueDate > today()).length}</span></NavLink>
          <NavLink to="/all" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}><ListTodo size={17} /><span>Todas as tarefas</span></NavLink>
          <NavLink to="/completed" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}><CircleCheck size={17} /><span>Concluídas</span><span className="nav-count">{completedCount}</span></NavLink>
        </nav>

        <div className="sidebar-section-heading"><span>CATEGORIAS</span><button className="icon-button tiny" aria-label="Adicionar tarefa" onClick={() => openEditor()}><Plus size={15} /></button></div>
        <div className="category-list">
          <button className={`category-link ${categoryFilter === 'Pessoal' ? 'category-selected' : ''}`} onClick={() => { setCategoryFilter('Pessoal'); navigate('/all') }}><span className="category-dot dot-lilac" />Pessoal</button>
          <button className={`category-link ${categoryFilter === 'Trabalho' ? 'category-selected' : ''}`} onClick={() => { setCategoryFilter('Trabalho'); navigate('/all') }}><span className="category-dot dot-blue" />Trabalho</button>
          <button className={`category-link ${categoryFilter === 'Estudos' ? 'category-selected' : ''}`} onClick={() => { setCategoryFilter('Estudos'); navigate('/all') }}><span className="category-dot dot-green" />Estudos</button>
          <button className={`category-link ${categoryFilter === 'Bem-estar' ? 'category-selected' : ''}`} onClick={() => { setCategoryFilter('Bem-estar'); navigate('/all') }}><span className="category-dot dot-peach" />Bem-estar</button>
        </div>

        <details className="roadmap-panel" open>
          <summary><span><Sparkles size={15} /> Seu roadmap</span><ChevronDown size={14} /></summary>
          <div className="roadmap-total"><strong>{progress}%</strong><span>{doneRoadmap} de {roadmap.length} passos</span></div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          <div className="roadmap-phases">
            <div className="phase-label">FASE 1 · MVP <span>{roadmap.slice(0, 6).filter((item) => item.done).length}/6</span></div>
            {roadmap.slice(0, 6).map((item, index) => <button className={`roadmap-item ${item.done ? 'roadmap-done' : ''}`} key={item.label} onClick={() => toggleRoadmap(index)}><span className="roadmap-check">{item.done && <Check size={11} />}</span>{item.label}</button>)}
            <div className="phase-label phase-next">FASE 2 · EVOLUÇÃO <span>{roadmap.slice(6, 9).filter((item) => item.done).length}/3</span></div>
            {roadmap.slice(6, 9).map((item, index) => <button className={`roadmap-item ${item.done ? 'roadmap-done' : ''}`} key={item.label} onClick={() => toggleRoadmap(index + 6)}><span className="roadmap-check">{item.done && <Check size={11} />}</span>{item.label}</button>)}
            <div className="phase-label phase-next">FASE 3 · FULL-STACK <span>{roadmap.slice(9).filter((item) => item.done).length}/2</span></div>
            {roadmap.slice(9).map((item, index) => <button className={`roadmap-item ${item.done ? 'roadmap-done' : ''}`} key={item.label} onClick={() => toggleRoadmap(index + 9)}><span className="roadmap-check">{item.done && <Check size={11} />}</span>{item.label}</button>)}
          </div>
        </details>

        <div className="sidebar-bottom">
          <div className="sidebar-note"><Coffee size={17} /><span>Respira. Você está indo bem.</span></div>
          <div className="profile-row"><div className="avatar">L</div><div className="profile-copy"><strong>Seu cantinho</strong><span>Um dia de cada vez</span></div><button className="icon-button tiny" aria-label="Mais opções"><MoreHorizontal size={17} /></button></div>
        </div>
      </aside>

      {mobileNavOpen && <button className="mobile-scrim" aria-label="Fechar navegação" onClick={() => setMobileNavOpen(false)} />}

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu icon-button" aria-label="Abrir navegação" onClick={() => setMobileNavOpen(true)}><Command size={19} /></button>
          <div className="breadcrumb"><span>Seu espaço</span><span className="breadcrumb-separator">/</span><strong>{viewTitle}</strong></div>
          <div className="topbar-actions">
            <button className="theme-switch" onClick={() => setTheme(theme === 'midnight' ? 'daylight' : 'midnight')} aria-label={theme === 'midnight' ? 'Ativar tema claro' : 'Ativar tema escuro'} title={theme === 'midnight' ? 'Ativar tema claro' : 'Ativar tema escuro'}><span className={theme === 'daylight' ? 'switch-thumb switch-right' : 'switch-thumb'} />{theme === 'midnight' ? <Moon size={14} /> : <Sun size={14} />}</button>
            <div className="date-chip"><CalendarDays size={15} /><span>{new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date())}</span></div>
          </div>
        </header>

        <div className="page-wrap">
          <Routes>
            <Route path="/" element={<Navigate to="/today" replace />} />
            <Route path="*" element={<>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow"><span className="eyebrow-sparkle">✳</span> UM RESPIRO NO MEIO DO DIA</div>
                  <h1>{viewTitle}<span className="title-period">.</span></h1>
                  <p className="welcome-copy">{viewSubtitle}</p>
                </div>
                <button className="primary-button" onClick={() => openEditor()}><Plus size={17} />Nova tarefa</button>
              </section>

              <section className="summary-grid" aria-label="Resumo das tarefas">
                <div className="summary-card summary-focus"><div className="summary-icon"><Sparkles size={17} /></div><span className="summary-label">Para hoje</span><strong>{tasks.filter((task) => !task.completed && (!task.dueDate || task.dueDate <= today())).length}<small> tarefas</small></strong><span className="summary-foot">pequenos passos, grandes coisas</span></div>
                <div className="summary-card"><div className="summary-icon icon-mint"><CheckCheck size={17} /></div><span className="summary-label">Já concluídas</span><strong>{completedCount}<small> tarefas</small></strong><span className="summary-foot">você está no caminho</span></div>
                <div className="summary-card"><div className="summary-icon icon-blue"><Clock3 size={17} /></div><span className="summary-label">Ainda em aberto</span><strong>{activeCount}<small> tarefas</small></strong><span className="summary-foot">sem pressa, no seu ritmo</span></div>
              </section>

              <section className="tasks-section">
                <div className="section-heading"><div><h2>Seu espaço de foco</h2><p>Escolha uma coisa. O resto pode esperar.</p></div><button className="sort-button" onClick={() => setTasks((current) => [...current].reverse())}><ArrowDownWideNarrow size={16} /><span>Organizar</span></button></div>
                <div className="filter-bar">
                  <label className="search-field"><Search size={16} /><input aria-label="Buscar tarefas" placeholder="Buscar uma tarefa..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>/</kbd></label>
                  <label className="category-select-wrap"><Filter size={15} /><select aria-label="Filtrar por categoria" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option>Todas as categorias</option>{categories.map((category) => <option key={category}>{category}</option>)}</select><ChevronDown size={14} /></label>
                  <span className="result-count">{visibleTasks.length} {visibleTasks.length === 1 ? 'tarefa' : 'tarefas'}</span>
                </div>

                <div className="task-list">
                  {visibleTasks.map((task) => <article className={`task-row ${task.completed ? 'task-completed' : ''}`} key={task.id}>
                    <button className={`task-check ${task.completed ? 'task-check-done' : ''}`} aria-label={task.completed ? `Marcar ${task.title} como pendente` : `Marcar ${task.title} como concluída`} onClick={() => toggleTask(task.id)}>{task.completed ? <Check size={14} /> : <Circle size={18} />}</button>
                    <div className="task-main"><button className="task-title" onClick={() => openEditor(task)}>{task.title}</button>{task.notes && <p className="task-notes">{task.notes}</p>}<div className="task-meta"><span className={`category-tag tag-${task.category.toLowerCase().replace('-', '')}`}><Tag size={11} />{task.category}</span><span className={`priority-tag priority-${task.priority.toLowerCase()}`}><span />{task.priority}</span></div></div>
                    <div className={`due-date ${task.dueDate === today() && !task.completed ? 'due-today' : ''}`}><CalendarDays size={14} />{formatDate(task.dueDate)}</div>
                    <div className="task-actions"><button className="icon-button" aria-label={`Editar ${task.title}`} onClick={() => openEditor(task)}><Pencil size={15} /></button><div className="task-menu-wrap"><button className="icon-button" aria-label={`Opções de ${task.title}`} onClick={() => setMenuTask(menuTask === task.id ? null : task.id)}><MoreHorizontal size={17} /></button>{menuTask === task.id && <div className="task-menu"><button onClick={() => openEditor(task)}><Pencil size={14} />Editar tarefa</button><button className="delete-action" onClick={() => deleteTask(task.id)}><Trash2 size={14} />Excluir tarefa</button></div>}</div></div>
                  </article>)}
                  {visibleTasks.length === 0 && <div className="empty-state"><span className="empty-icon"><FolderHeart size={24} /></span><strong>Nenhuma tarefa por aqui</strong><p>{query ? 'Tente buscar por outro termo.' : 'Esse espaço está livre. Aproveite o respiro ou adicione uma tarefa.'}</p>{!query && <button className="text-button" onClick={() => openEditor()}><Plus size={15} />Criar uma tarefa</button>}</div>}
                </div>
                {visibleTasks.length > 0 && <div className="list-footer"><span><span className="footer-spark">✳</span> Você não precisa fazer tudo hoje.</span><button onClick={() => { setCategoryFilter('Todas as categorias'); setQuery('') }}>Limpar filtros <X size={13} /></button></div>}
              </section>

              <footer className="page-footer"><span>feito com cuidado, no seu ritmo</span><span className="footer-moon"><Moon size={13} /> afterglow</span></footer>
            </>} />
          </Routes>
        </div>
      </main>

      {editorOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditorOpen(false) }}>
        <section className="task-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <div className="dialog-heading"><div><span className="dialog-kicker">UM PASSO DE CADA VEZ</span><h2 id="dialog-title">{editingTask ? 'Editar tarefa' : 'Uma nova tarefa'}</h2></div><button className="icon-button" aria-label="Fechar" onClick={() => setEditorOpen(false)}><X size={18} /></button></div>
          <form onSubmit={saveTask}>
            <label className="form-label" htmlFor="task-title">O que você quer fazer?</label><input id="task-title" name="title" className="form-input title-input" placeholder="Ex.: estudar um pouquinho" defaultValue={editingTask?.title ?? ''} autoFocus required maxLength={100} />
            <label className="form-label" htmlFor="task-notes">Uma nota para você <span>opcional</span></label><textarea id="task-notes" name="notes" className="form-input notes-input" placeholder="Algum detalhe que vale lembrar?" defaultValue={editingTask?.notes ?? ''} rows={3} maxLength={300} />
            <div className="form-grid"><div><label className="form-label" htmlFor="task-category">Categoria</label><div className="select-control"><select id="task-category" name="category" defaultValue={editingTask?.category ?? 'Pessoal'}>{categories.map((category) => <option key={category}>{category}</option>)}</select><ChevronDown size={15} /></div></div><div><label className="form-label" htmlFor="task-priority">Prioridade</label><div className="select-control"><select id="task-priority" name="priority" defaultValue={editingTask?.priority ?? 'Média'}><option>Baixa</option><option>Média</option><option>Alta</option></select><ChevronDown size={15} /></div></div></div>
            <label className="form-label" htmlFor="task-date">Quando? <span>opcional</span></label><input id="task-date" name="dueDate" className="form-input date-input" type="date" defaultValue={editingTask?.dueDate ?? today()} />
            <div className="dialog-actions"><button type="button" className="secondary-button" onClick={() => setEditorOpen(false)}>Deixar para depois</button><button type="submit" className="primary-button"><Plus size={16} />{editingTask ? 'Salvar mudanças' : 'Adicionar tarefa'}</button></div>
          </form>
        </section>
      </div>}
    </div>
  )
}

export default App