import dayjs from "dayjs";

/**
 * Safely parse a date string into Day.js, with fallback to today.
 * Accepts ISO (YYYY-MM-DD) or DDMMYYYY formats.
 */
export function parseDateSafe(dateStr?: string | null) {
  if (!dateStr) return dayjs().startOf("day");

  if (/^\d{8}$/.test(dateStr)) {
    // DDMMYYYY → ISO
    const day = dateStr.slice(0, 2);
    const month = dateStr.slice(2, 4);
    const year = dateStr.slice(4, 8);
    return dayjs(`${year}-${month}-${day}`, "YYYY-MM-DD", true);
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return dayjs(dateStr, "YYYY-MM-DD", true);
  }

  return dayjs().startOf("day");
}

/**
 * Format date for API as ISO (YYYY-MM-DD).
 */
export function formatForApi(date: any) {
  return date ? dayjs(date).format("YYYY-MM-DD") : null;
}

/**
 * Format datetime for API (YYYY-MM-DDTHH:mm:ss)
 */
export function formatDateTimeForApi(date: any) {
  return date ? dayjs(date).format("YYYY-MM-DDTHH:mm:ss") : null;
}