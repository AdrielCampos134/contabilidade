"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  ClipboardList,
  FileCheck2,
  FileText,
  Gauge,
  Headphones,
  Landmark,
  Menu,
  MessageCircle,
  Network,
  PlugZap,
  Receipt,
  RotateCw,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  UsersRound,
  Wallet,
  Workflow,
  X,
} from "lucide-react";
import FinancialSimulator from "@/components/FinancialSimulator";
import GrowthSimulator from "@/components/GrowthSimulator";

const chatExamples = {
  declaration: {
    label: "Declaração anual",
    messages: [
      { type: "user", text: "Olá, preciso organizar minha declaração anual." },
      { type: "bot", text: "Claro! Vou conferir as informações do seu negócio." },
      { type: "user", text: "Quero saber quais documentos estão faltando." },
      { type: "bot", text: "Encontrei 2 pendências e já deixei a lista pronta para você." },
    ],
  },
  billing: {
    label: "Faturamento",
    messages: [
      { type: "user", text: "Quero registrar o faturamento de setembro." },
      { type: "bot", text: "Posso ajudar. Qual foi o valor total e a data de fechamento?" },
      { type: "user", text: "Foram R$ 18.400 no mês." },
      { type: "bot", text: "Registrado. Vou atualizar seu painel e sinalizar a próxima obrigação." },
    ],
  },
  reminder: {
    label: "Lembrete fiscal",
    messages: [
      { type: "user", text: "Tenho algum vencimento nos próximos dias?" },
      { type: "bot", text: "Sim. A guia do mês vence em 5 dias e ainda não foi confirmada." },
      { type: "user", text: "Pode me lembrar amanhã de manhã?" },
      { type: "bot", text: "Combinado. Também deixei o documento disponível no seu histórico." },
    ],
  },
};

const mvpFeatures: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: MessageCircle, title: "Atendimento automatizado", text: "Primeira camada de atendimento via WhatsApp, com encaminhamento quando necessário." },
  { icon: UsersRound, title: "Cadastro de clientes", text: "Uma visão organizada do negócio, contatos e informações essenciais." },
  { icon: FileCheck2, title: "Documentos em ordem", text: "Central de pendências, recebimentos e status de cada solicitação." },
  { icon: Receipt, title: "Registro de faturamento", text: "Base simples para acompanhar entradas e preparar solicitações fiscais." },
  { icon: ClipboardList, title: "Solicitações fiscais", text: "Fluxos guiados para reduzir retrabalho e esquecimentos operacionais." },
  { icon: CircleAlert, title: "Lembretes de vencimentos", text: "Alertas para que cada obrigação tenha um próximo passo claro." },
  { icon: Gauge, title: "Painel administrativo", text: "Fila de clientes, solicitações e exceções em um único lugar." },
  { icon: Headphones, title: "Apoio humano", text: "Casos fora da automação seguem para o profissional responsável." },
];

const expansionFeatures: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Receipt, title: "Emissão de notas", text: "Possível conexão futura com emissão e acompanhamento de documentos." },
  { icon: Wallet, title: "Gestão financeira", text: "Mais contexto para decisões de caixa e acompanhamento do negócio." },
  { icon: FileText, title: "Relatórios personalizados", text: "Visões adaptadas ao momento e ao perfil de cada cliente." },
  { icon: PlugZap, title: "Integrações contábeis", text: "Conectores com ferramentas já usadas por escritórios e empresas." },
];

const timeline = [
  ["01", "Outubro de 2026", "Planejamento, arquitetura e definição do produto."],
  ["02", "Novembro de 2026", "Chatbot, cadastro de clientes e infraestrutura."],
  ["03", "Dezembro de 2026", "Painel, automações, integrações e pagamentos."],
  ["04", "Janeiro de 2027", "Testes, validação e implantação piloto."],
  ["05", "Fevereiro de 2027", "Lançamento e primeiros clientes pagantes."],
];

const challenges = ["Integração com sistemas existentes", "Confiabilidade das automações", "Correção de falhas e qualidade", "Retenção dos assinantes", "Capacidade de expansão"];
const nextSteps = ["Definir o escopo do MVP", "Organizar a equipe de desenvolvimento", "Escolher as ferramentas tecnológicas", "Desenvolver a primeira versão", "Testar com clientes reais", "Operar o MVP até fevereiro de 2027"];

function Logo() {
  return <a className="brand" href="#top" aria-label="nexo — início"><span className="brand-mark">n</span><span>nexo</span><small>CONTÁBIL AI</small></a>;
}

function SectionHeader({ index, eyebrow, title, copy }: { index: string; eyebrow: string; title: string; copy?: string }) {
  return <div className="section-header"><div><span className="eyebrow">{index} / {eyebrow}</span><h2 className="section-title">{title}</h2></div>{copy ? <p className="section-copy">{copy}</p> : null}</div>;
}

function ChatDemo() {
  const [active, setActive] = useState<keyof typeof chatExamples>("declaration");
  const current = chatExamples[active];
  return <div className="panel chat-panel"><div className="chat-head"><span className="chat-avatar"><Bot size={16} /></span><div><strong>nexo assistente</strong><span>DEMONSTRAÇÃO INTERATIVA</span></div><span style={{ marginLeft: "auto", color: "var(--mint)" }}><CircleCheck size={16} /></span></div><div className="chat-demo">{(Object.keys(chatExamples) as (keyof typeof chatExamples)[]).map((key) => <button type="button" key={key} className={active === key ? "active" : ""} onClick={() => setActive(key)}>{chatExamples[key].label}</button>)}</div><div className="chat-messages">{current.messages.map((message, index) => <div key={`${active}-${index}`} className={`bubble ${message.type === "user" ? "user" : ""}`}>{message.text}</div>)}</div><p className="demo-note">fluxo ilustrativo · não representa uma conversa em produção</p></div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <main id="top" className="page-shell">
      <header className="site-header"><div className="container nav-wrap"><Logo /><nav className={`nav-links ${menuOpen ? "open" : ""}`} aria-label="Navegação principal"><a href="#projeto" onClick={closeMenu}>O projeto</a><a href="#produto" onClick={closeMenu}>Produto</a><a href="#cronograma" onClick={closeMenu}>Cronograma</a><a href="#simuladores" onClick={closeMenu}>Simuladores</a></nav><a className="nav-cta" href="#simuladores">Explorar números <ArrowRight size={13} /></a><button type="button" className="nav-toggle" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={17} /> : <Menu size={17} />}</button></div></header>

      <section className="hero"><div className="container hero-grid"><div><span className="eyebrow">projeto em construção · 2026</span><h1 className="display">Uma nova forma de cuidar da <em>contabilidade.</em></h1><p className="lead">Uma plataforma que combina inteligência artificial, automação e atendimento pelo WhatsApp para simplificar as rotinas contábeis e fiscais de pequenos negócios.</p><div className="hero-actions"><a className="button-primary" href="#projeto">Conhecer o projeto <ArrowRight size={15} /></a><a className="button-secondary" href="#simuladores">Simular resultados <ChevronDown size={15} /></a></div><p className="hero-note"><Sparkles size={13} /> Apresentação interativa para os sócios · premissas de planejamento</p></div><div className="hero-console" aria-label="Resumo visual da operação"><div className="console-top"><div className="console-dots"><i /><i /><i /></div><span className="console-label">nexo / PROJECT OVERVIEW</span><span className="console-label">v.01</span></div><div className="console-body"><span className="console-kicker">Saúde projetada da operação</span><div className="console-value"><strong>68%</strong><span>+12,4% vs. cenário inicial</span></div><div className="console-chart">{[39, 47, 43, 58, 54, 66, 61, 76, 72, 85].map((height, index) => <span className="console-bar" style={{ height: `${height}%`, animationDelay: `${index * 60}ms` }} key={index} />)}</div><div className="console-foot"><span>OUT 26</span><span>FEV 27</span><span>SET 27</span></div><div className="console-cards"><div className="console-card"><span>lançamento</span><strong className="green">FEV / 27</strong></div><div className="console-card"><span>operação fixa</span><strong className="blue">R$ 10k</strong></div><div className="console-card"><span>modelo</span><strong className="violet">RECORRENTE</strong></div></div></div></div></div></section>

      <div className="proof-strip"><div className="container proof-grid"><div className="proof-item"><span>janela de MVP</span><strong>3–4 meses</strong></div><div className="proof-item"><span>lançamento previsto</span><strong className="mint">fevereiro / 2027</strong></div><div className="proof-item"><span>operação mensal</span><strong>R$ 10.000</strong></div><div className="proof-item"><span>modelo de receita</span><strong>assinatura recorrente</strong></div></div></div>

      <section id="projeto" className="section section-tint"><div className="container"><SectionHeader index="01" eyebrow="o projeto" title="Menos burocracia. Mais clareza para quem empreende." copy="A proposta nasce de um problema cotidiano: pequenas empresas ainda dependem de muitos sistemas, tarefas manuais e trocas de mensagens para cumprir rotinas que poderiam ser simples." /><div className="problem-grid"><div className="panel problem-panel"><span className="panel-label">o cenário atual</span><h3 className="panel-heading">O trabalho contábil se perde em pequenas fricções.</h3><ul className="check-list"><li><CircleAlert size={14} /> Burocracia e processos repetitivos.</li><li><CircleAlert size={14} /> Organização financeira espalhada.</li><li><CircleAlert size={14} /> Dependência de atendimento manual.</li><li><CircleAlert size={14} /> Falta de acompanhamento de obrigações.</li><li><CircleAlert size={14} /> Muitos sistemas para uma única tarefa.</li><li><CircleAlert size={14} /> Pouca visibilidade do próximo passo.</li></ul></div><div className="panel problem-panel solution"><span className="panel-label">a proposta nexo</span><h3 className="panel-heading">Uma camada inteligente entre o cliente e a operação.</h3><ul className="check-list"><li><Check size={14} /> Cliente conversa pelo canal que já conhece.</li><li><Check size={14} /> IA entende a intenção e organiza a solicitação.</li><li><Check size={14} /> Backend consulta documentos e dados disponíveis.</li><li><Check size={14} /> Automação executa o que é permitido.</li><li><Check size={14} /> Profissional entra quando o caso pede contexto.</li><li><Check size={14} /> Cliente recebe uma resposta clara e rastreável.</li></ul><div className="solution-foot"><span className="tag mint"><Sparkles size={12} /> IA aplicada</span><span className="tag"><MessageCircle size={12} /> WhatsApp first</span><span className="tag"><ShieldCheck size={12} /> humano no loop</span></div></div></div></div></section>

      <section id="produto" className="section"><div className="container"><SectionHeader index="02" eyebrow="como funciona" title="Da mensagem à resolução, em um fluxo que faz sentido." copy="A tecnologia organiza a jornada sem tirar o profissional da equação. O sistema cuida do volume; o especialista cuida das exceções e das decisões." /><div className="flow-layout"><div className="panel flow-panel"><span className="panel-label">arquitetura do serviço</span><div className="flow-track"><div className="flow-node"><UserRound size={16} /><span>Cliente</span></div><ChevronRight className="flow-arrow" size={14} /><div className="flow-node"><MessageCircle size={16} /><span>WhatsApp</span></div><ChevronRight className="flow-arrow" size={14} /><div className="flow-node"><Bot size={16} /><span>Assistente IA</span></div><ChevronRight className="flow-arrow" size={14} /><div className="flow-node"><Network size={16} /><span>Backend</span></div><ChevronRight className="flow-arrow" size={14} /><div className="flow-node"><Workflow size={16} /><span>Automação</span></div><ChevronRight className="flow-arrow" size={14} /><div className="flow-node"><Headphones size={16} /><span>Humano</span></div></div><p className="flow-caption">Cada solicitação pode terminar com um documento, uma informação, uma confirmação ou um encaminhamento — sempre com o histórico do que aconteceu.</p></div><ChatDemo /></div></div></section>

      <section className="section section-tint"><div className="container"><SectionHeader index="03" eyebrow="escopo do produto" title="Um MVP enxuto, com espaço para evoluir." copy="O primeiro ciclo prioriza os fluxos que geram valor operacional com menor complexidade. Expansões são hipóteses de produto, não funcionalidades já entregues." /><div className="feature-grid">{mvpFeatures.map(({ icon: Icon, title, text }) => <div className="feature-card" key={title}><span className="feature-icon"><Icon size={17} /></span><h3>{title}</h3><p>{text}</p><span className="feature-badge">mvp inicial</span></div>)}</div><div style={{ height: 30 }} /><div className="feature-grid">{expansionFeatures.map(({ icon: Icon, title, text }) => <div className="feature-card future" key={title}><span className="feature-icon"><Icon size={17} /></span><h3>{title}</h3><p>{text}</p><span className="feature-badge">expansão possível</span></div>)}</div></div></section>

      <section id="cronograma" className="section"><div className="container"><SectionHeader index="04" eyebrow="cronograma estimado" title="Cinco marcos para sair da ideia e chegar ao piloto." copy="O calendário é uma meta de execução, não uma promessa. Cada etapa deve ser validada antes de abrir a próxima frente." /><div className="timeline">{timeline.map(([number, date, text]) => <div className="timeline-item" key={number}><span className="timeline-dot">{number}</span><span className="timeline-date">{date}</span><strong>{text}</strong><p>{number === "05" ? "MVP operacional com primeiros clientes pagantes." : "Meta estimada do projeto."}</p></div>)}</div><p className="estimated"><CircleAlert size={12} style={{ verticalAlign: "-2px", marginRight: 5 }} /> As datas refletem o planejamento atual e podem mudar conforme validações técnicas e de mercado.</p></div></section>

      <section id="simuladores" className="sim-section"><div className="container"><div className="sim-header"><div><span className="eyebrow">05 / viabilidade financeira</span><h2 className="sim-title">Os números respondem melhor quando você pode mexer neles.</h2></div><p className="section-copy">Ajuste mensalidade, base de clientes e custos. O dashboard recalcula tudo na hora, sem esconder as premissas por trás do resultado.</p></div><FinancialSimulator /><div className="growth-section"><div className="sim-header"><div><span className="eyebrow">06 / crescimento e retorno</span><h2 className="sim-title">Crescer é uma curva. Recuperar o investimento é outra.</h2></div><p className="section-copy">Compare cenários de aquisição, churn e prazo. A projeção separa equilíbrio operacional de payback para a leitura não misturar conceitos.</p></div><GrowthSimulator /></div></div></section>

      <section className="section section-tint"><div className="container"><SectionHeader index="07" eyebrow="escala e execução" title="A oportunidade está em transformar rotina em capacidade." copy="O mesmo sistema pode suportar mais clientes, mais serviços e mais contexto — desde que a execução prove confiabilidade antes de ampliar o escopo." /><div className="scale-grid"><div className="scale-card"><span className="eyebrow">potencial de escala</span><h3>Mais valor por camada de automação.</h3><ul className="scale-list"><li><Sparkles size={14} /> Mais clientes utilizando a mesma base operacional.</li><li><RotateCw size={14} /> Redução progressiva de tarefas repetitivas.</li><li><PlugZap size={14} /> Integração de novos serviços e sistemas.</li><li><Landmark size={14} /> Melhor aproveitamento da estrutura contábil existente.</li><li><ArrowDownRight size={14} /> Possibilidade futura de licenciar a plataforma para outros escritórios.</li></ul></div><div className="scale-card warning-card"><span className="eyebrow" style={{ color: "var(--warning)" }}>pontos de atenção</span><h3>O produto precisa merecer a confiança.</h3><ul className="scale-list">{challenges.map((challenge) => <li key={challenge}><CircleAlert size={14} /> {challenge}</li>)}</ul></div></div><div className="next-steps">{nextSteps.map((step, index) => <div className="next-step" key={step}><b>{String(index + 1).padStart(2, "0")}</b><p>{step}</p></div>)}</div></div></section>

      <footer className="footer"><div className="container footer-row"><div><Logo /><p className="footer-copy">Uma apresentação interativa de um projeto de contabilidade automatizada. Projeções são hipóteses de planejamento e não representam garantia de resultado.</p></div><div className="footer-right"><span>STATUS / EM PLANEJAMENTO</span>mvp previsto para fevereiro de 2027<br />contábil AI · versão de apresentação</div></div></footer>
      <a className="mobile-sim" href="#simuladores"><Gauge size={14} /> Simular</a>
    </main>
  );
}
