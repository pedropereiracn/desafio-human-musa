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
