export type SortBy = "priority" | "date" | "name";
export type Priority = "Baixa" | "Média" | "Alta";
export type Category = "Pessoal" | "Trabalho" | "Estudos" | "Bem-estar";
export type Task = {
  id: string;
  title: string;
  notes: string;
  category: Category;
  priority: Priority;
  dueDate: string;
  completed: boolean;
};
export type RoadmapItem = { label: string; done: boolean };

