import type { Category, Priority, Task } from "../types/task";
import { today, dateOffset } from "../utils/dates";

export const categories: Category[] = ["Pessoal", "Trabalho", "Estudos", "Bem-estar"];
export const priorityOrder: Record<Priority, number> = { Alta: 0, Média: 1, Baixa: 2 };
export const defaultTasks: Task[] = [
  {
    id: "task-1",
    title: "Revisar os componentes de React",
    notes: "Uma coisa de cada vez, sem pressa.",
    category: "Estudos",
    priority: "Alta",
    dueDate: today(),
    completed: false,
  },
  {
    id: "task-2",
    title: "Responder às mensagens da equipe",
    notes: "",
    category: "Trabalho",
    priority: "Média",
    dueDate: today(),
    completed: false,
  },
  {
    id: "task-3",
    title: "Separar um tempo para ler",
    notes: "Pelo menos 20 páginas antes de dormir.",
    category: "Pessoal",
    priority: "Baixa",
    dueDate: dateOffset(1),
    completed: false,
  },
  {
    id: "task-4",
    title: "Fazer uma pausa para caminhar",
    notes: "",
    category: "Bem-estar",
    priority: "Baixa",
    dueDate: today(),
    completed: true,
  },
];

export const defaultRoadmap = [
  { label: "Criar, editar e excluir tarefas", done: true },
  { label: "Marcar tarefas como concluídas", done: true },
  { label: "Prioridades e categorias", done: true },
  { label: "Filtros e pesquisa", done: true },
  { label: "Salvar no LocalStorage", done: true },
  { label: "Alternar tema claro e escuro", done: true },
  { label: "Datas de vencimento e calendário", done: true },
  { label: "Arrastar tarefas entre colunas", done: false },
  { label: "Estatísticas e gráficos", done: false },
  { label: "API e autenticação", done: false },
  { label: "Sincronização entre dispositivos", done: false },
];

