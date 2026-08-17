export const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  BRL: "R$",
  GBP: "£",
};

export function formatCurrency(value: number, currency = "USD", opts?: { compact?: boolean; sign?: boolean }) {
  const abs = Math.abs(value);
  const sym = currencySymbols[currency] ?? "$";
  let body: string;
  if (opts?.compact && abs >= 1000) {
    body = `${sym}${(abs / 1000).toFixed(abs >= 10000 ? 0 : 1)}k`;
  } else {
    body = `${sym}${abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  const sign = value < 0 ? "-" : opts?.sign ? "+" : "";
  return `${sign}${body}`;
}

export function formatCompact(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toFixed(0);
}

export function formatPercent(value: number, digits = 1) {
  return `${value > 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

export function formatDate(iso: string, style: "short" | "long" | "time" = "short") {
  const d = new Date(iso);
  if (style === "long")
    return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  if (style === "time")
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function relativeDay(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.floor((startOfDay(today).getTime() - startOfDay(d).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7 && diff > 0) return `${diff} days ago`;
  return formatDate(iso, "long");
}

export function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export function daysAgoISO(days: number, hour = 12) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, (days * 7) % 60, 0, 0);
  return d.toISOString();
}

export function daysAheadISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}
