import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/claude";
import { AnalyzedReference } from "@/lib/types";

const SYSTEM_PROMPT = `Você é um diretor criativo de uma agência de marketing digital. Com base nas referências de conteúdo viral analisadas, gere 5 ideias criativas e originais de conteúdo.

Cada ideia deve ser prática, executável e inspirada nos padrões que funcionaram nas referências.

Responda em JSON com este formato exato (array):
[
  {
    "id": "idea-1",
    "title": "título chamativo da ideia",
    "angle": "ângulo/perspectiva única do conteúdo",
    "format": "formato sugerido (ex: Reels 30s, Carrossel 7 slides)",
    "hook": "gancho dos primeiros 3 segundos ou primeira frase",
    "description": "descrição detalhada de 3-4 frases de como executar"
  }
]

Responda APENAS com o JSON, sem markdown, sem blocos de código.`;

export async function POST(request: NextRequest) {
  try {
    const { references, topic, platform, format } = await request.json() as {
      references: AnalyzedReference[];
      topic: string;
      platform: string;
      format: string;
    };

    const refsDescription = references.slice(0, 8).map(r =>
      `- "${r.caption?.slice(0, 150)}" (${r.likes} likes) | Análise: ${r.analysis}`
    ).join("\n");

    const userMessage = `Tema: "${topic}" | Plataforma: ${platform} | Formato preferido: ${format}

Referências analisadas:
${refsDescription}

Gere 5 ideias de conteúdo criativas baseadas nesses padrões virais.`;

    const result = await askClaude(SYSTEM_PROMPT, userMessage);
    const ideas = JSON.parse(result);

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Ideas error:", error);
    return NextResponse.json({ error: "Erro ao gerar ideias" }, { status: 500 });
  }
}
