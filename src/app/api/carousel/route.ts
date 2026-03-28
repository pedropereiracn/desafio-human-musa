import { NextRequest, NextResponse } from "next/server";
import { askClaude, parseClaudeJSON } from "@/lib/claude";
import type { BrandKit } from "@/lib/types";

const SYSTEM_PROMPT = `Você é um especialista em design de carrosséis profissionais para redes sociais, com expertise em identidade visual de marcas.

Você gera CONTEÚDO + BRAND KIT em uma única resposta.

## Regras de Conteúdo
1. Slide 1 = COVER obrigatório — frase curta, impactante, que gera curiosidade
2. Último slide = CTA obrigatório — call-to-action claro (seguir, salvar, compartilhar)
3. 1 ideia por slide — nunca sobrecarregue
4. Texto curto e direto — máximo 3 linhas por campo
5. Use "statistic" quando houver número impactante (porcentagens, valores, métricas)
6. Use "quote" para frases marcantes ou citações
7. Use "list" para itens enumerados (3-5 items max)
8. Headlines devem funcionar sozinhas (sem contexto)

## Regras de Brand Kit
- Se uma marca for mencionada, o brandKit deve refletir a identidade visual real da marca (cores, estilo tipográfico, estética geral)
- Garanta bom contraste entre texto e fundo
- decorativeElements: escolha 2 do set ["geometric-shapes", "accent-bars", "gradient-overlays", "dot-grid", "noise-texture", "corner-brackets", "diagonal-lines"]
- headlineStyle: um de ["uppercase-bold", "elegant", "playful", "minimal", "tech", "editorial"]
- bodyStyle: um de ["clean", "serif", "mono"]
- visualStyle: um de ["corporate", "bold", "elegant", "creative", "tech", "editorial"]

Responda em JSON com este formato exato:
{
  "brandKit": {
    "brandName": "nome da marca ou tópico",
    "palette": {
      "primary": "#hex (cor principal, usada no cover/cta)",
      "secondary": "#hex (cor secundária, usada em stat slides)",
      "background": "#hex (fundo padrão dos slides de conteúdo)",
      "backgroundAlt": "#hex (fundo alternativo, leve variação do background)",
      "text": "#hex (cor do texto em slides de conteúdo)",
      "accent": "#hex (cor de destaque, usada em detalhes e decorações)"
    },
    "typography": {
      "headlineStyle": "minimal",
      "bodyStyle": "clean"
    },
    "visualStyle": "corporate",
    "decorativeElements": ["accent-bars", "geometric-shapes"]
  },
  "slides": [
    { "slideType": "cover", "headline": "texto impactante", "body": "subtítulo opcional" },
    { "slideType": "content", "headline": "título", "body": "texto complementar" },
    { "slideType": "statistic", "headline": "contexto", "statValue": "87%", "statLabel": "descrição da estatística" },
    { "slideType": "list", "headline": "título da lista", "listItems": ["item 1", "item 2", "item 3"] },
    { "slideType": "quote", "headline": "frase marcante aqui", "quoteAttribution": "Autor" },
    { "slideType": "content", "headline": "título", "body": "texto" },
    { "slideType": "cta", "headline": "CTA forte", "body": "texto suporte", "footnote": "Seguir →" }
  ],
  "caption": "caption completa para o post (com quebras \\n)",
  "hashtags": ["hashtag1", "hashtag2"]
}

Gere entre 7 e 10 slides. O primeiro DEVE ser "cover" e o último DEVE ser "cta".
Varie os tipos de slide para manter o carrossel visualmente interessante.
Responda APENAS com o JSON, sem markdown.`;

interface CarouselRequest {
  topic: string;
  platform: string;
  tone?: string;
  numSlides?: number;
  brandName?: string;
  context?: {
    caption?: string;
    hashtags?: string[];
    cta?: string;
    notes?: string;
  };
}

interface CarouselResponse {
  brandKit: BrandKit;
  slides: {
    slideType: string;
    headline: string;
    body?: string;
    footnote?: string;
    listItems?: string[];
    statValue?: string;
    statLabel?: string;
    quoteAttribution?: string;
  }[];
  caption: string;
  hashtags: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, numSlides, brandName, context } = (await request.json()) as CarouselRequest;

    let userMessage = `Plataforma: ${platform} | Tom: ${tone || "casual"} | Tema: "${topic}"`;

    if (brandName) {
      userMessage += `\nMarca: ${brandName} (adapte o brand kit à identidade visual desta marca)`;
    }

    if (numSlides) {
      userMessage += `\nNúmero de slides: ${numSlides}`;
    }

    if (context) {
      userMessage += `\n\nContexto existente (use como base):`;
      if (context.caption) userMessage += `\nCaption: ${context.caption}`;
      if (context.cta) userMessage += `\nCTA: ${context.cta}`;
      if (context.notes) userMessage += `\nNotas: ${context.notes}`;
    }

    userMessage += `\n\nCrie o brand kit + conteúdo slide-by-slide para o carrossel.`;

    const result = await askClaude(SYSTEM_PROMPT, userMessage, { tier: "fast" });
    const parsed = parseClaudeJSON<CarouselResponse>(result);

    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Carousel error:", message, error);
    return NextResponse.json({ error: "Erro ao gerar carrossel", details: message }, { status: 500 });
  }
}
