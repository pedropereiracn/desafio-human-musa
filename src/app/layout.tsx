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
  title: "Musa — Workspace de Conteúdo para Agências",
  description: "O workspace completo que sua agência precisava. Referências virais, geração de copy, gestão de clientes e relatórios — tudo com IA nativa.",
  openGraph: {
    title: "Musa — Workspace de Conteúdo para Agências",
    description: "Referências virais, Copy Lab, gestão de clientes e relatórios — tudo com IA nativa, num lugar só.",
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
