export const localDateString = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const today = () => localDateString(new Date());
export const dateOffset = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDateString(date);
};

function formatDate(value: string) {
  if (!value) return "Sem data";
  const date = new Date(`${value}T12:00:00`);
  if (value === today()) return "Hoje";
  if (value === dateOffset(1)) return "Amanhã";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
  }).format(date);
}

