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
  // Canonical values submitted by the current Register form
  "m.tech cs": "M.Tech (CS)",
  "m.tech it": "M.Tech (IT)",
  "mca": "MCA",
  "mba tourism": "MBA (Tourism)",
  "mba ms": "MBA (MS)",
  "b.com hons": "B.Com (Hons)",
  // Legacy values confirmed present in the live database (backend/seed.py
  // and older registrations, before the current dropdown existed) — kept
  // so those existing rows still display correctly.
  "mtech it": "M.Tech (IT)",   // covers both "MTECH IT" and "mtech it"
  "mba": "MBA",
  "msc cs": "M.Sc (CS)",
  "btech it": "B.Tech (IT)",
};

// Capitalizes a single token, correctly handling embedded periods so
// "M.Tech" -> "M.Tech" (not "M.tech") for any future unmapped value.
const capitalizeToken = (word) => {
  if (word.length <= 4 && !word.includes(".")) return word.toUpperCase(); // "MBA", "CSE"
  return word
    .split(".")
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part))
    .join(".");
};

// Matches against known programs (current + confirmed legacy db values)
// first; only falls back to generic formatting for anything unrecognized.
export const formatCourseName = (course) => {
  if (!course) return "";
  const key = course.trim().toLowerCase();
  if (KNOWN_COURSE_LABELS[key]) return KNOWN_COURSE_LABELS[key];
  return course.trim().split(/\s+/).map(capitalizeToken).join(" ");
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