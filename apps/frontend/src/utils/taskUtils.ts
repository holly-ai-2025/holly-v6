export function toDDMMYYYY(iso: string): string {
  if (!iso) return "";
  const clean = iso.slice(0, 10); // strip time if present
  const [year, month, day] = clean.split("-");
  return `${day}${month}${year}`; // YYYY-MM-DD → DDMMYYYY
}

export function normalizeTaskForApi(task: any) {
  const copy = { ...task };

  // Fix due_date
  if (copy.due_date && copy.due_date.includes("-")) {
    copy.due_date = toDDMMYYYY(copy.due_date);
  }

  // Normalize enums
  if (copy.status) {
    const statusMap: Record<string, string> = {
      "todo": "Todo",
      "in-progress": "In Progress",
      "done": "Done",
      "pinned": "Pinned",
    };
    copy.status = statusMap[copy.status.toLowerCase()] || copy.status;
  }

  if (copy.priority) {
    const priorityMap: Record<string, string> = {
      "low": "Tiny",
      "medium": "Small",
      "high": "Big",
    };
    copy.priority = priorityMap[copy.priority.toLowerCase()] || copy.priority;
  }

  return copy;
}