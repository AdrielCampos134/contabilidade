import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateFinancialSummary,
  calculateGrowthProjection,
  DEFAULT_GROWTH_INPUTS,
} from "./finance";

test("calcula receita mensal e custos variáveis", () => {
  const result = calculateFinancialSummary({
    price: 89,
    clients: 150,
    fixedCosts: 10000,
    variableCost: 15,
    initialInvestment: 42500,
    targetProfit: 10000,
  });

  assert.equal(result.monthlyRevenue, 13350);
  assert.equal(result.monthlyVariableCosts, 2250);
  assert.equal(result.monthlyOperatingResult, 1100);
});

test("retorna ponto de equilíbrio de 136 clientes no cenário-base", () => {
  const result = calculateFinancialSummary({
    price: 89,
    clients: 150,
    fixedCosts: 10000,
    variableCost: 15,
    initialInvestment: 42500,
    targetProfit: 10000,
  });

  assert.equal(result.breakEvenClients, 136);
});

test("crescimento aplica churn e identifica primeiro mês lucrativo", () => {
  const result = calculateGrowthProjection({ ...DEFAULT_GROWTH_INPUTS, horizon: 12 });

  assert.equal(result.rows.length, 12);
  assert.ok(result.rows[0].clients > DEFAULT_GROWTH_INPUTS.launchClients);
  assert.ok(result.operatingBreakEvenMonth !== null);
});

test("payback fica não atingido quando o horizonte não recupera o investimento", () => {
  const result = calculateGrowthProjection({
    ...DEFAULT_GROWTH_INPUTS,
    newClients: 0,
    launchClients: 0,
    price: 20,
    fixedCosts: 10000,
    initialInvestment: 42500,
    horizon: 12,
  });

  assert.equal(result.paybackMonth, null);
});
