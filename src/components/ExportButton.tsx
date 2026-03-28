"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";
import { motion } from "motion/react";
import { CopyResult } from "@/lib/types";

interface ExportButtonProps {
  copy: CopyResult;
  topic: string;
  ideaTitle: string;
}

export default function ExportButton({ copy, topic, ideaTitle }: ExportButtonProps) {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    const content = [
      `═══════════════════════════════════════`,
      `  MUSA — Copy Gerado por IA`,
      `═══════════════════════════════════════`,
      ``,
      `Tema: ${topic}`,
      `Ideia: ${ideaTitle}`,
      `Data: ${new Date().toLocaleDateString("pt-BR")}`,
      ``,
      `───────────────────────────────────────`,
      `  CAPTION`,
      `───────────────────────────────────────`,
      ``,
      copy.caption,
      ``,
      `───────────────────────────────────────`,
      `  HASHTAGS`,
      `───────────────────────────────────────`,
      ``,
      copy.hashtags.map(h => `#${h}`).join(" "),
      ``,
      `───────────────────────────────────────`,
      `  CALL TO ACTION`,
      `───────────────────────────────────────`,
      ``,
      copy.cta,
      ``,
      ...(copy.script ? [
        `───────────────────────────────────────`,
        `  ROTEIRO`,
        `───────────────────────────────────────`,
        ``,
        copy.script,
        ``,
      ] : []),
      ...(copy.notes ? [
        `───────────────────────────────────────`,
        `  NOTAS DE PRODUÇÃO`,
        `───────────────────────────────────────`,
        ``,
        copy.notes,
        ``,
      ] : []),
      `═══════════════════════════════════════`,
      `  Gerado com Musa — Powered by Claude AI`,
      `═══════════════════════════════════════`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `musa-copy-${topic.toLowerCase().replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground border border-border hover:border-primary/20 transition-colors"
    >
      {exported ? (
        <>
          <Check size={16} className="text-green-400" />
          Exportado!
        </>
      ) : (
        <>
          <Download size={16} />
          Exportar .txt
        </>
      )}
    </motion.button>
  );
}
