// Small helpers shared by every page

// API base URL comes from .env so it can change at deploy time without code edits
export const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Shows hitting % the way volleyball does: 0.325 -> ".325", -0.05 -> "-.050"
export function formatPct(value) {
  // No attempts means no hitting % yet
  if (value === null || value === undefined) return "—";

  const text = Number(value).toFixed(3); // "0.325" or "-0.050"
  return text.replace("0.", "."); // drop the leading zero
}

// Hitting % from raw numbers: (kills - errors) / attempts
export function hittingPct(kills, errors, attempts) {
  if (attempts === 0) return null; // can't divide by zero
  return (kills - errors) / attempts;
}

// Turns "2025-09-13" into "Sep 13, 2025"
export function formatDate(dateString) {
  // Adding T00:00 makes the browser read it as local time (not UTC),
  // so the date doesn't slip back one day
  return new Date(dateString + "T00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
