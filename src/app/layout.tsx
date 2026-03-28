import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Musa — Referências de Conteúdo Viral",
  description: "Encontre referências de conteúdo viral, gere ideias criativas e produza copy pronto para suas redes sociais com inteligência artificial.",
  openGraph: {
    title: "Musa — Referências de Conteúdo Viral",
    description: "Transforme briefings em conteúdo viral com IA. Referências reais, ideias criativas e copy pronto para postar.",
    type: "website",
  },
  other: {
    "theme-color": "#09090b",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
