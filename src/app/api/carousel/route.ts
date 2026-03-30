import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/claude";
import type { BrandKit } from "@/lib/types";

const SYSTEM_PROMPT = `Você é um designer de marca de classe mundial + especialista em carrosséis para redes sociais.
Você cria CONTEÚDO + BRAND KIT + HTML VISUAL RICO para cada slide.

## Regras de Conteúdo
1. Slide 1 = COVER — frase curta, impactante, curiosidade
2. Último slide = CTA — call-to-action claro (seguir, salvar, compartilhar)
3. 1 ideia por slide — nunca sobrecarregue
4. Texto curto — máximo 3 linhas por campo
5. Use "statistic" para números impactantes, "quote" para frases marcantes, "list" para enumerações
6. Headlines funcionam sozinhas

## Google Fonts — OBRIGATÓRIO
Sempre inclua "fonts" no brandKit. Escolha fontes que reflitam a personalidade.
- Bold/Gaming: Bebas Neue, Oswald, Archivo Black, Anton
- Clean/Tech: Inter, DM Sans, Space Grotesk, Outfit
- Luxo/Elegante: Playfair Display, DM Serif Display, Cormorant Garamond
- Sport/Energia: Anton, Bebas Neue, Barlow Condensed
- Criativo: Space Grotesk, Poppins, Sora
URL: https://fonts.googleapis.com/css2?family=NOME+DA+FONTE:wght@400;700;900&display=swap

## Backgrounds — NUNCA sólidos, SEMPRE gradientes CSS

## Brand Kit Rules
- Reflita identidade visual REAL de marcas mencionadas
- EXCELENTE contraste texto/fundo
- decorativeElements: 2 de ["geometric-shapes","accent-bars","gradient-overlays","dot-grid","noise-texture","corner-brackets","diagonal-lines"]

## FORMATO DE RESPOSTA — OBRIGATÓRIO

Responda em DUAS PARTES separadas:

### PARTE 1: JSON entre tags <json></json>

<json>
{
  "brandKit": {
    "brandName": "nome",
    "palette": { "primary":"#hex","secondary":"#hex","background":"#hex","backgroundAlt":"#hex","text":"#hex","accent":"#hex" },
    "typography": { "headlineStyle":"uppercase-bold", "bodyStyle":"clean" },
    "visualStyle": "bold",
    "decorativeElements": ["accent-bars","geometric-shapes"],
    "fonts": { "url":"https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400;700&family=Inter:wght@400;700&display=swap", "headline":"Bebas Neue", "body":"Inter" },
    "backgrounds": { "cover":"linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)","content":"linear-gradient(180deg, #0c0c10 0%, #151520 100%)","contentAlt":"linear-gradient(180deg, #10101a 0%, #0c0c10 100%)","statistic":"linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%)","quote":"linear-gradient(180deg, #0e0e18 0%, #0c0c10 100%)","quoteAlt":"linear-gradient(180deg, #0c0c10 0%, #0e0e18 100%)","cta":"linear-gradient(135deg, #1a0a0a 0%, #0a0a1a 100%)" }
  },
  "slides": [
    { "slideType":"cover", "headline":"texto impactante", "body":"subtítulo" },
    { "slideType":"content", "headline":"título", "body":"texto complementar" },
    { "slideType":"statistic", "headline":"contexto", "statValue":"87%", "statLabel":"descrição" },
    { "slideType":"list", "headline":"título", "listItems":["item 1","item 2","item 3"] },
    { "slideType":"quote", "headline":"frase marcante", "quoteAttribution":"Autor" },
    { "slideType":"cta", "headline":"CTA forte", "body":"texto suporte", "footnote":"Seguir →" }
  ],
  "caption": "caption completa com quebras de linha",
  "hashtags": ["tag1","tag2","tag3"]
}
</json>

### PARTE 2: HTML rico para cada slide entre tags <slide_html index="N"></slide_html>

Gere HTML+CSS completo, auto-contido e visualmente RICO para cada slide.
O HTML NÃO vai dentro do JSON — vai em tags separadas.

Regras do HTML:
- Root div com width e height EXATOS em px (conforme dimensões informadas)
- <style>@import url('GOOGLE_FONTS_URL');</style> no início de cada slide
- TODOS estilos inline (sem classes externas)
- Use ASPAS SIMPLES para todos atributos HTML (style='...' não style="...")
- Flexbox para layout
- SEM JavaScript, SEM <script>, SEM event handlers
- SEM imagens externas — só CSS gradients, shapes, SVG inline
- Fundo SEMPRE gradiente (linear-gradient, radial-gradient)
- text-shadow em headlines (ex: 0 4px 30px rgba(0,0,0,0.4))
- Glow effects em elementos de destaque (box-shadow)
- Elementos decorativos CSS (shapes com border-radius, accent bars, separadores)
- Handle/watermark bottom-left se marca fornecida (opacity:0.5)
- Slide number bottom-right (opacity:0.4, formato "01", "02")
- O HTML deve parecer uma LANDING PAGE PROFISSIONAL, não um slide genérico

Exemplo:
<slide_html index='0'>
<style>@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400;700&display=swap');</style>
<div style='width:1080px;height:1080px;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);display:flex;flex-direction:column;justify-content:center;align-items:center;padding:80px;text-align:center;position:relative;overflow:hidden;'>
  <div style='position:absolute;top:-50px;right:-50px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(229,9,20,0.15) 0%,transparent 70%);'></div>
  <h1 style='font-family:Bebas Neue,sans-serif;font-size:72px;font-weight:700;color:#ffffff;text-shadow:0 4px 30px rgba(0,0,0,0.5);letter-spacing:0.05em;text-transform:uppercase;margin:0;line-height:1.1;'>HEADLINE AQUI</h1>
  <p style='font-family:Inter,sans-serif;font-size:24px;color:rgba(255,255,255,0.8);margin-top:20px;'>Subtítulo aqui</p>
  <span style='position:absolute;bottom:32px;right:40px;font-size:16px;opacity:0.4;color:#ffffff;font-family:Inter,sans-serif;'>01</span>
</div>
</slide_html>

Gere 7-10 slides. Primeiro=cover, último=cta. Varie tipos.`;

interface CarouselRequest {
  topic: string;
  platform: string;
  tone?: string;
  numSlides?: number;
  brandName?: string;
  style?: string;
  brandDescription?: string;
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

function parseCarouselResponse(raw: string): CarouselResponse {
  // STEP 1: Extract JSON from <json> tags
  const jsonMatch = raw.match(/<json>([\s\S]*?)<\/json>/);
  let jsonStr: string;

  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  } else {
    // Fallback: try to parse the whole response as JSON
    jsonStr = raw.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    // Try to find a JSON object
    const braceMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      jsonStr = braceMatch[0];
    }
  }

  const data = JSON.parse(jsonStr) as CarouselResponse;

  // STEP 2: Extract HTML from <slide_html> tags (independent of JSON)
  const slideHtmlRegex = /<slide_html\s+index=['"]\s*(\d+)\s*['"]>([\s\S]*?)<\/slide_html>/g;
  let match;
  while ((match = slideHtmlRegex.exec(raw)) !== null) {
    const index = parseInt(match[1]);
    const html = match[2].trim();
    if (data.slides[index] && html.length > 10) {
      data.slides[index].htmlContent = html;
    }
  }

  return data;
}

function getSlideDimensions(platform: string): { width: number; height: number } {
  switch (platform) {
    case "tiktok":
      return { width: 1080, height: 1920 };
    case "instagram":
    default:
      return { width: 1080, height: 1350 };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, numSlides, brandName, style, brandDescription, context } =
      (await request.json()) as CarouselRequest;

    const { width, height } = getSlideDimensions(platform);

    let userMessage = `Plataforma: ${platform} | Tom: ${tone || "casual"} | Tema: "${topic}"`;
    userMessage += `\nDimensões de cada slide: ${width}x${height}px`;

    if (brandName) {
      userMessage += `\nMarca: ${brandName} (adapte o brand kit à identidade visual desta marca)`;
    }

    if (style) {
      userMessage += `\nEstilo visual desejado: ${style}`;
    }

    if (brandDescription) {
      userMessage += `\nDescrição da marca / brand kit do cliente:\n${brandDescription}`;
    }

    if (numSlides) {
      userMessage += `\nNúmero de slides: ${numSlides}`;
    }

    if (context) {
      userMessage += `\n\nContexto existente:`;
      if (context.caption) userMessage += `\nCaption: ${context.caption}`;
      if (context.cta) userMessage += `\nCTA: ${context.cta}`;
      if (context.notes) userMessage += `\nNotas: ${context.notes}`;
    }

    userMessage += `\n\nCrie o brand kit + conteúdo slide-by-slide + HTML visual rico para o carrossel.`;

    const result = await askClaude(SYSTEM_PROMPT, userMessage, {
      tier: "creative",
      maxTokens: 16000,
    });

    const parsed = parseCarouselResponse(result);

    if (!parsed.slides || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
      throw new Error("Claude response missing slides array");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Carousel error:", message);
    return NextResponse.json(
      { error: "Erro ao gerar carrossel", details: message },
      { status: 500 }
    );
  }
}
