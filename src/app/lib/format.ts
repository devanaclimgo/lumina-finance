export const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  BRL: 'R$',
  GBP: '£',
};

export function formatCurrency(
  value: number,
  currency = 'USD',
  options?: {
    compact?: boolean;
  },
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: options?.compact ? 'compact' : 'standard',
    maximumFractionDigits: options?.compact ? 1 : 2,
  }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${value > 0 ? '+' : ''}${value.toFixed(digits)}%`;
}

export function formatDate(iso: string, style: 'short' | 'long' | 'time' = 'short') {
  const d = new Date(iso);
  if (style === 'long')
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  if (style === 'time')
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function relativeDay(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.floor((startOfDay(today).getTime() - startOfDay(d).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7 && diff > 0) return `${diff} days ago`;
  return formatDate(iso, 'long');
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
