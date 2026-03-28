import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/claude";

const SYSTEM_PROMPT = `Você é um especialista em marketing digital e social media. Sua tarefa é decodificar briefings de clientes, que costumam ser bagunçados e incompletos.

Dado um briefing bruto, extraia e estruture as informações em JSON com este formato exato:
{
  "topic": "tema principal identificado",
  "platform": "instagram" ou "tiktok" (se não mencionado, assuma "instagram"),
  "format": "reels" ou "carrossel" ou "post" ou "stories" (se não mencionado, assuma "reels"),
  "tone": "tom de voz identificado ou sugerido",
  "audience": "público-alvo identificado",
  "requirements": ["lista de requisitos específicos mencionados"],
  "missingInfo": ["informações importantes que estão faltando"],
  "clarificationQuestions": ["perguntas que o social media deveria fazer ao cliente"],
  "summary": "resumo estruturado do briefing em 2-3 frases"
}

Responda APENAS com o JSON, sem markdown, sem blocos de código.`;

export async function POST(request: NextRequest) {
  try {
    const { briefing } = await request.json();

    if (!briefing || typeof briefing !== "string") {
      return NextResponse.json({ error: "Briefing é obrigatório" }, { status: 400 });
    }

    const result = await askClaude(SYSTEM_PROMPT, briefing);
    const parsed = JSON.parse(result);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Brief decode error:", error);
    return NextResponse.json({ error: "Erro ao decodificar briefing" }, { status: 500 });
  }
}
