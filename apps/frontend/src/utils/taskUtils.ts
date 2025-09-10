import { parseDateSafe, formatForApi, formatDateTimeForApi } from "./dateUtils";

export function parseToISO(dateStr: string | null): string | null {
  return dateStr ? formatForApi(parseDateSafe(dateStr)) : null;
}

export function parseToDate(dateStr: string | null): Date | null {
  const parsed = parseDateSafe(dateStr);
  return parsed.isValid() ? parsed.toDate() : null;
}

export function todayISO(): string {
  return formatForApi(new Date())!;
}

export function normalizeTaskForApi(task: any): any {
  return {
    ...task,
    due_date: task.due_date ? formatForApi(task.due_date) : null,
    start_date: task.start_date ? formatDateTimeForApi(task.start_date) : null,
    end_date: task.end_date ? formatDateTimeForApi(task.end_date) : null,
  };
}