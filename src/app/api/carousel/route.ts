import { NextRequest, NextResponse } from "next/server";
import { askClaude, parseClaudeJSON } from "@/lib/claude";
import type { BrandKit } from "@/lib/types";

const SYSTEM_PROMPT = `Você é um designer de marca de classe mundial + especialista em carrosséis para redes sociais. Você cria CONTEÚDO + BRAND KIT com identidade visual profissional de landing page.

## Regras de Conteúdo
1. Slide 1 = COVER obrigatório — frase curta, impactante, que gera curiosidade
2. Último slide = CTA obrigatório — call-to-action claro (seguir, salvar, compartilhar)
3. 1 ideia por slide — nunca sobrecarregue
4. Texto curto e direto — máximo 3 linhas por campo
5. Use "statistic" quando houver número impactante (porcentagens, valores, métricas)
6. Use "quote" para frases marcantes ou citações
7. Use "list" para itens enumerados (3-5 items max)
8. Headlines devem funcionar sozinhas (sem contexto)

## Google Fonts — OBRIGATÓRIO
Sempre inclua "fonts" no brandKit. Escolha fontes que reflitam a personalidade da marca/tópico.

Fontes aprovadas por personalidade:
- Bold/Gaming/Impactante: Bebas Neue, Oswald, Archivo Black, Anton
- Clean/Tech/Moderno: Inter, DM Sans, Space Grotesk, Outfit
- Luxo/Elegante: Playfair Display, DM Serif Display, Cormorant Garamond
- Sport/Energia: Anton, Bebas Neue, Barlow Condensed
- Criativo/Startup: Space Grotesk, Poppins, Sora

Formato da URL (EXATO): https://fonts.googleapis.com/css2?family=NOME+DA+FONTE:wght@400;700;900&display=swap
Para múltiplas fontes: &family=SEGUNDA+FONTE:wght@400;700

Exemplos de personalidade por marca:
- Rockstar Games: headline=Bebas Neue, body=Inter → gaming bold uppercase
- Apple: headline=Inter, body=Inter → minimal clean
- Nike: headline=Anton, body=DM Sans → sport energy uppercase
- Louis Vuitton: headline=Playfair Display, body=Cormorant Garamond → luxo elegante
- Spotify: headline=DM Sans, body=Inter → tech moderno

## Backgrounds — OBRIGATÓRIO
NUNCA use cores sólidas para backgrounds. SEMPRE use gradientes CSS com 2+ color stops.

Regras:
- cover/cta: gradientes dramáticos usando a cor primária da marca
- content/contentAlt: gradientes sutis entre tons próximos (leve variação)
- statistic: gradiente com secondary como base, mais profundidade
- quote/quoteAlt: gradientes sutis, elegantes

Exemplos de CSS válido:
- "linear-gradient(135deg, #000000 0%, #1a1a2e 100%)"
- "linear-gradient(180deg, #0c0c10 0%, #1a0a0a 50%, #0c0c10 100%)"
- "radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f1a 100%)"

## Brand Kit Rules
- Se uma marca for mencionada, reflita a identidade visual REAL (cores, estilo, atmosfera)
- Garanta EXCELENTE contraste entre texto e fundo em todas as slides
- decorativeElements: escolha 2 de ["geometric-shapes", "accent-bars", "gradient-overlays", "dot-grid", "noise-texture", "corner-brackets", "diagonal-lines"]
- headlineStyle: ["uppercase-bold", "elegant", "playful", "minimal", "tech", "editorial"]
- bodyStyle: ["clean", "serif", "mono"]
- visualStyle: ["corporate", "bold", "elegant", "creative", "tech", "editorial"]

## JSON Schema
{
  "brandKit": {
    "brandName": "nome da marca ou tópico",
    "palette": {
      "primary": "#hex",
      "secondary": "#hex",
      "background": "#hex",
      "backgroundAlt": "#hex",
      "text": "#hex",
      "accent": "#hex"
    },
    "typography": { "headlineStyle": "minimal", "bodyStyle": "clean" },
    "visualStyle": "corporate",
    "decorativeElements": ["accent-bars", "geometric-shapes"],
    "fonts": {
      "url": "https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap",
      "headline": "Inter",
      "body": "Inter"
    },
    "backgrounds": {
      "cover": "linear-gradient(135deg, #hex1 0%, #hex2 100%)",
      "content": "linear-gradient(180deg, #hex1 0%, #hex2 100%)",
      "contentAlt": "linear-gradient(180deg, #hex1 0%, #hex2 100%)",
      "statistic": "linear-gradient(135deg, #hex1 0%, #hex2 100%)",
      "quote": "linear-gradient(180deg, #hex1 0%, #hex2 100%)",
      "quoteAlt": "linear-gradient(180deg, #hex1 0%, #hex2 100%)",
      "cta": "linear-gradient(135deg, #hex1 0%, #hex2 100%)"
    }
  },
  "slides": [
    { "slideType": "cover", "headline": "texto impactante", "body": "subtítulo opcional" },
    { "slideType": "content", "headline": "título", "body": "texto complementar" },
    { "slideType": "statistic", "headline": "contexto", "statValue": "87%", "statLabel": "descrição" },
    { "slideType": "list", "headline": "título", "listItems": ["item 1", "item 2", "item 3"] },
    { "slideType": "quote", "headline": "frase marcante", "quoteAttribution": "Autor" },
    { "slideType": "content", "headline": "título", "body": "texto" },
    { "slideType": "cta", "headline": "CTA forte", "body": "texto suporte", "footnote": "Seguir →" }
  ],
  "caption": "caption completa (com \\n)",
  "hashtags": ["hashtag1", "hashtag2"]
}

Gere entre 7 e 10 slides. Primeiro = "cover", último = "cta".
Varie os tipos. Responda APENAS com JSON, sem markdown.`;

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
