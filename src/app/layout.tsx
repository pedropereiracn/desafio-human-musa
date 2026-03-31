import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Analytics from "@/components/Analytics";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased relative">
        <TooltipProvider delayDuration={0}>
          <Analytics />
          <div className="relative z-10">
            {children}
          </div>
        </TooltipProvider>
        <Toaster
          theme="dark"
          position="bottom-right"
          richColors
          toastOptions={{
            style: {
              background: 'rgba(15, 15, 18, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.07)',
            },
          }}
        />
      </body>
    </html>
  );
}
