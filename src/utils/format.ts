export function formatCurrency(amount: number, symbol: string): string {
  const sign = amount < 0 ? '-' : '';
  const value = Math.abs(amount).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}${value} ${symbol}`;
}

export function formatDayMonth(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7); // YYYY-MM
}

export function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

export function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}
