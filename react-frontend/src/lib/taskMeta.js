/* Shared status + priority metadata for the flat design system.
   Colors map to the CSS tokens in index.css. */

export const PRIORITY_META = {
  high: { label: 'High', color: '#dc2626', soft: 'rgba(220, 38, 38, 0.08)' },
  medium: { label: 'Medium', color: '#d97706', soft: 'rgba(217, 119, 6, 0.08)' },
  low: { label: 'Low', color: '#2563eb', soft: 'rgba(37, 99, 235, 0.08)' },
};

export const STATUS_META = {
  todo: { label: 'To Do', color: '#2563eb', soft: 'rgba(37, 99, 235, 0.08)' },
  in_progress: { label: 'In Progress', color: '#d97706', soft: 'rgba(217, 119, 6, 0.08)' },
  done: { label: 'Done', color: '#16a34a', soft: 'rgba(22, 163, 74, 0.08)' },
};

export const STATUS_ORDER = ['todo', 'in_progress', 'done'];

export const priorityMeta = (p) => PRIORITY_META[p] || PRIORITY_META.medium;
export const statusMeta = (s) => STATUS_META[s] || STATUS_META.todo;

/* Initials for an avatar, e.g. "Abdul Wahab" -> "AW" */
export const initials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
