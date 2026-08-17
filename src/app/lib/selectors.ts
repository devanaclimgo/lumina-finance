import { startOfDay } from "./format";
import type { Budget, Transaction, Wallet, Workspace } from "./finance-data";

export type PeriodKey = "7d" | "30d" | "3m" | "6m" | "1y";

export const PERIODS: Array<{ key: PeriodKey; label: string; days: number }> = [
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "3m", label: "3 months", days: 90 },
  { key: "6m", label: "6 months", days: 180 },
  { key: "1y", label: "1 year", days: 365 },
];

export function periodDays(key: PeriodKey) {
  return PERIODS.find((p) => p.key === key)?.days ?? 30;
}

export function inWorkspace(txs: Transaction[], ws: Workspace) {
  return txs.filter((t) => t.workspace === ws);
}

export function withinDays(txs: Transaction[], days: number, offset = 0) {
  const now = startOfDay(new Date()).getTime() + 86400000;
  const end = now - offset * 86400000;
  const start = end - days * 86400000;
  return txs.filter((t) => {
    const d = +new Date(t.date);
    return d >= start && d < end;
  });
}

export function totals(txs: Transaction[]) {
  let income = 0;
  let expenses = 0;
  for (const t of txs) {
    if (t.type === "income") income += t.amount;
    else expenses += t.amount;
  }
  return { income, expenses, net: income - expenses };
}

export function pctChange(current: number, previous: number) {
  if (!previous) return current ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function totalBalance(wallets: Wallet[], ws: Workspace) {
  return wallets.filter((w) => w.workspace === ws).reduce((a, w) => a + w.balance, 0);
}

export interface SeriesPoint {
  label: string;
  income: number;
  expenses: number;
  balance: number;
}

export function buildSeries(txs: Transaction[], days: number, startingBalance: number): SeriesPoint[] {
  const buckets = days <= 7 ? days : days <= 30 ? 15 : days <= 90 ? 12 : days <= 180 ? 12 : 12;
  const span = days / buckets;
  const now = startOfDay(new Date()).getTime() + 86400000;
  const points: SeriesPoint[] = [];
  const rows: Array<{ income: number; expenses: number; label: string }> = [];
  for (let i = buckets - 1; i >= 0; i -= 1) {
    const end = now - i * span * 86400000;
    const start = end - span * 86400000;
    let income = 0;
    let expenses = 0;
    for (const t of txs) {
      const d = +new Date(t.date);
      if (d >= start && d < end) {
        if (t.type === "income") income += t.amount;
        else expenses += t.amount;
      }
    }
    const label = new Date(start).toLocaleDateString("en-US", {
      month: "short",
      day: span < 20 ? "numeric" : undefined,
    });
    rows.push({ income, expenses, label });
  }
  const netTotal = rows.reduce((a, r) => a + r.income - r.expenses, 0);
  let running = startingBalance - netTotal;
  for (const r of rows) {
    running += r.income - r.expenses;
    points.push({
      label: r.label,
      income: Math.round(r.income),
      expenses: Math.round(r.expenses),
      balance: Math.round(running),
    });
  }
  return points;
}

export function spendByCategory(txs: Transaction[]) {
  const map = new Map<string, number>();
  for (const t of txs) {
    if (t.type !== "expense") continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  return [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function incomeBySource(txs: Transaction[]) {
  const map = new Map<string, number>();
  for (const t of txs) {
    if (t.type !== "income") continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  return [...map.entries()].map(([category, amount]) => ({ category, amount }));
}

export function budgetStatus(spent: number, limit: number) {
  const pct = limit ? (spent / limit) * 100 : 0;
  if (pct > 100) return { status: "Exceeded" as const, pct };
  if (pct >= 75) return { status: "Warning" as const, pct };
  return { status: "Healthy" as const, pct };
}

export function monthSpendByCategory(txs: Transaction[], budgets: Budget[]) {
  const monthTxs = withinDays(txs, 30);
  const spend = new Map<string, number>();
  for (const t of monthTxs) {
    if (t.type === "expense") spend.set(t.category, (spend.get(t.category) ?? 0) + t.amount);
  }
  return budgets.map((b) => {
    const spent = spend.get(b.category) ?? 0;
    return { ...b, spent, ...budgetStatus(spent, b.limit) };
  });
}
