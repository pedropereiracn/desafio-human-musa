import type { CarouselTemplate } from "./types";

export const CAROUSEL_TEMPLATES: CarouselTemplate[] = [
  {
    id: "obsidian",
    name: "Obsidian",
    defaults: {
      backgroundType: "solid",
      colors: {
        background: "#0c0c10",
        text: "#ffffff",
        accent: "#f97066",
      },
      layout: "centered",
    },
    slideSize: { width: 1080, height: 1080 },
  },
  {
    id: "sunset",
    name: "Sunset",
    defaults: {
      backgroundType: "gradient",
      colors: {
        background: "#f97066",
        backgroundEnd: "#f59e0b",
        text: "#ffffff",
        accent: "#ffffff",
      },
      layout: "centered",
    },
    slideSize: { width: 1080, height: 1080 },
  },
  {
    id: "minimal",
    name: "Minimal",
    defaults: {
      backgroundType: "solid",
      colors: {
        background: "#ffffff",
        text: "#1a1a1a",
        accent: "#f97066",
      },
      layout: "left",
    },
    slideSize: { width: 1080, height: 1080 },
  },
  {
    id: "teal-focus",
    name: "Teal Focus",
    defaults: {
      backgroundType: "solid",
      colors: {
        background: "#0f172a",
        text: "#e2e8f0",
        accent: "#2dd4bf",
      },
      layout: "centered",
    },
    slideSize: { width: 1080, height: 1080 },
  },
  {
    id: "bold-contrast",
    name: "Bold Contrast",
    defaults: {
      backgroundType: "solid",
      colors: {
        background: "#0c0c10",
        text: "#ffffff",
        accent: "#f97066",
      },
      layout: "centered",
    },
    slideSize: { width: 1080, height: 1080 },
  },
  {
    id: "custom",
    name: "Custom",
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
  },
];

export function getTemplate(id: string): CarouselTemplate {
  return CAROUSEL_TEMPLATES.find((t) => t.id === id) || CAROUSEL_TEMPLATES[0];
}

export function getSlideSizeForPlatform(platform: string): { width: number; height: number } {
  if (platform === "instagram") return { width: 1080, height: 1080 };
  return { width: 1080, height: 1350 }; // LinkedIn, default
}
