import { daysAgoISO, daysAheadISO } from "./format";

export type Workspace = "personal" | "business";

export type TxType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  merchant: string;
  amount: number; // positive number
  type: TxType;
  category: string;
  walletId: string;
  date: string; // ISO
  status: "completed" | "pending" | "failed";
  notes?: string;
  recurring?: boolean;
  workspace: Workspace;
}

export interface Wallet {
  id: string;
  name: string;
  type: "cash" | "bank" | "credit" | "investment";
  balance: number;
  currency: string;
  institution: string;
  last4?: string;
  updatedAt: string;
  trend: number[];
  workspace: Workspace;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: "monthly" | "weekly" | "yearly";
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  emoji: string;
}

export interface Recurring {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  kind: "subscription" | "bill";
}

export interface Investment {
  id: string;
  name: string;
  symbol: string;
  assetClass: "Stocks" | "ETFs" | "Crypto" | "Fixed income" | "Other";
  value: number;
  invested: number;
  spark: number[];
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  revenue: number;
  status: "active" | "lead" | "churned";
  lastInteraction: string;
}

export type DealStage = "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Won" | "Lost";

export interface Deal {
  id: string;
  customer: string;
  company: string;
  value: number;
  probability: number;
  closeDate: string;
  stage: DealStage;
  source: string;
}

export interface SupportMessage {
  id: string;
  from: "user" | "agent";
  text: string;
  at: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: "open" | "resolved";
  updatedAt: string;
  category: string;
}

export const CATEGORIES = [
  "Food & Dining",
  "Housing",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Health",
  "Education",
  "Utilities",
  "Salary",
  "Freelance",
  "Investments",
  "Other",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "var(--chart-1)",
  Housing: "var(--chart-2)",
  Transportation: "var(--chart-6)",
  Entertainment: "var(--chart-5)",
  Shopping: "var(--chart-4)",
  Health: "var(--chart-3)",
  Education: "var(--chart-2)",
  Utilities: "var(--chart-6)",
  Salary: "var(--chart-3)",
  Freelance: "var(--chart-3)",
  Investments: "var(--chart-1)",
  Other: "var(--muted-foreground)",
};

export const wallets: Wallet[] = [
  {
    id: "w1",
    name: "Everyday Checking",
    type: "bank",
    balance: 8420.55,
    currency: "USD",
    institution: "Northline Bank",
    last4: "4821",
    updatedAt: daysAgoISO(0, 8),
    trend: [6.2, 6.9, 7.1, 6.6, 7.8, 8.1, 8.42],
    workspace: "personal",
  },
  {
    id: "w2",
    name: "Sapphire Credit",
    type: "credit",
    balance: -1284.3,
    currency: "USD",
    institution: "Vera Card",
    last4: "1109",
    updatedAt: daysAgoISO(0, 10),
    trend: [-0.4, -0.7, -0.9, -1.4, -1.1, -1.3, -1.28],
    workspace: "personal",
  },
  {
    id: "w3",
    name: "High-Yield Savings",
    type: "bank",
    balance: 15230.0,
    currency: "USD",
    institution: "Northline Bank",
    last4: "7734",
    updatedAt: daysAgoISO(1),
    trend: [12.4, 12.9, 13.4, 13.9, 14.4, 14.8, 15.23],
    workspace: "personal",
  },
  {
    id: "w4",
    name: "Cash Wallet",
    type: "cash",
    balance: 320.0,
    currency: "USD",
    institution: "Physical",
    updatedAt: daysAgoISO(2),
    trend: [0.5, 0.44, 0.4, 0.38, 0.36, 0.33, 0.32],
    workspace: "personal",
  },
  {
    id: "w5",
    name: "Brokerage",
    type: "investment",
    balance: 41890.12,
    currency: "USD",
    institution: "Meridian Invest",
    updatedAt: daysAgoISO(0, 16),
    trend: [36.1, 37.4, 38.2, 39.8, 40.2, 41.1, 41.89],
    workspace: "personal",
  },
  {
    id: "w6",
    name: "Euro Travel Account",
    type: "bank",
    balance: 2140.9,
    currency: "EUR",
    institution: "Aurora EU",
    last4: "2210",
    updatedAt: daysAgoISO(4),
    trend: [2.8, 2.7, 2.5, 2.4, 2.3, 2.2, 2.14],
    workspace: "personal",
  },
  {
    id: "w7",
    name: "Luma Studio Operating",
    type: "bank",
    balance: 62410.4,
    currency: "USD",
    institution: "Northline Business",
    last4: "3390",
    updatedAt: daysAgoISO(0, 11),
    trend: [48.2, 51.1, 53.8, 56.4, 58.9, 60.2, 62.41],
    workspace: "business",
  },
];

const merchants: Array<[string, string, TxType, number, string]> = [
  ["Whole Foods", "Food & Dining", "expense", 84.22, "w1"],
  ["Blue Bottle Coffee", "Food & Dining", "expense", 6.75, "w4"],
  ["Uber", "Transportation", "expense", 23.4, "w2"],
  ["Shell Station", "Transportation", "expense", 61.1, "w1"],
  ["Netflix", "Entertainment", "expense", 15.99, "w2"],
  ["Spotify", "Entertainment", "expense", 11.99, "w2"],
  ["Amazon", "Shopping", "expense", 129.35, "w2"],
  ["Zara", "Shopping", "expense", 78.0, "w2"],
  ["Apple Store", "Shopping", "expense", 249.0, "w1"],
  ["City Rent", "Housing", "expense", 1850.0, "w1"],
  ["Con Edison", "Utilities", "expense", 96.4, "w1"],
  ["T-Mobile", "Utilities", "expense", 55.0, "w1"],
  ["CVS Pharmacy", "Health", "expense", 34.15, "w1"],
  ["Equinox Gym", "Health", "expense", 89.0, "w2"],
  ["Coursera", "Education", "expense", 49.0, "w2"],
  ["Trader Joe's", "Food & Dining", "expense", 62.87, "w1"],
  ["Sweetgreen", "Food & Dining", "expense", 17.25, "w4"],
  ["Delta Airlines", "Transportation", "expense", 412.6, "w2"],
  ["Airbnb", "Housing", "expense", 320.0, "w2"],
  ["Steam", "Entertainment", "expense", 39.99, "w2"],
  ["IKEA", "Shopping", "expense", 186.4, "w1"],
  ["Dental Clinic", "Health", "expense", 140.0, "w1"],
  ["Acme Corp Payroll", "Salary", "income", 5400.0, "w1"],
  ["Freelance — Orbit Co.", "Freelance", "income", 1250.0, "w1"],
  ["Dividend — VOO", "Investments", "income", 132.4, "w5"],
  ["Refund — Amazon", "Shopping", "income", 42.0, "w2"],
];

function buildTransactions(): Transaction[] {
  const out: Transaction[] = [];
  let i = 0;
  for (let day = 0; day < 92; day += 1) {
    const count = day % 3 === 0 ? 2 : day % 5 === 0 ? 0 : 1;
    for (let k = 0; k < count; k += 1) {
      const m = merchants[(day * 2 + k * 5) % merchants.length]!;
      const variance = 1 + (((day * 13 + k * 7) % 21) - 10) / 100;
      out.push({
        id: `t${i}`,
        description: m[0],
        merchant: m[0],
        category: m[1],
        type: m[2],
        amount: Math.round(m[3] * variance * 100) / 100,
        walletId: m[4],
        date: daysAgoISO(day, 9 + ((day + k) % 10)),
        status: day === 0 && k === 0 ? "pending" : "completed",
        recurring: ["Netflix", "Spotify", "City Rent", "T-Mobile", "Equinox Gym"].includes(m[0]),
        workspace: "personal",
      });
      i += 1;
    }
    if (day % 30 === 1) {
      out.push({
        id: `t${i}`,
        description: "Acme Corp Payroll",
        merchant: "Acme Corp",
        category: "Salary",
        type: "income",
        amount: 5400,
        walletId: "w1",
        date: daysAgoISO(day, 8),
        status: "completed",
        recurring: true,
        workspace: "personal",
      });
      i += 1;
    }
  }
  const bizMerchants: Array<[string, string, TxType, number]> = [
    ["Northwind Retainer", "Salary", "income", 8400],
    ["Client — Vertex Labs", "Freelance", "income", 12500],
    ["AWS", "Utilities", "expense", 940.2],
    ["Figma Team", "Utilities", "expense", 180],
    ["Contractor payout", "Other", "expense", 3200],
    ["Office lease", "Housing", "expense", 2400],
    ["Client — Halo Media", "Freelance", "income", 6200],
    ["LinkedIn Ads", "Other", "expense", 1250],
  ];
  for (let day = 0; day < 90; day += 6) {
    const m = bizMerchants[(day / 6) % bizMerchants.length]!;
    out.push({
      id: `b${day}`,
      description: m[0],
      merchant: m[0],
      category: m[1],
      type: m[2],
      amount: Math.round(m[3] * (1 + ((day % 17) - 8) / 100) * 100) / 100,
      walletId: "w7",
      date: daysAgoISO(day, 10),
      status: "completed",
      workspace: "business",
    });
  }
  return out.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export const transactions: Transaction[] = buildTransactions();

export const budgets: Budget[] = [
  { id: "b1", category: "Food & Dining", limit: 700, period: "monthly" },
  { id: "b2", category: "Housing", limit: 2200, period: "monthly" },
  { id: "b3", category: "Transportation", limit: 400, period: "monthly" },
  { id: "b4", category: "Entertainment", limit: 150, period: "monthly" },
  { id: "b5", category: "Shopping", limit: 500, period: "monthly" },
  { id: "b6", category: "Health", limit: 300, period: "monthly" },
  { id: "b7", category: "Education", limit: 120, period: "monthly" },
  { id: "b8", category: "Utilities", limit: 250, period: "monthly" },
];

export const goals: Goal[] = [
  { id: "g1", name: "Emergency Fund", target: 20000, saved: 15230, deadline: daysAheadISO(210), emoji: "🛟" },
  { id: "g2", name: "New Laptop", target: 3200, saved: 1840, deadline: daysAheadISO(75), emoji: "💻" },
  { id: "g3", name: "Japan Trip", target: 6500, saved: 2960, deadline: daysAheadISO(150), emoji: "🗼" },
  { id: "g4", name: "Index Portfolio", target: 50000, saved: 41890, deadline: daysAheadISO(365), emoji: "📈" },
];

export const recurring: Recurring[] = [
  { id: "r1", name: "Netflix", amount: 15.99, dueDate: daysAheadISO(2), category: "Entertainment", kind: "subscription" },
  { id: "r2", name: "City Rent", amount: 1850, dueDate: daysAheadISO(6), category: "Housing", kind: "bill" },
  { id: "r3", name: "Spotify", amount: 11.99, dueDate: daysAheadISO(9), category: "Entertainment", kind: "subscription" },
  { id: "r4", name: "Equinox Gym", amount: 89, dueDate: daysAheadISO(12), category: "Health", kind: "subscription" },
  { id: "r5", name: "Con Edison", amount: 96.4, dueDate: daysAheadISO(16), category: "Utilities", kind: "bill" },
  { id: "r6", name: "T-Mobile", amount: 55, dueDate: daysAheadISO(21), category: "Utilities", kind: "bill" },
];

export const investments: Investment[] = [
  { id: "i1", name: "Vanguard S&P 500", symbol: "VOO", assetClass: "ETFs", value: 14820, invested: 12000, spark: [11.9, 12.4, 12.2, 13.1, 13.6, 14.2, 14.82] },
  { id: "i2", name: "Apple Inc.", symbol: "AAPL", assetClass: "Stocks", value: 8240, invested: 6900, spark: [6.9, 7.3, 7.1, 7.6, 7.9, 8.0, 8.24] },
  { id: "i3", name: "Microsoft", symbol: "MSFT", assetClass: "Stocks", value: 6410, invested: 5600, spark: [5.6, 5.8, 6.0, 5.9, 6.2, 6.3, 6.41] },
  { id: "i4", name: "Bitcoin", symbol: "BTC", assetClass: "Crypto", value: 5320, invested: 3400, spark: [3.4, 4.1, 3.8, 4.9, 5.6, 5.1, 5.32] },
  { id: "i5", name: "Ethereum", symbol: "ETH", assetClass: "Crypto", value: 2180, invested: 2400, spark: [2.4, 2.3, 2.5, 2.2, 2.1, 2.25, 2.18] },
  { id: "i6", name: "Treasury Bond ETF", symbol: "BND", assetClass: "Fixed income", value: 3420, invested: 3300, spark: [3.3, 3.31, 3.33, 3.36, 3.38, 3.4, 3.42] },
  { id: "i7", name: "Emerging Markets", symbol: "VWO", assetClass: "ETFs", value: 1500, invested: 1600, spark: [1.6, 1.58, 1.54, 1.49, 1.52, 1.48, 1.5] },
];

export const customers: Customer[] = [
  { id: "c1", name: "Ava Lindqvist", company: "Vertex Labs", email: "ava@vertexlabs.io", revenue: 42500, status: "active", lastInteraction: daysAgoISO(1) },
  { id: "c2", name: "Marcus Oyelaran", company: "Halo Media", email: "marcus@halomedia.co", revenue: 28400, status: "active", lastInteraction: daysAgoISO(3) },
  { id: "c3", name: "Priya Raman", company: "Northwind", email: "priya@northwind.com", revenue: 61200, status: "active", lastInteraction: daysAgoISO(6) },
  { id: "c4", name: "Tom Beckett", company: "Orbit Co.", email: "tom@orbit.co", revenue: 9800, status: "lead", lastInteraction: daysAgoISO(9) },
  { id: "c5", name: "Sofia Marchetti", company: "Lumen Studio", email: "sofia@lumen.studio", revenue: 15600, status: "active", lastInteraction: daysAgoISO(12) },
  { id: "c6", name: "Daniel Cho", company: "Kite Financial", email: "daniel@kitefin.com", revenue: 4200, status: "churned", lastInteraction: daysAgoISO(40) },
  { id: "c7", name: "Elena Fischer", company: "Atlas Group", email: "elena@atlasgroup.de", revenue: 33750, status: "active", lastInteraction: daysAgoISO(2) },
  { id: "c8", name: "Jonah Price", company: "Ridgeway", email: "jonah@ridgeway.io", revenue: 0, status: "lead", lastInteraction: daysAgoISO(5) },
];

export const deals: Deal[] = [
  { id: "d1", customer: "Jonah Price", company: "Ridgeway", value: 18000, probability: 20, closeDate: daysAheadISO(45), stage: "Lead", source: "Inbound" },
  { id: "d2", customer: "Tom Beckett", company: "Orbit Co.", value: 12500, probability: 35, closeDate: daysAheadISO(30), stage: "Qualified", source: "Referral" },
  { id: "d3", customer: "Sofia Marchetti", company: "Lumen Studio", value: 24000, probability: 55, closeDate: daysAheadISO(21), stage: "Proposal", source: "Outbound" },
  { id: "d4", customer: "Elena Fischer", company: "Atlas Group", value: 46000, probability: 70, closeDate: daysAheadISO(14), stage: "Negotiation", source: "Partner" },
  { id: "d5", customer: "Ava Lindqvist", company: "Vertex Labs", value: 52000, probability: 100, closeDate: daysAgoISO(8), stage: "Won", source: "Referral" },
  { id: "d6", customer: "Daniel Cho", company: "Kite Financial", value: 8000, probability: 0, closeDate: daysAgoISO(20), stage: "Lost", source: "Inbound" },
  { id: "d7", customer: "Priya Raman", company: "Northwind", value: 31000, probability: 60, closeDate: daysAheadISO(26), stage: "Proposal", source: "Event" },
  { id: "d8", customer: "Marcus Oyelaran", company: "Halo Media", value: 15400, probability: 85, closeDate: daysAheadISO(9), stage: "Negotiation", source: "Inbound" },
];

export const supportMessages: SupportMessage[] = [
  { id: "m1", from: "user", text: "Why is my balance different from yesterday?", at: daysAgoISO(0, 9) },
  {
    id: "m2",
    from: "agent",
    text: "Hi! Your balance changed because two pending card transactions settled overnight — Amazon ($129.35) and Uber ($23.40). Pending items are shown separately until they clear.",
    at: daysAgoISO(0, 9),
  },
  { id: "m3", from: "user", text: "Got it. Can I hide pending items from the dashboard total?", at: daysAgoISO(0, 10) },
  {
    id: "m4",
    from: "agent",
    text: "Absolutely — go to Settings › Workspace › Financial preferences and turn off \"Include pending in totals\". It applies instantly across all wallets.",
    at: daysAgoISO(0, 10),
  },
];

export const tickets: Ticket[] = [
  { id: "#4821", subject: "Duplicate transaction from Amazon", status: "open", updatedAt: daysAgoISO(0, 14), category: "Transactions" },
  { id: "#4790", subject: "Add support for multi-currency budgets", status: "open", updatedAt: daysAgoISO(3), category: "Budgets" },
  { id: "#4711", subject: "Wallet sync stopped for Aurora EU", status: "resolved", updatedAt: daysAgoISO(11), category: "Wallets" },
  { id: "#4652", subject: "Upgrade to Premium billing question", status: "resolved", updatedAt: daysAgoISO(19), category: "Subscription" },
];

export const faqs: Array<{ category: string; q: string; a: string }> = [
  { category: "Getting Started", q: "How do I set up my first wallet?", a: "Open Wallets and choose Add wallet. Give it a name, pick the account type and currency, then set the current balance. Luma will start tracking trends from that point." },
  { category: "Getting Started", q: "Can I import data from another app?", a: "In this build, data lives locally in your browser. Everything you add is persisted with localStorage, so refreshing keeps your changes." },
  { category: "Transactions", q: "How do recurring transactions work?", a: "Toggle Recurring in the Add transaction drawer. Recurring items appear in the Upcoming payments card on your dashboard." },
  { category: "Transactions", q: "Can I bulk delete transactions?", a: "Yes. Select rows with the checkboxes in the transactions table and use the bulk action bar that appears." },
  { category: "Wallets", q: "What account types are supported?", a: "Cash, bank accounts, credit cards, and investment accounts. Credit cards can carry a negative balance." },
  { category: "Budgets", q: "When does a budget reset?", a: "Monthly budgets reset on the first day of each month. You can switch a budget to weekly or yearly at any time." },
  { category: "Budgets", q: "What do the budget statuses mean?", a: "Healthy is under 75% used, Warning is 75-100%, and Exceeded is over the limit." },
  { category: "Investments", q: "Is market data real?", a: "No. Investment data is mock data for demonstration purposes only." },
  { category: "Plans", q: "What is included in Premium?", a: "Unlimited goals, advanced analytics and reports, investment tracking, and access to the Business workspace." },
  { category: "Business", q: "How does the sales pipeline work?", a: "Drag a deal card between stages on the Business page. Pipeline value and conversion metrics update immediately." },
];
