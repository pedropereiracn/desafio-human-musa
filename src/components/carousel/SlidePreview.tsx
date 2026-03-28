"use client";

import type { CarouselSlide } from "@/lib/types";

interface SlidePreviewProps {
  slide: CarouselSlide;
  width: number;
  height: number;
  scale?: number;
  className?: string;
}

function getBackground(slide: CarouselSlide): string {
  if (slide.backgroundType === "gradient" && slide.colors.backgroundEnd) {
    return `linear-gradient(135deg, ${slide.colors.background}, ${slide.colors.backgroundEnd})`;
  }
  return slide.colors.background;
}

function getTextAlign(layout: CarouselSlide["layout"]): string {
  if (layout === "left") return "left";
  if (layout === "split") return "left";
  return "center";
}

function getPadding(layout: CarouselSlide["layout"]): string {
  if (layout === "split") return "80px 80px 80px 100px";
  return "80px";
}

export default function SlidePreview({ slide, width, height, scale, className }: SlidePreviewProps) {
  const displayWidth = scale ? width * scale : width;
  const displayHeight = scale ? height * scale : height;
  const bg = getBackground(slide);
  const textAlign = getTextAlign(slide.layout) as "left" | "center";
  const padding = getPadding(slide.layout);

  // Bold Contrast: alternate slides
  const isBoldAlternate = slide.order % 2 === 1 && slide.colors.accent === "#f97066" && slide.colors.background === "#0c0c10";

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
          width,
          height,
          background: isBoldAlternate ? slide.colors.accent : bg,
          color: isBoldAlternate ? "#0c0c10" : slide.colors.text,
          display: "flex",
          flexDirection: "column",
          justifyContent: slide.layout === "split" ? "flex-end" : "center",
          alignItems: textAlign === "center" ? "center" : "flex-start",
          padding,
          textAlign,
          transform: scale ? `scale(${scale})` : undefined,
          transformOrigin: "top left",
          fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative accent line */}
        {slide.layout === "left" && (
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 80,
              bottom: 80,
              width: 4,
              borderRadius: 2,
              background: slide.colors.accent,
            }}
          />
        )}

        <h2
          style={{
            fontSize: slide.headline.length > 60 ? 42 : slide.headline.length > 30 ? 52 : 64,
            fontWeight: 800,
            lineHeight: 1.15,
            margin: 0,
            marginBottom: slide.body ? 24 : 0,
            maxWidth: "100%",
            wordBreak: "break-word",
          }}
        >
          {slide.headline}
        </h2>

        {slide.body && (
          <p
            style={{
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.5,
              margin: 0,
              marginBottom: slide.footnote ? 32 : 0,
              opacity: 0.85,
              maxWidth: "100%",
            }}
          >
            {slide.body}
          </p>
        )}

        {slide.footnote && (
          <p
            style={{
              fontSize: 20,
              fontWeight: 500,
              margin: 0,
              opacity: 0.5,
              position: slide.layout === "centered" ? "absolute" : "relative",
              bottom: slide.layout === "centered" ? 40 : undefined,
              marginTop: slide.layout !== "centered" ? 40 : undefined,
            }}
          >
            {slide.footnote}
          </p>
        )}
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
}: {
  slides: CarouselSlide[];
  width: number;
  height: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
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
          <SlidePreview slide={slide} width={width} height={height} />
        </div>
      ))}
    </div>
  );
}
