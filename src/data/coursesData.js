// Catalog starts empty so user can paste their exact SIGA schedule
export const initialCourses = [];

export const DAYS_OF_WEEK = [
  { id: "seg", label: "Segunda", full: "Segunda-feira" },
  { id: "ter", label: "Terça", full: "Terça-feira" },
  { id: "qua", label: "Quarta", full: "Quarta-feira" },
  { id: "qui", label: "Quinta", full: "Quinta-feira" },
  { id: "sex", label: "Sexta", full: "Sexta-feira" }
];

export const TIME_SLOTS = [
  { start: "08:00", end: "09:00", label: "08:00 - 09:00", period: "Manhã" },
  { start: "09:00", end: "10:00", label: "09:00 - 10:00", period: "Manhã" },
  { start: "10:00", end: "11:00", label: "10:00 - 11:00", period: "Manhã" },
  { start: "11:00", end: "12:00", label: "11:00 - 12:00", period: "Manhã" },
  { start: "12:00", end: "13:00", label: "12:00 - 13:00", period: "Almoço" },
  { start: "13:00", end: "14:00", label: "13:00 - 14:00", period: "Tarde" },
  { start: "14:00", end: "15:00", label: "14:00 - 15:00", period: "Tarde" },
  { start: "15:00", end: "16:00", label: "15:00 - 16:00", period: "Tarde" },
  { start: "16:00", end: "17:00", label: "16:00 - 17:00", period: "Tarde" },
  { start: "17:00", end: "18:00", label: "17:00 - 18:00", period: "Tarde" },
  { start: "18:00", end: "19:00", label: "18:00 - 19:00", period: "Jantar" },
  { start: "19:00", end: "20:00", label: "19:00 - 20:00", period: "Noite" },
  { start: "20:00", end: "21:00", label: "20:00 - 21:00", period: "Noite" },
  { start: "21:00", end: "22:00", label: "21:00 - 22:00", period: "Noite" },
  { start: "22:00", end: "23:00", label: "22:00 - 23:00", period: "Noite" }
];

export const COURSE_COLORS = [
  { bg: "bg-blue-600", text: "text-white", border: "border-blue-700", hex: "#2563eb", lightBg: "#dbeafe", darkBorder: "#1d4ed8" },
  { bg: "bg-emerald-600", text: "text-white", border: "border-emerald-700", hex: "#059669", lightBg: "#d1fae5", darkBorder: "#047857" },
  { bg: "bg-purple-600", text: "text-white", border: "border-purple-700", hex: "#7c3aed", lightBg: "#ede9fe", darkBorder: "#6d28d9" },
  { bg: "bg-amber-600", text: "text-white", border: "border-amber-700", hex: "#d97706", lightBg: "#fef3c7", darkBorder: "#b45309" },
  { bg: "bg-rose-600", text: "text-white", border: "border-rose-700", hex: "#e11d48", lightBg: "#ffe4e6", darkBorder: "#be123c" },
  { bg: "bg-indigo-600", text: "text-white", border: "border-indigo-700", hex: "#4f46e5", lightBg: "#e0e7ff", darkBorder: "#4338ca" },
  { bg: "bg-cyan-600", text: "text-white", border: "border-cyan-700", hex: "#0891b2", lightBg: "#cffaff", darkBorder: "#0e7490" },
  { bg: "bg-fuchsia-600", text: "text-white", border: "border-fuchsia-700", hex: "#c026d3", lightBg: "#fae8ff", darkBorder: "#a21caf" },
  { bg: "bg-teal-600", text: "text-white", border: "border-teal-700", hex: "#0d9488", lightBg: "#ccfbf1", darkBorder: "#0f766e" },
  { bg: "bg-orange-600", text: "text-white", border: "border-orange-700", hex: "#ea580c", lightBg: "#ffedd5", darkBorder: "#c2410c" }
];
