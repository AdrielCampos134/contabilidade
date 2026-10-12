# nexo — contabilidade inteligente

Apresentação interativa de um projeto de contabilidade automatizada para pequenos negócios. O site combina narrativa de startup, demonstração de produto, cronograma e simuladores financeiros editáveis.

## Stack

- Next.js 15 com App Router
- React 19 + TypeScript
- CSS responsivo mobile-first
- Lucide React para ícones
- Funções financeiras isoladas em `lib/finance.ts`
- Testes nativos com `node:test` via `tsx`

## Executar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Verificações

```bash
npm test
npm run lint
npm run build
```

Os testes cobrem receita, custos variáveis, resultado operacional, ponto de equilíbrio, crescimento com churn, primeiro mês lucrativo, payback e cenários sem recuperação do investimento.

## Publicar na Vercel

1. Crie um repositório Git e envie este projeto.
2. Em [vercel.com](https://vercel.com), selecione **Add New Project** e importe o repositório.
3. Mantenha o framework como **Next.js** e os comandos padrão (`npm run build` / `next start`).
4. Clique em **Deploy**.

Não há variáveis de ambiente obrigatórias. O projeto é estático do ponto de vista de dados: as configurações do simulador são salvas no `localStorage` e compartilhadas por query string.

## Estrutura

- `app/page.tsx`: narrativa, seções da apresentação e navegação.
- `app/globals.css`: sistema visual, responsividade e modo de impressão.
- `components/FinancialSimulator.tsx`: simulador de viabilidade econômica.
- `components/GrowthSimulator.tsx`: projeção de crescimento, cenários e exportação CSV.
- `components/Charts.tsx`: gráficos SVG alimentados pelos mesmos resultados dos cards.
- `lib/finance.ts`: fórmulas, tipos, normalização e formatação monetária.
- `lib/finance.test.ts`: testes automatizados das regras financeiras.

As projeções são hipóteses de planejamento e não representam garantia de resultado.
