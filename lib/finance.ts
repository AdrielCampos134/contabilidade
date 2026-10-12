export type FinancialInputs = {
  price: number;
  clients: number;
  fixedCosts: number;
  variableCost: number;
  initialInvestment: number;
  targetProfit: number;
};

export type FinancialSummary = {
  monthlyRevenue: number;
  annualRevenue: number;
  monthlyVariableCosts: number;
  monthlyOperatingExpense: number;
  monthlyOperatingResult: number;
  contributionMargin: number;
  operatingMargin: number;
  breakEvenClients: number | null;
  clientsForTarget: number | null;
};

export type GrowthInputs = {
  launchClients: number;
  newClients: number;
  churnRate: number;
  price: number;
  fixedCosts: number;
  variableCost: number;
  initialInvestment: number;
  startMonth: string;
  horizon: 12 | 18 | 24;
};

export type GrowthRow = {
  monthIndex: number;
  month: string;
  clients: number;
  revenue: number;
  costs: number;
  operatingResult: number;
  cumulativeResult: number;
};

export type GrowthSummary = {
  rows: GrowthRow[];
  finalClients: number;
  finalRevenue: number;
  totalOperatingResult: number;
  paybackMonth: number | null;
  operatingBreakEvenMonth: number | null;
};

export const DEFAULT_FINANCIAL_INPUTS: FinancialInputs = {
  price: 89,
  clients: 150,
  fixedCosts: 10000,
  variableCost: 15,
  initialInvestment: 42500,
  targetProfit: 10000,
};

export const DEFAULT_GROWTH_INPUTS: GrowthInputs = {
  launchClients: 20,
  newClients: 30,
  churnRate: 3,
  price: 89,
  fixedCosts: 10000,
  variableCost: 15,
  initialInvestment: 42500,
  startMonth: "2027-02",
  horizon: 18,
};

export const QUICK_PRICES = [67, 79, 89, 99];

export function normalizeNonNegative(value: number, fallback = 0): number {
  return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

export function calculateFinancialSummary(inputs: FinancialInputs): FinancialSummary {
  const price = normalizeNonNegative(inputs.price);
  const clients = normalizeNonNegative(inputs.clients);
  const fixedCosts = normalizeNonNegative(inputs.fixedCosts);
  const variableCost = normalizeNonNegative(inputs.variableCost);
  const targetProfit = normalizeNonNegative(inputs.targetProfit);
  const monthlyRevenue = clients * price;
  const monthlyVariableCosts = clients * variableCost;
  const monthlyOperatingExpense = fixedCosts + monthlyVariableCosts;
  const monthlyOperatingResult = monthlyRevenue - monthlyOperatingExpense;
  const contributionMargin = price - variableCost;

  return {
    monthlyRevenue,
    annualRevenue: monthlyRevenue * 12,
    monthlyVariableCosts,
    monthlyOperatingExpense,
    monthlyOperatingResult,
    contributionMargin,
    operatingMargin: monthlyRevenue > 0 ? monthlyOperatingResult / monthlyRevenue : 0,
    breakEvenClients: contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : null,
    clientsForTarget:
      contributionMargin > 0 ? Math.ceil((fixedCosts + targetProfit) / contributionMargin) : null,
  };
}

function monthLabel(startMonth: string, index: number): string {
  const [year, month] = startMonth.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month || 1) - 1 + index, 1));
  return new Intl.DateTimeFormat("pt-BR", { month: "short", year: "2-digit", timeZone: "UTC" })
    .format(date)
    .replace(".", "")
    .replace(/^./, (letter) => letter.toUpperCase());
}

export function calculateGrowthProjection(inputs: GrowthInputs): GrowthSummary {
  const launchClients = normalizeNonNegative(inputs.launchClients);
  const newClients = normalizeNonNegative(inputs.newClients);
  const churnRate = Math.min(100, normalizeNonNegative(inputs.churnRate)) / 100;
  const price = normalizeNonNegative(inputs.price);
  const fixedCosts = normalizeNonNegative(inputs.fixedCosts);
  const variableCost = normalizeNonNegative(inputs.variableCost);
  const initialInvestment = normalizeNonNegative(inputs.initialInvestment);
  const horizon = inputs.horizon === 12 || inputs.horizon === 24 ? inputs.horizon : 18;

  let previousClients = launchClients;
  let cumulativeResult = -initialInvestment;
  let paybackMonth: number | null = null;
  let operatingBreakEvenMonth: number | null = null;
  const rows: GrowthRow[] = [];

  for (let index = 0; index < horizon; index += 1) {
    const clients = previousClients * (1 - churnRate) + newClients;
    const revenue = clients * price;
    const costs = fixedCosts + clients * variableCost;
    const operatingResult = revenue - costs;
    cumulativeResult += operatingResult;

    if (operatingBreakEvenMonth === null && operatingResult >= 0) operatingBreakEvenMonth = index + 1;
    if (paybackMonth === null && cumulativeResult >= 0) paybackMonth = index + 1;

    rows.push({
      monthIndex: index + 1,
      month: monthLabel(inputs.startMonth, index),
      clients,
      revenue,
      costs,
      operatingResult,
      cumulativeResult,
    });
    previousClients = clients;
  }

  return {
    rows,
    finalClients: rows.at(-1)?.clients ?? launchClients,
    finalRevenue: rows.at(-1)?.revenue ?? 0,
    totalOperatingResult: rows.reduce((total, row) => total + row.operatingResult, 0),
    paybackMonth,
    operatingBreakEvenMonth,
  };
}

export function formatBRL(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
    ...options,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits }).format(
    Number.isFinite(value) ? value : 0,
  );
}
