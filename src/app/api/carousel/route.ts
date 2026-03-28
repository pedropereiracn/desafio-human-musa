import { NextRequest, NextResponse } from "next/server";
import { askClaude, parseClaudeJSON } from "@/lib/claude";

const SYSTEM_PROMPT = `Você é um especialista em conteúdo para redes sociais, focado em carrosséis virais.

Regras para criação de slides:
1. Slide 1: HOOK forte — frase curta e impactante que gera curiosidade ou identidade
2. 1 ideia principal por slide — nunca sobrecarregue
3. Texto curto e direto — máximo 3 linhas por campo
4. Últimos slides: resumo + CTA claro (salvar, compartilhar, seguir)
5. Use linguagem conversacional e envolvente
6. Headlines devem funcionar sozinhas (sem contexto)

Responda em JSON com este formato exato:
{
  "slides": [
    {
      "headline": "texto principal do slide (curto, impactante)",
      "body": "texto complementar opcional (1-2 frases curtas)",
      "footnote": "nota de rodapé opcional (@handle, número do slide, etc)"
    }
  ],
  "caption": "caption completa para o post (com quebras \\n)",
  "hashtags": ["hashtag1", "hashtag2"]
}

Gere entre 7 e 10 slides. Responda APENAS com o JSON, sem markdown.`;

interface CarouselRequest {
  topic: string;
  platform: string;
  tone?: string;
  numSlides?: number;
  context?: {
    caption?: string;
    hashtags?: string[];
    cta?: string;
    notes?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, numSlides, context } = (await request.json()) as CarouselRequest;

    let userMessage = `Plataforma: ${platform} | Tom: ${tone || "casual"} | Tema: "${topic}"`;

    if (numSlides) {
      userMessage += `\nNúmero de slides: ${numSlides}`;
    }

    if (context) {
      userMessage += `\n\nContexto existente (use como base):`;
      if (context.caption) userMessage += `\nCaption: ${context.caption}`;
      if (context.cta) userMessage += `\nCTA: ${context.cta}`;
      if (context.notes) userMessage += `\nNotas: ${context.notes}`;
    }

    userMessage += `\n\nCrie o conteúdo slide-by-slide para o carrossel.`;

    const result = await askClaude(SYSTEM_PROMPT, userMessage, { tier: "fast" });
    const parsed = parseClaudeJSON<{
      slides: { headline: string; body?: string; footnote?: string }[];
      caption: string;
      hashtags: string[];
    }>(result);

    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Carousel error:", message, error);
    return NextResponse.json({ error: "Erro ao gerar carrossel", details: message }, { status: 500 });
  }
}
