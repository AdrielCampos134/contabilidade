import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "nexo — contabilidade inteligente",
  description:
    "Apresentação interativa do projeto nexo: automação contábil, atendimento por WhatsApp e simuladores de viabilidade financeira.",
  keywords: ["contabilidade", "automação", "fintech", "WhatsApp", "simulador financeiro"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
