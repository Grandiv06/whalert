export interface Signal {
  id: number;
  symbol: string;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  status: string;
  date: string;
  risk?: string;
}

const SYMBOLS = ["XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "BTCUSD", "ETHUSD"];
const STATUSES = ["Active", "Closed", "Pending"];
const RISK_LABELS = ["-1R", "-0.5R", "+1R", "+2R", "0R"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function randomInRange(min: number, max: number, decimals = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomDate(): string {
  const day = Math.floor(Math.random() * 28) + 1;
  const monthIndex = Math.floor(Math.random() * 12);
  const year = 2025;
  return `${day} ${MONTHS[monthIndex]} ${year}`;
}

function generateRandomSignal(id: number): Signal {
  const entry = randomInRange(2300, 2400);
  const stopLoss = randomInRange(entry - 5, entry + 5);
  const takeProfit = randomInRange(entry + 10, entry + 100);

  return {
    id,
    symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    entry: Number(entry.toFixed(2)),
    stopLoss: Number(stopLoss.toFixed(2)),
    takeProfit: Number(takeProfit.toFixed(2)),
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    date: randomDate(),
    risk: RISK_LABELS[Math.floor(Math.random() * RISK_LABELS.length)],
  };
}

export const signalsApi = {
  getAll: async (): Promise<Signal[]> => {
    return Array.from({ length: 6 }, (_, i) => generateRandomSignal(i + 1));
  },
};
