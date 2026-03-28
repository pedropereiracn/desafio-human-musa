import { NextRequest, NextResponse } from "next/server";
import { askClaude, parseClaudeJSON } from "@/lib/claude";
import { Idea } from "@/lib/types";

const SYSTEM_PROMPT = `Você é um copywriter sênior especializado em redes sociais. Crie copy/roteiro completo e profissional para a plataforma indicada.

Use o framework de copy mais adequado para o conteúdo:
- **PAS** (Problem → Agitate → Solve): para conteúdo focado em dores/problemas
- **AIDA** (Attention → Interest → Desire → Action): para lançamentos e promoções
- **BAB** (Before → After → Bridge): para conteúdo transformacional/case studies
- **4Cs** (Clear → Concise → Compelling → Credible): para conteúdo educacional

Adapte tom, formato e linguagem para a plataforma. Conteúdo deve estar pronto para produção.

Responda em JSON com este formato exato:
{
  "caption": "caption completa pronta para postar (com quebras de linha usando \\n)",
  "hashtags": ["hashtag1", "hashtag2", "até 15 hashtags relevantes"],
  "cta": "call-to-action sugerido",
  "script": "roteiro detalhado cena-a-cena (se for vídeo/reels). Inclua: [CENA 1] descrição, fala, texto na tela. Null se não for vídeo.",
  "notes": "notas de produção: dicas de filmagem, música, edição",
  "hookVariations": ["variação 1 do gancho", "variação 2 do gancho", "variação 3 do gancho"],
  "engagementScore": 8,
  "bestTimeToPost": "horário/dia recomendado para postar baseado na plataforma e tipo de conteúdo"
}

Para hookVariations: gere 3 opções diferentes de gancho/abertura para o conteúdo.
Para engagementScore: avalie de 1-10 baseado em: força do hook (0-2), clareza do gatilho emocional (0-2), potencial de save/share (0-2), fit plataforma-formato (0-2), alinhamento com tendências (0-2).
Para bestTimeToPost: considere o público-alvo brasileiro e a plataforma.

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
