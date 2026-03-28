import { NextRequest, NextResponse } from "next/server";
import { askClaude, parseClaudeJSON } from "@/lib/claude";

const SYSTEM_PROMPT = `Você é um copywriter sênior especializado em redes sociais e marketing digital. Crie copy profissional e pronto para uso.

Responda em JSON com este formato exato:
{
  "caption": "copy completo pronto para usar (com quebras de linha usando \\n)",
  "hashtags": ["hashtag1", "hashtag2", "até 10 hashtags relevantes"],
  "cta": "call-to-action sugerido",
  "script": "roteiro detalhado se aplicável, null caso contrário",
  "notes": "dicas de uso e adaptação"
}

Responda APENAS com o JSON, sem markdown, sem blocos de código.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt, copyType, tone, platform, brandVoice, variations } = await request.json() as {
      prompt: string;
      copyType: string;
      tone: string;
      platform: string;
      brandVoice?: string;
      variations?: number;
    };

    if (!prompt) {
      return NextResponse.json({ error: "Prompt é obrigatório" }, { status: 400 });
    }

    const isShortForm = ["ad", "headline"].includes(copyType);
    const tier = isShortForm ? "fast" as const : "creative" as const;
    const maxTokens = isShortForm ? 1500 : 4096;
    const numVariations = Math.min(variations || 1, 5);

    const brandContext = brandVoice
      ? `\n\nBrand Voice do cliente: "${brandVoice}" — adapte o tom e linguagem para manter consistência com essa marca.`
      : "";

    const userMessage = `Tipo: ${copyType} | Tom: ${tone} | Plataforma: ${platform}
${numVariations > 1 ? `Gere ${numVariations} variações diferentes.` : ""}
${brandContext}

Briefing/Prompt: ${prompt}

${numVariations > 1
  ? `Responda com um array JSON de ${numVariations} objetos, cada um no formato especificado.`
  : "Crie o copy completo e pronto para uso."}`;

    const result = await askClaude(SYSTEM_PROMPT, userMessage, { tier, maxTokens });
    const parsed = parseClaudeJSON(result);

    return NextResponse.json(Array.isArray(parsed) ? { copies: parsed } : { copies: [parsed] });
  } catch (error) {
    console.error("CopyLab error:", error);
    return NextResponse.json({ error: "Erro ao gerar copy" }, { status: 500 });
  }
}
