import { NextRequest, NextResponse } from "next/server";
import { askClaude, parseClaudeJSON } from "@/lib/claude";
import { Reference } from "@/lib/types";

const SYSTEM_PROMPT = `Você é um analista de conteúdo viral especializado em redes sociais. Analise os posts fornecidos e explique por que cada um funcionou (gancho, formato, timing, emoção, técnica de storytelling).

Para cada post, forneça uma análise concisa e uma nota de relevância de 1-10.

Responda em JSON com este formato exato (array):
[
  {
    "id": "id do post original",
    "analysis": "análise de 2-3 frases sobre por que viralizou",
    "relevanceScore": 8
  }
]

Responda APENAS com o JSON, sem markdown, sem blocos de código.`;

export async function POST(request: NextRequest) {
  try {
    const { references, topic, format } = await request.json() as {
      references: Reference[];
      topic: string;
      format: string;
    };

    const postsDescription = references.map(r =>
      `[ID: ${r.id}] @${r.author} - "${r.caption?.slice(0, 200)}" | Likes: ${r.likes} | Comentários: ${r.comments}`
    ).join("\n\n");

    const userMessage = `Tema buscado: "${topic}" | Formato: ${format}\n\nPosts encontrados:\n${postsDescription}`;
    const result = await askClaude(SYSTEM_PROMPT, userMessage);
    const analyses = parseClaudeJSON(result);

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json({ error: "Erro ao analisar referências" }, { status: 500 });
  }
}
