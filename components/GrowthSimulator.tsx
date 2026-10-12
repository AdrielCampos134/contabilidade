"use client";

import { useMemo, useState } from "react";
import { Download, Info, Users, WalletCards } from "lucide-react";
import { DEFAULT_GROWTH_INPUTS, GrowthInputs, calculateGrowthProjection, formatBRL, formatNumber } from "@/lib/finance";
import { GrowthResultChart, MultiLineChart } from "@/components/Charts";

type Scenario = { key: string; label: string; newClients: number; color: string };
const SCENARIOS: Scenario[] = [
  { key: "conservative", label: "Conservador", newClients: 15, color: "#bdadff" },
  { key: "moderate", label: "Moderado", newClients: 30, color: "#81f5bd" },
  { key: "optimistic", label: "Otimista", newClients: 50, color: "#85d9ff" },
];

function numberValue(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): number {
  const value = Number(event.target.value);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export default function GrowthSimulator() {
  const [inputs, setInputs] = useState<GrowthInputs>(DEFAULT_GROWTH_INPUTS);
  const [scenarioKey, setScenarioKey] = useState("moderate");
  const selectedScenario = SCENARIOS.find((scenario) => scenario.key === scenarioKey) ?? SCENARIOS[1];
  const activeInputs = useMemo(() => ({ ...inputs, newClients: inputs.newClients }), [inputs]);
  const projection = useMemo(() => calculateGrowthProjection(activeInputs), [activeInputs]);
  const scenarioProjections = useMemo(() => SCENARIOS.map((scenario) => ({ scenario, projection: calculateGrowthProjection({ ...inputs, newClients: scenario.newClients }) })), [inputs]);
  const update = (key: keyof GrowthInputs) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target instanceof HTMLInputElement ? numberValue(event) : event.target.value;
    setInputs((current) => ({ ...current, [key]: key === "horizon" ? Number(value) as GrowthInputs["horizon"] : value }));
  };

  const exportProjection = () => {
    const rows = [["Mês", "Clientes ativos", "Receita", "Custos", "Resultado mensal", "Resultado acumulado"], ...projection.rows.map((row) => [row.month, row.clients.toFixed(2), row.revenue.toFixed(2), row.costs.toFixed(2), row.operatingResult.toFixed(2), row.cumulativeResult.toFixed(2)])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(";")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "nexo-projecao-de-crescimento.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <>
      <div className="scenario-row">
        {SCENARIOS.map((scenario) => <button type="button" key={scenario.key} className={`scenario-button ${scenarioKey === scenario.key ? "active" : ""}`} onClick={() => { setScenarioKey(scenario.key); setInputs((current) => ({ ...current, newClients: scenario.newClients })); }}><Users size={13} /><strong>{scenario.label}</strong> {scenario.newClients} novos/mês</button>)}
      </div>
      <div className="growth-sim-layout">
        <div className="panel control-panel">
          <div className="control-heading"><h3>Hipóteses de crescimento</h3><span>editável</span></div>
          <div className="field"><label htmlFor="launchClients">Clientes no lançamento <span>fev/27</span></label><input id="launchClients" type="number" min="0" step="1" value={inputs.launchClients} onChange={update("launchClients")} /></div>
          <div className="field"><label htmlFor="newClients">Novos clientes / mês <span>aquisição</span></label><input id="newClients" type="number" min="0" step="1" value={inputs.newClients} onChange={(event) => { update("newClients")(event); setScenarioKey("custom"); }} /></div>
          <div className="field"><label htmlFor="churnRate">Churn mensal <span>{inputs.churnRate}%</span></label><input id="churnRate" type="range" min="0" max="20" step="0.5" value={inputs.churnRate} onChange={update("churnRate")} /><input aria-label="Churn mensal numérico" type="number" min="0" max="100" step="0.5" value={inputs.churnRate} onChange={update("churnRate")} /></div>
          <div className="field"><label htmlFor="growthPrice">Preço da assinatura <span>R$ / mês</span></label><div className="input-wrap has-prefix"><span className="prefix">R$</span><input id="growthPrice" type="number" min="0" step="1" value={inputs.price} onChange={update("price")} /></div></div>
          <div className="field"><label htmlFor="growthFixedCosts">Custo fixo mensal <span>R$ / mês</span></label><div className="input-wrap has-prefix"><span className="prefix">R$</span><input id="growthFixedCosts" type="number" min="0" step="100" value={inputs.fixedCosts} onChange={update("fixedCosts")} /></div></div>
          <div className="field"><label htmlFor="growthVariableCost">Custo variável / cliente <span>R$ / cliente</span></label><div className="input-wrap has-prefix"><span className="prefix">R$</span><input id="growthVariableCost" type="number" min="0" step="1" value={inputs.variableCost} onChange={update("variableCost")} /></div></div>
          <div className="field"><label htmlFor="growthInvestment">Investimento inicial <span>R$ antes do lançamento</span></label><div className="input-wrap has-prefix"><span className="prefix">R$</span><input id="growthInvestment" type="number" min="0" step="500" value={inputs.initialInvestment} onChange={update("initialInvestment")} /></div></div>
          <div className="field"><label htmlFor="startMonth">Início da operação <span>premissa</span></label><select id="startMonth" value={inputs.startMonth} onChange={update("startMonth")}><option value="2027-02">Fevereiro de 2027</option><option value="2027-03">Março de 2027</option><option value="2027-04">Abril de 2027</option></select></div>
          <div className="field"><label htmlFor="horizon">Horizonte de projeção <span>meses</span></label><select id="horizon" value={inputs.horizon} onChange={update("horizon")}><option value="12">12 meses</option><option value="18">18 meses</option><option value="24">24 meses</option></select></div>
          <p className="save-note"><Info size={13} /> O modelo aplica churn antes de adicionar novos clientes e considera a receita do mês sobre a base final.</p>
        </div>

        <div className="results-panel">
          <div className="metric-grid growth-cards">
            <div className="metric-card highlight"><span>Clientes no fim</span><strong className="positive">{formatNumber(projection.finalClients, 0)}</strong><small>base projetada no mês {inputs.horizon}</small></div>
            <div className="metric-card"><span>Receita no fim</span><strong>{formatBRL(projection.finalRevenue)}</strong><small>faturamento mensal</small></div>
            <div className="metric-card"><span>Equilíbrio operacional</span><strong className={projection.operatingBreakEvenMonth ? "neutral" : "negative"}>{projection.operatingBreakEvenMonth ? `mês ${projection.operatingBreakEvenMonth}` : "Não atingido"}</strong><small>resultado mensal ≥ zero</small></div>
            <div className="metric-card"><span>Payback do investimento</span><strong className={projection.paybackMonth ? "positive" : "negative"}>{projection.paybackMonth ? `mês ${projection.paybackMonth}` : "Não atingido"}</strong><small>resultado acumulado ≥ zero</small></div>
          </div>
          <div className="growth-grid-two">
            <div className="panel chart-panel"><div className="chart-title"><h3>Crescimento da base</h3><span>3 cenários</span></div><MultiLineChart ariaLabel="Comparação do crescimento de clientes nos cenários" labels={projection.rows.map((row) => row.month)} series={scenarioProjections.map(({ scenario, projection: scenarioProjection }) => ({ key: scenario.key, color: scenario.color, values: scenarioProjection.rows.map((row) => row.clients) }))} formatter={(value) => `${formatNumber(value)} clientes`} /><div className="chart-legend"><span><i /> moderado</span><span><i className="blue" /> otimista</span></div></div>
            <div className="panel chart-panel"><div className="chart-title"><h3>Resultado da operação</h3><span>{selectedScenario.label}</span></div><GrowthResultChart rows={projection.rows} /><div className="chart-legend"><span><i /> mensal</span><span><i className="blue" /> acumulado</span></div></div>
          </div>
          <div className="panel table-panel"><div className="chart-title" style={{ padding: "19px 19px 0" }}><h3>Projeção mês a mês</h3><button type="button" className="download-button" onClick={exportProjection}><Download size={13} /> CSV</button></div><div className="table-scroll"><table><thead><tr><th>Mês</th><th>Clientes</th><th>Receita</th><th>Custos</th><th>Resultado</th><th>Acumulado</th></tr></thead><tbody>{projection.rows.map((row) => <tr key={row.monthIndex}><td><strong>{row.month}</strong></td><td>{formatNumber(row.clients, 0)}</td><td>{formatBRL(row.revenue)}</td><td>{formatBRL(row.costs)}</td><td className={row.operatingResult >= 0 ? "positive" : "negative"}>{formatBRL(row.operatingResult)}</td><td className={row.cumulativeResult >= 0 ? "positive" : "negative"}>{formatBRL(row.cumulativeResult)}</td></tr>)}</tbody></table></div></div>
          <div className="insight"><WalletCards size={16} /><span>Equilíbrio operacional e payback são indicadores diferentes: o primeiro mede quando um mês passa a ser positivo; o segundo, quando a soma dos resultados recupera o investimento inicial de {formatBRL(inputs.initialInvestment)}.</span></div>
        </div>
      </div>
    </>
  );
}
