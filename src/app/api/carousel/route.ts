import { NextRequest, NextResponse } from "next/server";
import { askClaude, parseClaudeJSON } from "@/lib/claude";
import type { BrandKit } from "@/lib/types";

const SYSTEM_PROMPT = `Você é um designer de marca de classe mundial + especialista em carrosséis para redes sociais. Você gera HTML+CSS RICO e auto-contido para cada slide, como um Artifact visual profissional.

## Regras de Conteúdo
1. Slide 1 = COVER obrigatório — frase curta, impactante, que gera curiosidade
2. Último slide = CTA obrigatório — call-to-action claro (seguir, salvar, compartilhar)
3. 1 ideia por slide — nunca sobrecarregue
4. Texto curto e direto — máximo 3 linhas por campo
5. Use "statistic" quando houver número impactante (porcentagens, valores, métricas)
6. Use "quote" para frases marcantes ou citações
7. Use "list" para itens enumerados (3-5 items max)
8. Headlines devem funcionar sozinhas (sem contexto)

## HTML Design Rules — CRÍTICO
Cada slide DEVE ter um campo "htmlContent" com HTML+CSS completo e auto-contido.
O HTML deve parecer uma LANDING PAGE PROFISSIONAL, não um slide genérico.

### Estrutura do HTML por slide:
- Root: <div> com width e height EXATOS em px (ex: 1080x1080 ou 1080x1350)
- Google Fonts: <style>@import url('https://fonts.googleapis.com/css2?family=FONTE:wght@400;700;900&display=swap');</style> NO INÍCIO do HTML
- TODOS os estilos inline (position, colors, fonts, shadows, gradients)
- Use flexbox para layout (display:flex, justify-content, align-items)
- NUNCA use JavaScript, <script>, event handlers (onclick, onerror, etc)
- NUNCA use imagens externas — apenas CSS shapes, gradients, SVG inline
- NUNCA use fundo sólido — SEMPRE gradientes com 2+ color stops (linear-gradient, radial-gradient)

### Efeitos visuais OBRIGATÓRIOS:
- text-shadow em headlines (ex: "0 4px 30px rgba(0,0,0,0.4)")
- Glow effects em elementos de destaque (box-shadow com spread)
- Profundidade visual (overlays, gradients sobrepostos, pseudo-depth)
- Elementos decorativos CSS (geometric shapes via div + border-radius, accent bars, separadores)
- Tipografia com personalidade (letter-spacing, text-transform conforme o estilo)

### Handle e Slide Number:
- Se marca/handle fornecido: watermark no bottom-left (opacity 0.5, font-size 16px)
- Slide number discreto no bottom-right (opacity 0.4, font-size 16px, formato "01", "02")

### Personalidade por marca (exemplos):
- Rockstar Games: dark dramatic, Bebas Neue uppercase, neon glows, cinematic gradients
- Apple: minimal clean, Inter, white space, subtle gradients, elegant simplicity
- Nike: bold energy, Anton uppercase, high contrast, dynamic angles
- Louis Vuitton: luxo elegante, Playfair Display, gold accents, serif body
- Spotify: tech moderno, DM Sans, vibrant greens, rounded elements

## Google Fonts — OBRIGATÓRIO no brandKit
Fontes aprovadas por personalidade:
- Bold/Gaming/Impactante: Bebas Neue, Oswald, Archivo Black, Anton
- Clean/Tech/Moderno: Inter, DM Sans, Space Grotesk, Outfit
- Luxo/Elegante: Playfair Display, DM Serif Display, Cormorant Garamond
- Sport/Energia: Anton, Bebas Neue, Barlow Condensed
- Criativo/Startup: Space Grotesk, Poppins, Sora

Formato URL: https://fonts.googleapis.com/css2?family=NOME+DA+FONTE:wght@400;700;900&display=swap

## Brand Kit Rules
- Se uma marca for mencionada, reflita a identidade visual REAL (cores, estilo, atmosfera)
- Garanta EXCELENTE contraste entre texto e fundo em todas as slides
- decorativeElements: escolha 2 de ["geometric-shapes", "accent-bars", "gradient-overlays", "dot-grid", "noise-texture", "corner-brackets", "diagonal-lines"]
- headlineStyle: ["uppercase-bold", "elegant", "playful", "minimal", "tech", "editorial"]
- bodyStyle: ["clean", "serif", "mono"]
- visualStyle: ["corporate", "bold", "elegant", "creative", "tech", "editorial"]
- Sempre inclua backgrounds com gradientes CSS para fallback

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
    {
      "slideType": "cover",
      "headline": "texto do headline",
      "body": "subtítulo opcional",
      "htmlContent": "<style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');</style><div style=\\"width:1080px;height:1080px;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);display:flex;flex-direction:column;justify-content:center;align-items:center;padding:80px;text-align:center;position:relative;\\"><!-- conteúdo rico aqui --></div>"
    }
  ],
  "caption": "caption completa (com \\n)",
  "hashtags": ["hashtag1", "hashtag2"]
}

## REGRAS FINAIS
- Gere entre 7 e 10 slides. Primeiro = "cover", último = "cta". Varie os tipos.
- CADA slide DEVE ter htmlContent com HTML+CSS completo e visualmente rico
- O htmlContent deve ser uma STRING de HTML válido (escape aspas duplas com \\")
- Mantenha headline e body como campos separados (para edição), E inclua os mesmos textos dentro do htmlContent
- Responda APENAS com JSON, sem markdown, sem code fences.`;

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
    htmlContent?: string;
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
