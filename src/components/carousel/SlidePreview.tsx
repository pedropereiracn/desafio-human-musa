"use client";

import type { CarouselSlide, BrandKit, SlideType } from "@/lib/types";
import {
  getHeadlineStyle,
  getBodyFont,
  getHeadlineSize,
  getSlideBackground,
  getSlideTextColor,
  getDecorativeStyles,
  brandKitFromLegacy,
  getResolvedHeadlineFont,
  getResolvedBodyFont,
  adjustBrightness,
} from "@/lib/brand-kit";

interface SlidePreviewProps {
  slide: CarouselSlide;
  width: number;
  height: number;
  scale?: number;
  className?: string;
  brandKit?: BrandKit;
}

function resolveBrandKit(slide: CarouselSlide, brandKit?: BrandKit): BrandKit {
  if (brandKit) return brandKit;
  return brandKitFromLegacy(slide.colors);
}

// ═══ DECORATIONS LAYER ═══

function DecorationsLayer({ brandKit, w, h }: { brandKit: BrandKit; w: number; h: number }) {
  const allStyles = brandKit.decorativeElements.flatMap((el) =>
    getDecorativeStyles(el, brandKit.palette, w, h)
  );
  if (allStyles.length === 0) return null;
  return (
    <>
      {allStyles.map((style, i) => (
        <div key={i} style={style} />
      ))}
    </>
  );
}

// ═══ SLIDE NUMBER ═══

function SlideNumber({ order, total, color }: { order: number; total?: number; color: string }) {
  return (
    <span
      style={{
        position: "absolute",
        bottom: 32,
        right: 40,
        fontSize: 16,
        fontWeight: 600,
        opacity: 0.4,
        color,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {String(order + 1).padStart(2, "0")}
      {total !== undefined && ` / ${String(total).padStart(2, "0")}`}
    </span>
  );
}

// ═══ HANDLE WATERMARK ═══

function HandleWatermark({ handle, color }: { handle?: string; color: string }) {
  if (!handle) return null;
  return (
    <span
      style={{
        position: "absolute",
        bottom: 32,
        left: 40,
        fontSize: 16,
        fontWeight: 500,
        opacity: 0.5,
        color,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {handle}
    </span>
  );
}

// ═══ COVER SLIDE ═══

function CoverSlide({ slide, bk, w, h }: { slide: CarouselSlide; bk: BrandKit; w: number; h: number }) {
  const typo = getHeadlineStyle(bk);
  const bg = getSlideBackground(bk, "cover", slide.order);
  const textColor = getSlideTextColor(bk, "cover");

  return (
    <div style={{ width: w, height: h, background: bg, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 80, textAlign: "center" }}>
      {/* Overlay gradient for depth */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 50%, rgba(0,0,0,0.15) 100%)", pointerEvents: "none" }} />
      <DecorationsLayer brandKit={bk} w={w} h={h} />
      <h2 style={{
        fontFamily: getResolvedHeadlineFont(bk),
        fontWeight: typo.fontWeight,
        fontSize: Math.min(72, getHeadlineSize(bk, slide.headline.length) + 8),
        letterSpacing: typo.letterSpacing,
        textTransform: typo.textTransform as "uppercase" | "none",
        lineHeight: 1.1,
        color: textColor,
        margin: 0,
        marginBottom: slide.body ? 28 : 0,
        maxWidth: "100%",
        wordBreak: "break-word",
        textShadow: "0 4px 30px rgba(0,0,0,0.4)",
        position: "relative",
      }}>
        {slide.headline}
      </h2>
      {slide.body && (
        <p style={{
          fontFamily: getResolvedBodyFont(bk),
          fontSize: 28,
          fontWeight: 400,
          lineHeight: 1.5,
          color: textColor,
          opacity: 0.85,
          margin: 0,
          maxWidth: "100%",
          position: "relative",
        }}>
          {slide.body}
        </p>
      )}
      <HandleWatermark handle={bk.handle} color={textColor} />
    </div>
  );
}

// ═══ CONTENT SLIDE ═══

function ContentSlide({ slide, bk, w, h }: { slide: CarouselSlide; bk: BrandKit; w: number; h: number }) {
  const typo = getHeadlineStyle(bk);
  const bg = getSlideBackground(bk, "content", slide.order);
  const textColor = bk.palette.text;

  return (
    <div style={{ width: w, height: h, background: bg, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80 }}>
      <DecorationsLayer brandKit={bk} w={w} h={h} />
      <div style={{ marginBottom: 12 }}>
        <h2 style={{
          fontFamily: getResolvedHeadlineFont(bk),
          fontWeight: typo.fontWeight,
          fontSize: getHeadlineSize(bk, slide.headline.length),
          letterSpacing: typo.letterSpacing,
          textTransform: typo.textTransform as "uppercase" | "none",
          lineHeight: 1.15,
          color: textColor,
          margin: 0,
          maxWidth: "100%",
          wordBreak: "break-word",
        }}>
          {slide.headline}
        </h2>
        <div style={{
          width: 60,
          height: 4,
          borderRadius: 2,
          background: bk.palette.accent,
          marginTop: 16,
        }} />
      </div>
      {slide.body && (
        <p style={{
          fontFamily: getResolvedBodyFont(bk),
          fontSize: 26,
          fontWeight: 400,
          lineHeight: 1.55,
          color: textColor,
          opacity: 0.85,
          margin: 0,
          marginTop: 12,
          maxWidth: "100%",
        }}>
          {slide.body}
        </p>
      )}
      {slide.footnote && (
        <p style={{
          fontFamily: getResolvedBodyFont(bk),
          fontSize: 18,
          fontWeight: 500,
          color: textColor,
          opacity: 0.45,
          margin: 0,
          marginTop: 28,
        }}>
          {slide.footnote}
        </p>
      )}
      <SlideNumber order={slide.order} color={textColor} />
      <HandleWatermark handle={bk.handle} color={textColor} />
    </div>
  );
}

// ═══ STATISTIC SLIDE ═══

function StatisticSlide({ slide, bk, w, h }: { slide: CarouselSlide; bk: BrandKit; w: number; h: number }) {
  const typo = getHeadlineStyle(bk);
  const bg = getSlideBackground(bk, "statistic", slide.order);
  const textColor = getSlideTextColor(bk, "statistic");
  const statValue = slide.statValue || slide.headline;
  const statLabel = slide.statLabel || slide.body || "";

  return (
    <div style={{ width: w, height: h, background: bg, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 80, textAlign: "center" }}>
      <DecorationsLayer brandKit={bk} w={w} h={h} />
      {slide.statValue && (
        <p style={{
          fontFamily: getResolvedHeadlineFont(bk),
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: textColor,
          opacity: 0.6,
          margin: 0,
          marginBottom: 16,
        }}>
          {slide.headline}
        </p>
      )}
      <span style={{
        fontFamily: getResolvedHeadlineFont(bk),
        fontWeight: 900,
        fontSize: statValue.length > 8 ? 80 : 110,
        lineHeight: 1,
        color: bk.palette.accent,
        margin: 0,
        letterSpacing: "-0.02em",
        textShadow: `0 0 60px ${bk.palette.accent}50, 0 0 120px ${bk.palette.accent}20`,
      }}>
        {statValue}
      </span>
      {statLabel && (
        <p style={{
          fontFamily: getResolvedBodyFont(bk),
          fontSize: 26,
          fontWeight: 500,
          lineHeight: 1.4,
          color: textColor,
          opacity: 0.8,
          margin: 0,
          marginTop: 20,
          maxWidth: 600,
        }}>
          {statLabel}
        </p>
      )}
      <SlideNumber order={slide.order} color={textColor} />
    </div>
  );
}

// ═══ QUOTE SLIDE ═══

function QuoteSlide({ slide, bk, w, h }: { slide: CarouselSlide; bk: BrandKit; w: number; h: number }) {
  const bg = getSlideBackground(bk, "quote", slide.order);
  const textColor = bk.palette.text;

  return (
    <div style={{ width: w, height: h, background: bg, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "80px 100px", textAlign: "center" }}>
      <DecorationsLayer brandKit={bk} w={w} h={h} />
      {/* Large quote mark */}
      <svg width="100" height="80" viewBox="0 0 100 80" style={{ marginBottom: 24, flexShrink: 0 }}>
        <text x="0" y="70" fontFamily="Georgia, serif" fontSize="100" fontWeight="bold" fill={bk.palette.accent} opacity="0.5">
          {"\u201C"}
        </text>
      </svg>
      <p style={{
        fontFamily: getResolvedBodyFont(bk),
        fontSize: slide.headline.length > 80 ? 32 : 38,
        fontWeight: 500,
        fontStyle: "italic",
        lineHeight: 1.45,
        color: textColor,
        margin: 0,
        maxWidth: "100%",
        wordBreak: "break-word",
      }}>
        {slide.headline}
      </p>
      {slide.quoteAttribution && (
        <p style={{
          fontFamily: getResolvedBodyFont(bk),
          fontSize: 20,
          fontWeight: 600,
          color: bk.palette.accent,
          margin: 0,
          marginTop: 28,
        }}>
          — {slide.quoteAttribution}
        </p>
      )}
      <SlideNumber order={slide.order} color={textColor} />
      <HandleWatermark handle={bk.handle} color={textColor} />
    </div>
  );
}

// ═══ LIST SLIDE ═══

function ListSlide({ slide, bk, w, h }: { slide: CarouselSlide; bk: BrandKit; w: number; h: number }) {
  const typo = getHeadlineStyle(bk);
  const bg = getSlideBackground(bk, "list", slide.order);
  const textColor = bk.palette.text;
  const items = slide.listItems?.length ? slide.listItems : (slide.body ? slide.body.split("\n").filter(Boolean) : []);
  const darkerAccent = adjustBrightness(bk.palette.accent, -40);

  return (
    <div style={{ width: w, height: h, background: bg, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "70px 80px" }}>
      <DecorationsLayer brandKit={bk} w={w} h={h} />
      <h2 style={{
        fontFamily: getResolvedHeadlineFont(bk),
        fontWeight: typo.fontWeight,
        fontSize: Math.min(48, getHeadlineSize(bk, slide.headline.length)),
        letterSpacing: typo.letterSpacing,
        textTransform: typo.textTransform as "uppercase" | "none",
        lineHeight: 1.15,
        color: textColor,
        margin: 0,
        marginBottom: 36,
        maxWidth: "100%",
        wordBreak: "break-word",
      }}>
        {slide.headline}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <span style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${bk.palette.accent}, ${darkerAccent})`,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 700,
              flexShrink: 0,
              marginTop: 2,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              {i + 1}
            </span>
            <p style={{
              fontFamily: getResolvedBodyFont(bk),
              fontSize: 24,
              fontWeight: 400,
              lineHeight: 1.45,
              color: textColor,
              opacity: 0.9,
              margin: 0,
            }}>
              {item}
            </p>
          </div>
        ))}
      </div>
      <SlideNumber order={slide.order} color={textColor} />
      <HandleWatermark handle={bk.handle} color={textColor} />
    </div>
  );
}

// ═══ CTA SLIDE ═══

function CTASlide({ slide, bk, w, h }: { slide: CarouselSlide; bk: BrandKit; w: number; h: number }) {
  const typo = getHeadlineStyle(bk);
  const bg = getSlideBackground(bk, "cta", slide.order);
  const textColor = getSlideTextColor(bk, "cta");

  return (
    <div style={{ width: w, height: h, background: bg, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 80, textAlign: "center" }}>
      <DecorationsLayer brandKit={bk} w={w} h={h} />
      <h2 style={{
        fontFamily: getResolvedHeadlineFont(bk),
        fontWeight: typo.fontWeight,
        fontSize: Math.min(60, getHeadlineSize(bk, slide.headline.length)),
        letterSpacing: typo.letterSpacing,
        textTransform: typo.textTransform as "uppercase" | "none",
        lineHeight: 1.15,
        color: textColor,
        margin: 0,
        marginBottom: slide.body ? 24 : 32,
        maxWidth: "100%",
        wordBreak: "break-word",
        textShadow: "0 4px 30px rgba(0,0,0,0.4)",
      }}>
        {slide.headline}
      </h2>
      {slide.body && (
        <p style={{
          fontFamily: getResolvedBodyFont(bk),
          fontSize: 24,
          fontWeight: 400,
          lineHeight: 1.5,
          color: textColor,
          opacity: 0.8,
          margin: 0,
          marginBottom: 36,
          maxWidth: "100%",
        }}>
          {slide.body}
        </p>
      )}
      <div style={{
        padding: "16px 48px",
        borderRadius: 12,
        background: textColor,
        color: bg,
        fontFamily: getResolvedBodyFont(bk),
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: "0.02em",
        boxShadow: `0 4px 20px ${bk.palette.accent}40`,
      }}>
        {slide.footnote || "Seguir →"}
      </div>
      {bk.handle && (
        <span style={{
          fontFamily: getResolvedBodyFont(bk),
          fontSize: 22,
          fontWeight: 600,
          color: textColor,
          opacity: 0.7,
          marginTop: 28,
        }}>
          {bk.handle}
        </span>
      )}
    </div>
  );
}

// ═══ HTML SLIDE RENDERER (Rich HTML from Claude) ═══

function HtmlSlideRenderer({ html, width, height }: { html: string; width: number; height: number }) {
  const sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/on\w+\s*=\s*'[^']*'/gi, "");

  return (
    <div
      style={{ width, height, overflow: "hidden", position: "relative", pointerEvents: "none" }}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

// ═══ MAIN DISPATCHER ═══

function renderSlide(slide: CarouselSlide, w: number, h: number, bk: BrandKit) {
  // Rich HTML slides take priority
  if (slide.htmlContent) {
    return <HtmlSlideRenderer html={slide.htmlContent} width={w} height={h} />;
  }

  // Fallback to legacy typed renderers
  const type: SlideType = slide.slideType || "content";

  switch (type) {
    case "cover":
      return <CoverSlide slide={slide} bk={bk} w={w} h={h} />;
    case "statistic":
      return <StatisticSlide slide={slide} bk={bk} w={w} h={h} />;
    case "quote":
      return <QuoteSlide slide={slide} bk={bk} w={w} h={h} />;
    case "list":
      return <ListSlide slide={slide} bk={bk} w={w} h={h} />;
    case "cta":
      return <CTASlide slide={slide} bk={bk} w={w} h={h} />;
    case "content":
    default:
      return <ContentSlide slide={slide} bk={bk} w={w} h={h} />;
  }
}

export default function SlidePreview({ slide, width, height, scale, className, brandKit }: SlidePreviewProps) {
  const displayWidth = scale ? width * scale : width;
  const displayHeight = scale ? height * scale : height;
  const bk = resolveBrandKit(slide, brandKit);

  return (
    <div
      className={className}
      style={{
        width: displayWidth,
        height: displayHeight,
        overflow: "hidden",
        borderRadius: scale ? 8 : 0,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          transform: scale ? `scale(${scale})` : undefined,
          transformOrigin: "top left",
        }}
      >
        {renderSlide(slide, width, height, bk)}
      </div>
    </div>
  );
}

// Hidden full-size renderer for export
export function SlideExportRenderer({
  slides,
  width,
  height,
  containerRef,
  brandKit,
}: {
  slides: CarouselSlide[];
  width: number;
  height: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  brandKit?: BrandKit;
}) {
  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        left: "-9999px",
        top: 0,
      }}
    >
      {slides.map((slide) => (
        <div key={slide.id} data-slide-id={slide.id}>
          <SlidePreview slide={slide} width={width} height={height} brandKit={brandKit} />
        </div>
      ))}
    </div>
  );
}
