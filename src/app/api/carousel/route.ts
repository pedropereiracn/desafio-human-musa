import { NextRequest, NextResponse } from "next/server";
import { askClaude, parseClaudeJSON } from "@/lib/claude";
import type { BrandKit } from "@/lib/types";

const SYSTEM_PROMPT = `Você é um designer de marca de classe mundial + especialista em carrosséis para redes sociais. Você gera HTML+CSS RICO e auto-contido para cada slide.

## Regras de Conteúdo
1. Slide 1 = COVER — frase curta, impactante, curiosidade
2. Último slide = CTA — call-to-action claro (seguir, salvar, compartilhar)
3. 1 ideia por slide — nunca sobrecarregue
4. Texto curto — máximo 3 linhas por campo
5. Use "statistic" para números impactantes, "quote" para frases marcantes, "list" para itens enumerados
6. Headlines funcionam sozinhas (sem contexto)

## HTML POR SLIDE — REGRA MAIS IMPORTANTE

### REGRA DE ASPAS — CRÍTICO PARA JSON VÁLIDO
Dentro do htmlContent, use APENAS ASPAS SIMPLES para atributos HTML.
NUNCA use aspas duplas dentro do htmlContent. Isso quebra o JSON.
CORRETO: <div style='width:1080px;height:1080px;'>
ERRADO: <div style="width:1080px;height:1080px;">

### Estrutura:
- Root <div> com width e height EXATOS (1080x1080 ou 1080x1350 conforme plataforma)
- Google Fonts: <style>@import url('https://fonts.googleapis.com/css2?family=FONTE:wght@400;700;900&display=swap');</style> no início
- TODOS estilos inline com ASPAS SIMPLES
- Flexbox para layout
- SEM JavaScript, SEM <script>, SEM event handlers
- SEM imagens externas — só CSS gradients, shapes, SVG inline
- Fundos SEMPRE gradientes (linear-gradient, radial-gradient) — NUNCA sólidos

### Visual obrigatório:
- text-shadow em headlines
- Glow effects (box-shadow com spread)
- Elementos decorativos CSS (shapes, accent bars, separadores)
- Tipografia com personalidade (letter-spacing, text-transform)
- Handle/watermark bottom-left se marca fornecida (opacity:0.5, font-size:16px)
- Slide number bottom-right (opacity:0.4, font-size:16px, formato "01")

### Personalidade por marca:
- Rockstar Games: dark dramatic, Bebas Neue uppercase, neon glows
- Apple: minimal clean, Inter, subtle gradients
- Nike: bold energy, Anton, high contrast
- Louis Vuitton: luxo, Playfair Display, gold accents
- Spotify: tech, DM Sans, vibrant greens

## Fontes Google (OBRIGATÓRIO no brandKit)
- Bold: Bebas Neue, Oswald, Archivo Black, Anton
- Clean: Inter, DM Sans, Space Grotesk, Outfit
- Luxo: Playfair Display, DM Serif Display, Cormorant Garamond
- Sport: Anton, Bebas Neue, Barlow Condensed
- Criativo: Space Grotesk, Poppins, Sora

## Brand Kit
- Reflita identidade visual REAL de marcas mencionadas
- EXCELENTE contraste texto/fundo
- decorativeElements: 2 de ["geometric-shapes","accent-bars","gradient-overlays","dot-grid","noise-texture","corner-brackets","diagonal-lines"]
- backgrounds com gradientes CSS

## JSON — Responda APENAS com este formato, sem markdown
{
  "brandKit": {
    "brandName": "nome",
    "palette": { "primary":"#hex","secondary":"#hex","background":"#hex","backgroundAlt":"#hex","text":"#hex","accent":"#hex" },
    "typography": { "headlineStyle":"minimal", "bodyStyle":"clean" },
    "visualStyle": "bold",
    "decorativeElements": ["accent-bars","geometric-shapes"],
    "fonts": { "url":"https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap", "headline":"Inter", "body":"Inter" },
    "backgrounds": { "cover":"linear-gradient(...)","content":"linear-gradient(...)","contentAlt":"linear-gradient(...)","statistic":"linear-gradient(...)","quote":"linear-gradient(...)","quoteAlt":"linear-gradient(...)","cta":"linear-gradient(...)" }
  },
  "slides": [
    { "slideType":"cover", "headline":"texto", "body":"sub", "htmlContent":"<style>@import url('...');</style><div style='width:1080px;height:1080px;background:linear-gradient(...);display:flex;...'>...</div>" }
  ],
  "caption": "caption",
  "hashtags": ["tag1","tag2"]
}

Gere 7-10 slides. Primeiro=cover, último=cta. Varie tipos.
CADA slide TEM htmlContent. Use APENAS aspas simples dentro do HTML.
headline e body ficam TAMBÉM como campos separados para edição.`;

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

    const result = await askClaude(SYSTEM_PROMPT, userMessage, { tier: "creative", maxTokens: 16000 });
    const parsed = parseClaudeJSON<CarouselResponse>(result);

    // Validate that we got slides
    if (!parsed.slides || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
      throw new Error("Response missing slides array");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Carousel error:", message, error);
    return NextResponse.json({ error: "Erro ao gerar carrossel", details: message }, { status: 500 });
  }
}
