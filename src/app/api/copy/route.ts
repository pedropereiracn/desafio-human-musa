import { NextRequest, NextResponse } from "next/server";
import { askClaude, parseClaudeJSON } from "@/lib/claude";
import { Idea } from "@/lib/types";

const SYSTEM_PROMPT = `Você é um copywriter sênior especializado em redes sociais. Crie copy/roteiro completo e profissional para a plataforma indicada.

Adapte o tom, formato e linguagem para a plataforma. Seja específico e prático — o conteúdo deve estar pronto para produção.

Responda em JSON com este formato exato:
{
  "caption": "caption completa pronta para postar (com quebras de linha usando \\n)",
  "hashtags": ["hashtag1", "hashtag2", "até 15 hashtags relevantes"],
  "cta": "call-to-action sugerido",
  "script": "roteiro detalhado cena-a-cena (se for vídeo/reels). Inclua: [CENA 1] descrição, fala, texto na tela. Null se não for vídeo.",
  "notes": "notas de produção: dicas de filmagem, música, edição"
}

Responda APENAS com o JSON, sem markdown, sem blocos de código.`;

export async function POST(request: NextRequest) {
  try {
    const { idea, topic, platform, format } = await request.json() as {
      idea: Idea;
      topic: string;
      platform: string;
      format: string;
    };

    const userMessage = `Plataforma: ${platform} | Formato: ${format} | Tema: "${topic}"

Ideia selecionada:
- Título: ${idea.title}
- Ângulo: ${idea.angle}
- Formato: ${idea.format}
- Gancho: ${idea.hook}
- Descrição: ${idea.description}

Crie o copy/roteiro completo e pronto para produção.`;

    const result = await askClaude(SYSTEM_PROMPT, userMessage);
    const copy = parseClaudeJSON(result);

    return NextResponse.json(copy);
  } catch (error) {
    console.error("Copy error:", error);
    return NextResponse.json({ error: "Erro ao gerar copy" }, { status: 500 });
  }
}
