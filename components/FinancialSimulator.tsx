"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Clipboard, Download, Info, RotateCcw, Share2, TrendingDown, TrendingUp } from "lucide-react";
import { DEFAULT_FINANCIAL_INPUTS, FinancialInputs, QUICK_PRICES, calculateFinancialSummary, formatBRL, formatNumber } from "@/lib/finance";
import { ResultCurveChart } from "@/components/Charts";

const STORAGE_KEY = "nexo-financial-simulation";

function parseQueryState(): Partial<FinancialInputs> | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("sim");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, number>;
    const next: Partial<FinancialInputs> = {};
    const entries: [keyof FinancialInputs, unknown][] = [
      ["price", parsed.p],
      ["clients", parsed.c],
      ["fixedCosts", parsed.f],
      ["variableCost", parsed.v],
      ["initialInvestment", parsed.i],
      ["targetProfit", parsed.t],
    ];
    entries.forEach(([key, value]) => {
      if (typeof value === "number" && Number.isFinite(value)) next[key] = Math.max(0, value);
    });
    return next;
  } catch {
    return null;
  }
}

function numberValue(event: React.ChangeEvent<HTMLInputElement>): number {
  const value = Number(event.target.value);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export default function FinancialSimulator() {
  const [inputs, setInputs] = useState<FinancialInputs>(DEFAULT_FINANCIAL_INPUTS);
  const [hydrated, setHydrated] = useState(false);
  const [shared, setShared] = useState(false);
  const summary = useMemo(() => calculateFinancialSummary(inputs), [inputs]);

  useEffect(() => {
    const fromUrl = parseQueryState();
    if (fromUrl) setInputs((current) => ({ ...current, ...fromUrl }));
    else {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) setInputs((current) => ({ ...current, ...JSON.parse(saved) }));
      } catch { /* storage can be unavailable in private browsing */ }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs)); } catch { /* storage can be unavailable in private browsing */ }
    }
  }, [inputs, hydrated]);

  const update = (key: keyof FinancialInputs) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((current) => ({ ...current, [key]: numberValue(event) }));
  };

  const restore = () => {
    setInputs(DEFAULT_FINANCIAL_INPUTS);
    window.history.replaceState({}, "", window.location.pathname);
  };

  const share = async () => {
    const url = new URL(window.location.href);
    url.search = new URLSearchParams({
      sim: JSON.stringify({ p: inputs.price, c: inputs.clients, f: inputs.fixedCosts, v: inputs.variableCost, i: inputs.initialInvestment, t: inputs.targetProfit }),
    }).toString();
    window.history.replaceState({}, "", url.toString());
    try { await navigator.clipboard.writeText(url.toString()); } catch { /* clipboard is optional */ }
    setShared(true);
    window.setTimeout(() => setShared(false), 2200);
  };

  const exportCsv = () => {
    const rows = [
      ["Indicador", "Valor"],
      ["Mensalidade", inputs.price],
      ["Clientes ativos", inputs.clients],
      ["Custos fixos", inputs.fixedCosts],
      ["Custo variável por cliente", inputs.variableCost],
      ["Investimento inicial", inputs.initialInvestment],
      ["Faturamento mensal", summary.monthlyRevenue],
      ["Despesa mensal", summary.monthlyOperatingExpense],
      ["Resultado operacional", summary.monthlyOperatingResult],
      ["Ponto de equilíbrio", summary.breakEvenClients ?? "Não atingível"],
      ["Clientes para meta", summary.clientsForTarget ?? "Não atingível"],
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(";")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "nexo-simulacao-financeira.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const resultClass = summary.monthlyOperatingResult >= 0 ? "positive" : "negative";
  const marginClass = summary.operatingMargin >= 0 ? "positive" : "negative";

  return (
    <div className="sim-layout">
      <div className="panel control-panel">
        <div className="control-heading"><h3>Parâmetros da operação</h3><span>editável</span></div>
        <div className="field"><label htmlFor="price">Mensalidade por cliente <span>R$ / mês</span></label><div className="input-wrap has-prefix"><span className="prefix">R$</span><input id="price" type="number" min="0" step="1" value={inputs.price} onChange={update("price")} /></div><div className="quick-prices">{QUICK_PRICES.map((price) => <button key={price} type="button" className={inputs.price === price ? "active" : ""} onClick={() => setInputs((current) => ({ ...current, price }))}>R$ {price}</button>)}</div></div>
        <div className="field"><label htmlFor="clients">Clientes ativos <span>unidades</span></label><input id="clients" type="number" min="0" step="1" value={inputs.clients} onChange={update("clients")} /></div>
        <div className="field"><label htmlFor="fixedCosts">Custos fixos mensais <span>R$ / mês</span></label><div className="input-wrap has-prefix"><span className="prefix">R$</span><input id="fixedCosts" type="number" min="0" step="100" value={inputs.fixedCosts} onChange={update("fixedCosts")} /></div></div>
        <div className="field"><label htmlFor="variableCost">Custo variável por cliente <span>R$ / cliente</span></label><div className="input-wrap has-prefix"><span className="prefix">R$</span><input id="variableCost" type="number" min="0" step="1" value={inputs.variableCost} onChange={update("variableCost")} /></div></div>
        <div className="field"><label htmlFor="initialInvestment">Investimento inicial <span>R$ antes do lançamento</span></label><div className="input-wrap has-prefix"><span className="prefix">R$</span><input id="initialInvestment" type="number" min="0" step="500" value={inputs.initialInvestment} onChange={update("initialInvestment")} /></div></div>
        <div className="field"><label htmlFor="targetProfit">Meta de lucro mensal <span>R$ / mês</span></label><div className="input-wrap has-prefix"><span className="prefix">R$</span><input id="targetProfit" type="number" min="0" step="500" value={inputs.targetProfit} onChange={update("targetProfit")} /></div></div>
        <div className="control-actions"><button type="button" className="primary-action" onClick={share}>{shared ? <><Check size={13} /> Link copiado</> : <><Share2 size={13} /> Compartilhar</>}</button><button type="button" onClick={restore}><RotateCcw size={13} /> Restaurar</button></div>
        <p className="save-note"><Info size={13} /> Suas configurações ficam salvas neste navegador. O link compartilhado carrega os parâmetros atuais.</p>
      </div>

      <div className="results-panel">
        <div className="metric-grid">
          <div className="metric-card highlight"><span>Faturamento mensal</span><strong className="positive">{formatBRL(summary.monthlyRevenue)}</strong><small>{formatBRL(summary.annualRevenue)} anualizado</small></div>
          <div className="metric-card"><span>Despesa operacional</span><strong>{formatBRL(summary.monthlyOperatingExpense)}</strong><small>{formatBRL(summary.monthlyVariableCosts)} variáveis</small></div>
          <div className="metric-card"><span>Resultado mensal</span><strong className={resultClass}>{formatBRL(summary.monthlyOperatingResult)}</strong><small>{summary.monthlyOperatingResult >= 0 ? "operação positiva" : "operação no prejuízo"}</small></div>
          <div className="metric-card"><span>Margem operacional</span><strong className={marginClass}>{formatNumber(summary.operatingMargin * 100, 1)}%</strong><small>resultado ÷ faturamento</small></div>
          <div className="metric-card"><span>Ponto de equilíbrio</span><strong className={summary.breakEvenClients ? "neutral" : "negative"}>{summary.breakEvenClients ? `${formatNumber(summary.breakEvenClients)} clientes` : "Não possível"}</strong><small>custos fixos ÷ margem de contribuição</small></div>
          <div className="metric-card"><span>Clientes para a meta</span><strong className={summary.clientsForTarget ? "neutral" : "negative"}>{summary.clientsForTarget ? `${formatNumber(summary.clientsForTarget)} clientes` : "Não possível"}</strong><small>meta de {formatBRL(inputs.targetProfit)} / mês</small></div>
        </div>
        <div className="panel chart-panel"><div className="chart-title"><h3>Resultado conforme a base cresce</h3><span>simulação dinâmica</span></div><ResultCurveChart price={inputs.price} variableCost={inputs.variableCost} fixedCosts={inputs.fixedCosts} currentClients={inputs.clients} /><div className="chart-legend"><span><i /> resultado operacional</span><span>linha zero = equilíbrio</span></div></div>
        <div className="insight">{summary.monthlyOperatingResult >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}<span>{summary.monthlyOperatingResult >= 0 ? `Com ${formatNumber(inputs.clients)} clientes, a operação já gera ${formatBRL(summary.monthlyOperatingResult)} por mês antes do investimento inicial.` : `Faltam ${formatNumber(Math.max((summary.breakEvenClients ?? 0) - inputs.clients, 0))} clientes para atingir o equilíbrio operacional neste cenário.`}</span></div>
        <button type="button" className="download-button" onClick={exportCsv}><Download size={13} /> Exportar resumo CSV</button>
      </div>
    </div>
  );
}
