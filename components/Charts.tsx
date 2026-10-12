import type { GrowthRow } from "@/lib/finance";

type ChartSeries = { key: string; color: string; values: number[] };

function chartGeometry(series: ChartSeries[], width = 640, height = 236) {
  const allValues = series.flatMap((item) => item.values);
  const min = Math.min(...allValues, 0);
  const max = Math.max(...allValues, 1);
  const range = max - min || 1;
  const padding = { top: 15, right: 15, bottom: 29, left: 49 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const x = (index: number, length: number) =>
    padding.left + (length <= 1 ? 0 : (index / (length - 1)) * plotWidth);
  const y = (value: number) => padding.top + ((max - value) / range) * plotHeight;

  return { min, max, padding, plotWidth, plotHeight, x, y, width, height };
}

function formatCompact(value: number): string {
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return `${Math.round(value)}`;
}

function Grid({ geometry }: { geometry: ReturnType<typeof chartGeometry> }) {
  const { padding, plotWidth, plotHeight, min, max, y } = geometry;
  return (
    <>
      {[0, 1, 2, 3].map((tick) => {
        const value = min + ((max - min) * tick) / 3;
        const lineY = y(value);
        return (
          <g key={tick}>
            <line x1={padding.left} x2={padding.left + plotWidth} y1={lineY} y2={lineY} stroke="rgba(180,233,207,.1)" />
            <text x={padding.left - 9} y={lineY + 3} textAnchor="end" fill="#607b6e" fontSize="9" fontFamily="DM Mono, monospace">
              {formatCompact(value)}
            </text>
          </g>
        );
      })}
      {min < 0 && max > 0 ? (
        <line x1={padding.left} x2={padding.left + plotWidth} y1={y(0)} y2={y(0)} stroke="rgba(129,245,189,.25)" strokeDasharray="4 4" />
      ) : null}
      <line x1={padding.left} x2={padding.left + plotWidth} y1={padding.top + plotHeight} y2={padding.top + plotHeight} stroke="rgba(180,233,207,.12)" />
    </>
  );
}

export function ResultCurveChart({ price, variableCost, fixedCosts, currentClients }: { price: number; variableCost: number; fixedCosts: number; currentClients: number }) {
  const maxClients = Math.max(300, Math.ceil(Math.max(currentClients, 1) / 50) * 50);
  const points = Array.from({ length: 13 }, (_, index) => (maxClients * index) / 12);
  const values = points.map((clients) => clients * (price - variableCost) - fixedCosts);
  const geometry = chartGeometry([{ key: "resultado", color: "#81f5bd", values }]);
  const path = points.map((_, index) => `${geometry.x(index, points.length)},${geometry.y(values[index])}`).join(" ");
  const area = `${geometry.padding.left},${geometry.y(0)} ${path} ${geometry.x(points.length - 1, points.length)},${geometry.padding.top + geometry.plotHeight}`;
  return (
    <div className="chart-wrap">
      <svg className="svg-chart" viewBox="0 0 640 236" role="img" aria-label="Evolução do resultado operacional por quantidade de clientes">
        <Grid geometry={geometry} />
        <polygon points={area} fill="rgba(129,245,189,.08)" />
        <polyline points={path} fill="none" stroke="#81f5bd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={geometry.x(points.length - 1, points.length)} cy={geometry.y(values.at(-1) ?? 0)} r="4.5" fill="#81f5bd" />
        <text x={geometry.padding.left} y="226" fill="#607b6e" fontSize="9" fontFamily="DM Mono, monospace">0 clientes</text>
        <text x={geometry.padding.left + geometry.plotWidth} y="226" textAnchor="end" fill="#607b6e" fontSize="9" fontFamily="DM Mono, monospace">{maxClients} clientes</text>
      </svg>
    </div>
  );
}

export function MultiLineChart({ series, labels, ariaLabel, formatter = formatCompact }: { series: ChartSeries[]; labels: string[]; ariaLabel: string; formatter?: (value: number) => string }) {
  const geometry = chartGeometry(series);
  return (
    <div className="chart-wrap">
      <svg className="svg-chart" viewBox="0 0 640 236" role="img" aria-label={ariaLabel}>
        <Grid geometry={geometry} />
        {series.map((item) => {
          const path = item.values.map((_, index) => `${geometry.x(index, item.values.length)},${geometry.y(item.values[index])}`).join(" ");
          return <polyline key={item.key} points={path} fill="none" stroke={item.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />;
        })}
        {labels.length > 0 ? (
          <>
            <text x={geometry.padding.left} y="226" fill="#607b6e" fontSize="9" fontFamily="DM Mono, monospace">{labels[0]}</text>
            <text x={geometry.padding.left + geometry.plotWidth} y="226" textAnchor="end" fill="#607b6e" fontSize="9" fontFamily="DM Mono, monospace">{labels.at(-1)}</text>
          </>
        ) : null}
        <text x={geometry.width - 16} y="15" textAnchor="end" fill="#607b6e" fontSize="9" fontFamily="DM Mono, monospace">{formatter(geometry.max)}</text>
      </svg>
    </div>
  );
}

export function GrowthResultChart({ rows }: { rows: GrowthRow[] }) {
  return (
    <MultiLineChart
      ariaLabel="Resultado operacional e resultado acumulado ao longo da projeção"
      labels={rows.map((row) => row.month)}
      series={[
        { key: "monthly", color: "#81f5bd", values: rows.map((row) => row.operatingResult) },
        { key: "cumulative", color: "#85d9ff", values: rows.map((row) => row.cumulativeResult) },
      ]}
      formatter={(value) => `R$ ${formatCompact(value)}`}
    />
  );
}
