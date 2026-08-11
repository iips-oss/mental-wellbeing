// Shared display-formatting helpers used across student profile/sidebar/layout
// components, so name/course/semester formatting stays consistent everywhere
// instead of being duplicated (and drifting) per-file.

// "parth soni" -> "Parth Soni"
export const toTitleCase = (str) => {
  if (!str) return "";
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const KNOWN_COURSE_LABELS = {
  "m.tech cs": "M.Tech (CS)",
  "m.tech it": "M.Tech (IT)",
  "mca": "MCA",
  "mba tourism": "MBA (Tourism)",
  "mba ms": "MBA (MS)",
  "b.com hons": "B.Com (Hons)",
};

// Matches against the real set of programs offered; falls back to Title Case
// for any legacy/seed data that predates this list (e.g. old lowercase rows).
export const formatCourseName = (course) => {
  if (!course) return "";
  const key = course.trim().toLowerCase();
  if (KNOWN_COURSE_LABELS[key]) return KNOWN_COURSE_LABELS[key];
  return course
    .trim()
    .split(/\s+/)
    .map((word) => (word.length <= 3 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join(" ");
};

// 7 -> "7th Sem"
export const formatSemester = (semester) => {
  if (!semester && semester !== 0) return "";
  const n = Number(semester);
  if (Number.isNaN(n)) return String(semester);
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  return `${n}${suffix} Sem`;
};