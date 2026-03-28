import { NextRequest, NextResponse } from "next/server";
import { askClaude, parseClaudeJSON } from "@/lib/claude";

const SYSTEM_PROMPT = `Você é um analista de marketing digital. Transforme métricas brutas em um relatório estruturado e profissional.

Responda em JSON com este formato exato:
{
  "title": "Título do relatório",
  "period": "Período analisado",
  "summary": "Resumo executivo em 2-3 frases",
  "metrics": {
    "impressions": "valor formatado",
    "reach": "valor formatado",
    "engagement": "valor formatado",
    "growth": "valor formatado"
  },
  "highlights": ["destaque 1", "destaque 2", "destaque 3"],
  "recommendations": ["recomendação 1", "recomendação 2", "recomendação 3"],
  "conclusion": "Conclusão e próximos passos"
}

Responda APENAS com o JSON, sem markdown, sem blocos de código.`;

export async function POST(request: NextRequest) {
  try {
    const { metricsText, clientName } = await request.json() as {
      metricsText: string;
      clientName?: string;
    };

    if (!metricsText) {
      return NextResponse.json({ error: "Métricas são obrigatórias" }, { status: 400 });
    }

    const userMessage = `${clientName ? `Cliente: ${clientName}\n\n` : ""}Métricas brutas:\n${metricsText}\n\nTransforme em um relatório profissional e estruturado.`;

    const result = await askClaude(SYSTEM_PROMPT, userMessage, { tier: "fast", maxTokens: 2000 });
    const parsed = parseClaudeJSON(result);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 });
  }
}
