import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Creator HUB - Agentes de IA para Criadores",
  description: "Plataforma com agentes especializados de IA para criadores de conteúdo, desenvolvedores, designers e profissionais criativos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}