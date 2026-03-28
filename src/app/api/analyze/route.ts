import { NextRequest, NextResponse } from "next/server";
import { askClaude, parseClaudeJSON } from "@/lib/claude";
import { Reference } from "@/lib/types";

const SYSTEM_PROMPT = `Você é um analista de conteúdo viral especializado em redes sociais. Analise cada post nas 7 dimensões de viralidade:

1. **Hook** — Tipo de gancho usado (curiosity gap, pain point, social proof, controversial opinion, before/after, direct challenge, insider secret, time pressure, confession, question hook, number hook, POV hook)
2. **Emoção** — Gatilho emocional principal (FOMO, aspiração, indignação, nostalgia, humor, pertencimento, empoderamento)
3. **Formato** — Estrutura que impulsiona a retenção (listicle, antes/depois, POV, tutorial, story arc, challenge)
4. **Storytelling** — Arco narrativo: setup → tensão → payoff. Fator de identificação
5. **Visual** — Qualidade do thumbnail, text overlay, transições, pacing
6. **Comunidade** — Potencial de reply-bait, save, share, duet/stitch
7. **Timing** — Relevância de tendência, sazonalidade, momento cultural

Para cada post, forneça análise detalhada com scoring por dimensão.

Responda em JSON com este formato exato (array):
[
  {
    "id": "id do post original",
    "analysis": "análise detalhada de 3-4 frases cobrindo as dimensões mais relevantes",
    "relevanceScore": 8,
    "hookType": "curiosity gap",
    "emotionalTrigger": "FOMO"
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
      `[ID: ${r.id}] @${r.author} - "${r.caption?.slice(0, 100)}" | Views: ${r.views || 0} | Likes: ${r.likes} | Comentários: ${r.comments} | Shares: ${r.shares}`
    ).join("\n\n");

    const userMessage = `Tema buscado: "${topic}" | Formato: ${format}\n\nPosts encontrados:\n${postsDescription}`;
    const result = await askClaude(SYSTEM_PROMPT, userMessage, { tier: "fast", maxTokens: 4096 });
    const analyses = parseClaudeJSON(result);

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json({ error: "Erro ao analisar referências" }, { status: 500 });
  }
}
