import type { BrandKit, SlideType, TypographyStyle, CarouselSlide } from "./types";

// ═══ TYPOGRAPHY MAPS ═══

interface TypographyCSS {
  fontFamily: string;
  fontWeight: number;
  letterSpacing: string;
  textTransform: string;
  headlineSizes: { large: number; medium: number; small: number };
}

const TYPOGRAPHY_MAP: Record<TypographyStyle, TypographyCSS> = {
  "uppercase-bold": {
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    fontWeight: 900,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    headlineSizes: { large: 64, medium: 52, small: 42 },
  },
  elegant: {
    fontFamily: "Georgia, 'Times New Roman', 'Palatino Linotype', serif",
    fontWeight: 700,
    letterSpacing: "0.01em",
    textTransform: "none",
    headlineSizes: { large: 60, medium: 48, small: 40 },
  },
  playful: {
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    fontWeight: 800,
    letterSpacing: "-0.01em",
    textTransform: "none",
    headlineSizes: { large: 66, medium: 54, small: 44 },
  },
  minimal: {
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    textTransform: "none",
    headlineSizes: { large: 56, medium: 46, small: 38 },
  },
  tech: {
    fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
    fontWeight: 700,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    headlineSizes: { large: 52, medium: 42, small: 36 },
  },
  editorial: {
    fontFamily: "Georgia, 'Times New Roman', 'Palatino Linotype', serif",
    fontWeight: 800,
    letterSpacing: "-0.01em",
    textTransform: "none",
    headlineSizes: { large: 62, medium: 50, small: 42 },
  },
};

const BODY_FONT_MAP: Record<"clean" | "serif" | "mono", string> = {
  clean: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "'SF Mono', 'Fira Code', 'Consolas', monospace",
};

export function getHeadlineStyle(brandKit: BrandKit) {
  return TYPOGRAPHY_MAP[brandKit.typography.headlineStyle];
}

export function getBodyFont(brandKit: BrandKit) {
  return BODY_FONT_MAP[brandKit.typography.bodyStyle];
}

export function getHeadlineSize(brandKit: BrandKit, textLength: number) {
  const sizes = TYPOGRAPHY_MAP[brandKit.typography.headlineStyle].headlineSizes;
  if (textLength > 60) return sizes.small;
  if (textLength > 30) return sizes.medium;
  return sizes.large;
}

// ═══ DECORATIVE ELEMENTS ═══

export function getDecorativeStyles(
  elementType: string,
  palette: BrandKit["palette"],
  _w: number,
  _h: number
): React.CSSProperties[] {
  switch (elementType) {
    case "geometric-shapes":
      return [
        {
          position: "absolute" as const,
          top: 40,
          right: 40,
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: `3px solid ${palette.accent}`,
          opacity: 0.3,
        },
        {
          position: "absolute" as const,
          bottom: 60,
          left: 50,
          width: 50,
          height: 50,
          border: `3px solid ${palette.accent}`,
          opacity: 0.2,
          transform: "rotate(45deg)",
        },
      ];

    case "accent-bars":
      return [
        {
          position: "absolute" as const,
          top: 0,
          left: 0,
          width: 6,
          height: "100%",
          background: palette.accent,
        },
        {
          position: "absolute" as const,
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${palette.accent}, transparent)`,
        },
      ];

    case "gradient-overlays":
      return [
        {
          position: "absolute" as const,
          inset: 0,
          background: `linear-gradient(180deg, transparent 0%, ${palette.primary}22 100%)`,
          pointerEvents: "none" as const,
        },
      ];

    case "dot-grid":
      return [
        {
          position: "absolute" as const,
          inset: 0,
          backgroundImage: `radial-gradient(${palette.accent}18 1.5px, transparent 1.5px)`,
          backgroundSize: "30px 30px",
          pointerEvents: "none" as const,
        },
      ];

    case "noise-texture":
      return [
        {
          position: "absolute" as const,
          inset: 0,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          pointerEvents: "none" as const,
        },
      ];

    case "corner-brackets":
      return [
        // Top-left
        {
          position: "absolute" as const,
          top: 30,
          left: 30,
          width: 40,
          height: 40,
          borderTop: `3px solid ${palette.accent}`,
          borderLeft: `3px solid ${palette.accent}`,
          opacity: 0.6,
        },
        // Bottom-right
        {
          position: "absolute" as const,
          bottom: 30,
          right: 30,
          width: 40,
          height: 40,
          borderBottom: `3px solid ${palette.accent}`,
          borderRight: `3px solid ${palette.accent}`,
          opacity: 0.6,
        },
      ];

    case "diagonal-lines":
      return [
        {
          position: "absolute" as const,
          inset: 0,
          backgroundImage: `repeating-linear-gradient(45deg, ${palette.accent}08, ${palette.accent}08 1px, transparent 1px, transparent 20px)`,
          pointerEvents: "none" as const,
        },
      ];

    default:
      return [];
  }
}

// ═══ SLIDE BACKGROUNDS ═══

export function getSlideBackground(
  brandKit: BrandKit,
  slideType: SlideType | undefined,
  order: number
): string {
  const p = brandKit.palette;
  const type = slideType || "content";

  switch (type) {
    case "cover":
      return p.primary;
    case "cta":
      return p.primary;
    case "statistic":
      return p.secondary;
    case "quote":
      return order % 2 === 0 ? p.background : p.backgroundAlt;
    case "list":
      return order % 2 === 0 ? p.backgroundAlt : p.background;
    case "content":
    default:
      return order % 2 === 0 ? p.background : p.backgroundAlt;
  }
}

export function getSlideTextColor(
  brandKit: BrandKit,
  slideType: SlideType | undefined,
): string {
  const p = brandKit.palette;
  const type = slideType || "content";

  // For cover/cta/statistic on dark primary/secondary, use white
  // For light backgrounds, use dark text
  if (type === "cover" || type === "cta" || type === "statistic") {
    // Determine if the background is light or dark
    const bg = type === "statistic" ? p.secondary : p.primary;
    return isLightColor(bg) ? "#0c0c10" : "#ffffff";
  }
  return p.text;
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

// ═══ LEGACY CONVERSION ═══

export function brandKitFromLegacy(colors: CarouselSlide["colors"]): BrandKit {
  return {
    brandName: "",
    palette: {
      primary: colors.accent,
      secondary: colors.background,
      background: colors.background,
      backgroundAlt: adjustBrightness(colors.background, 15),
      text: colors.text,
      accent: colors.accent,
    },
    typography: {
      headlineStyle: "minimal",
      bodyStyle: "clean",
    },
    visualStyle: "corporate",
    decorativeElements: [],
  };
}

function adjustBrightness(hex: string, amount: number): string {
  const c = hex.replace("#", "");
  const r = Math.min(255, Math.max(0, parseInt(c.substring(0, 2), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(c.substring(2, 4), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(c.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
