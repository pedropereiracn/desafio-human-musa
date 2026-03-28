import type { CarouselTemplate } from "./types";

export const CAROUSEL_TEMPLATES: CarouselTemplate[] = [
  {
    id: "corporate",
    name: "Corporate",
    defaults: {
      backgroundType: "solid",
      colors: {
        background: "#1e293b",
        text: "#f1f5f9",
        accent: "#3b82f6",
      },
      layout: "centered",
    },
    slideSize: { width: 1080, height: 1080 },
    brandKit: {
      brandName: "",
      palette: {
        primary: "#1e293b",
        secondary: "#334155",
        background: "#1e293b",
        backgroundAlt: "#273548",
        text: "#f1f5f9",
        accent: "#3b82f6",
      },
      typography: { headlineStyle: "minimal", bodyStyle: "clean" },
      visualStyle: "corporate",
      decorativeElements: ["geometric-shapes", "accent-bars"],
      fonts: {
        url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&family=Inter:wght@400;700&display=swap",
        headline: "Space Grotesk",
        body: "Inter",
      },
      backgrounds: {
        cover: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        content: "linear-gradient(180deg, #1e293b 0%, #1a2536 100%)",
        contentAlt: "linear-gradient(180deg, #273548 0%, #1e293b 100%)",
        statistic: "linear-gradient(135deg, #334155 0%, #1e293b 100%)",
        quote: "linear-gradient(180deg, #1e293b 0%, #1a2536 100%)",
        quoteAlt: "linear-gradient(180deg, #273548 0%, #1e293b 100%)",
        cta: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      },
    },
  },
  {
    id: "bold",
    name: "Bold",
    defaults: {
      backgroundType: "solid",
      colors: {
        background: "#0c0c10",
        text: "#ffffff",
        accent: "#ef4444",
      },
      layout: "centered",
    },
    slideSize: { width: 1080, height: 1080 },
    brandKit: {
      brandName: "",
      palette: {
        primary: "#0c0c10",
        secondary: "#1a1a24",
        background: "#0c0c10",
        backgroundAlt: "#14141c",
        text: "#ffffff",
        accent: "#ef4444",
      },
      typography: { headlineStyle: "uppercase-bold", bodyStyle: "clean" },
      visualStyle: "bold",
      decorativeElements: ["gradient-overlays", "corner-brackets"],
      fonts: {
        url: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700&display=swap",
        headline: "Bebas Neue",
        body: "Inter",
      },
      backgrounds: {
        cover: "linear-gradient(135deg, #0c0c10 0%, #1a0a0a 50%, #0c0c10 100%)",
        content: "linear-gradient(180deg, #0c0c10 0%, #12121a 100%)",
        contentAlt: "linear-gradient(180deg, #14141c 0%, #0c0c10 100%)",
        statistic: "linear-gradient(135deg, #1a1a24 0%, #0c0c10 100%)",
        quote: "linear-gradient(180deg, #0c0c10 0%, #12121a 100%)",
        quoteAlt: "linear-gradient(180deg, #14141c 0%, #0c0c10 100%)",
        cta: "linear-gradient(135deg, #0c0c10 0%, #1a0a0a 50%, #0c0c10 100%)",
      },
    },
  },
  {
    id: "elegant",
    name: "Elegant",
    defaults: {
      backgroundType: "solid",
      colors: {
        background: "#faf9f6",
        text: "#1a1a1a",
        accent: "#92764a",
      },
      layout: "left",
    },
    slideSize: { width: 1080, height: 1080 },
    brandKit: {
      brandName: "",
      palette: {
        primary: "#92764a",
        secondary: "#b8a07a",
        background: "#faf9f6",
        backgroundAlt: "#f0ede6",
        text: "#1a1a1a",
        accent: "#92764a",
      },
      typography: { headlineStyle: "elegant", bodyStyle: "serif" },
      visualStyle: "elegant",
      decorativeElements: ["accent-bars", "noise-texture"],
      fonts: {
        url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lora:wght@400;700&display=swap",
        headline: "Playfair Display",
        body: "Lora",
      },
      backgrounds: {
        cover: "linear-gradient(135deg, #92764a 0%, #7a6340 100%)",
        content: "linear-gradient(180deg, #faf9f6 0%, #f5f2ec 100%)",
        contentAlt: "linear-gradient(180deg, #f0ede6 0%, #faf9f6 100%)",
        statistic: "linear-gradient(135deg, #b8a07a 0%, #92764a 100%)",
        quote: "linear-gradient(180deg, #faf9f6 0%, #f5f2ec 100%)",
        quoteAlt: "linear-gradient(180deg, #f0ede6 0%, #faf9f6 100%)",
        cta: "linear-gradient(135deg, #92764a 0%, #7a6340 100%)",
      },
    },
  },
  {
    id: "creative",
    name: "Creative",
    defaults: {
      backgroundType: "solid",
      colors: {
        background: "#1a1a2e",
        text: "#ffffff",
        accent: "#e94560",
      },
      layout: "centered",
    },
    slideSize: { width: 1080, height: 1080 },
    brandKit: {
      brandName: "",
      palette: {
        primary: "#1a1a2e",
        secondary: "#16213e",
        background: "#1a1a2e",
        backgroundAlt: "#222240",
        text: "#ffffff",
        accent: "#e94560",
      },
      typography: { headlineStyle: "playful", bodyStyle: "clean" },
      visualStyle: "creative",
      decorativeElements: ["geometric-shapes", "gradient-overlays"],
      fonts: {
        url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&family=DM+Sans:wght@400;700&display=swap",
        headline: "Space Grotesk",
        body: "DM Sans",
      },
      backgrounds: {
        cover: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        content: "linear-gradient(180deg, #1a1a2e 0%, #1e1e36 100%)",
        contentAlt: "linear-gradient(180deg, #222240 0%, #1a1a2e 100%)",
        statistic: "linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)",
        quote: "linear-gradient(180deg, #1a1a2e 0%, #1e1e36 100%)",
        quoteAlt: "linear-gradient(180deg, #222240 0%, #1a1a2e 100%)",
        cta: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      },
    },
  },
  {
    id: "tech",
    name: "Tech",
    defaults: {
      backgroundType: "solid",
      colors: {
        background: "#0a0a0f",
        text: "#e0e0e0",
        accent: "#00ff88",
      },
      layout: "centered",
    },
    slideSize: { width: 1080, height: 1080 },
    brandKit: {
      brandName: "",
      palette: {
        primary: "#0a0a0f",
        secondary: "#12121a",
        background: "#0a0a0f",
        backgroundAlt: "#101018",
        text: "#e0e0e0",
        accent: "#00ff88",
      },
      typography: { headlineStyle: "tech", bodyStyle: "mono" },
      visualStyle: "tech",
      decorativeElements: ["dot-grid", "diagonal-lines"],
      fonts: {
        url: "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@400;700&display=swap",
        headline: "Space Mono",
        body: "Inter",
      },
      backgrounds: {
        cover: "linear-gradient(135deg, #0a0a0f 0%, #0d1a0d 50%, #0a0a0f 100%)",
        content: "linear-gradient(180deg, #0a0a0f 0%, #0e0e16 100%)",
        contentAlt: "linear-gradient(180deg, #101018 0%, #0a0a0f 100%)",
        statistic: "linear-gradient(135deg, #12121a 0%, #0a0a0f 100%)",
        quote: "linear-gradient(180deg, #0a0a0f 0%, #0e0e16 100%)",
        quoteAlt: "linear-gradient(180deg, #101018 0%, #0a0a0f 100%)",
        cta: "linear-gradient(135deg, #0a0a0f 0%, #0d1a0d 50%, #0a0a0f 100%)",
      },
    },
  },
  {
    id: "editorial",
    name: "Editorial",
    defaults: {
      backgroundType: "solid",
      colors: {
        background: "#ffffff",
        text: "#1a1a1a",
        accent: "#c72c41",
      },
      layout: "left",
    },
    slideSize: { width: 1080, height: 1080 },
    brandKit: {
      brandName: "",
      palette: {
        primary: "#c72c41",
        secondary: "#a32335",
        background: "#ffffff",
        backgroundAlt: "#f5f5f5",
        text: "#1a1a1a",
        accent: "#c72c41",
      },
      typography: { headlineStyle: "editorial", bodyStyle: "serif" },
      visualStyle: "editorial",
      decorativeElements: ["accent-bars", "noise-texture"],
      fonts: {
        url: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Source+Serif+4:wght@400;700&display=swap",
        headline: "DM Serif Display",
        body: "Source Serif 4",
      },
      backgrounds: {
        cover: "linear-gradient(135deg, #c72c41 0%, #a32335 100%)",
        content: "linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)",
        contentAlt: "linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%)",
        statistic: "linear-gradient(135deg, #a32335 0%, #c72c41 100%)",
        quote: "linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)",
        quoteAlt: "linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%)",
        cta: "linear-gradient(135deg, #c72c41 0%, #a32335 100%)",
      },
    },
  },
];

export function getTemplate(id: string): CarouselTemplate {
  return CAROUSEL_TEMPLATES.find((t) => t.id === id) || CAROUSEL_TEMPLATES[0];
}

export function getSlideSizeForPlatform(platform: string): { width: number; height: number } {
  if (platform === "instagram") return { width: 1080, height: 1080 };
  return { width: 1080, height: 1350 };
}
