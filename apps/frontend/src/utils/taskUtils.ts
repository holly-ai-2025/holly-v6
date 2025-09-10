import dayjs from "dayjs";

export function parseToISO(dateStr: string | null): string | null {
  if (!dateStr) return null;
  if (/^\d{8}$/.test(dateStr)) {
    const day = dateStr.slice(0, 2);
    const month = dateStr.slice(2, 4);
    const year = dateStr.slice(4, 8);
    return `${year}-${month}-${day}`;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return dateStr.slice(0, 10);
  }
  return null;
}

export function parseToDate(dateStr: string | null): Date | null {
  const iso = parseToISO(dateStr);
  return iso ? new Date(iso) : null;
}

export function todayISO(): string {
  return dayjs().format("YYYY-MM-DD");
}

export function normalizeTaskForApi(task: any): any {
  return {
    ...task,
    due_date: parseToISO(task.due_date),
    start_date: task.start_date ? dayjs(task.start_date).format("YYYY-MM-DDTHH:mm:ss") : null,
    end_date: task.end_date ? dayjs(task.end_date).format("YYYY-MM-DDTHH:mm:ss") : null,
  };
}