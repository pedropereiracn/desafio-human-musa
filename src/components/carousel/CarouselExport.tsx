"use client";

import { useState, useRef } from "react";
import { Download, FileImage, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CarouselSlide } from "@/lib/types";
import { SlideExportRenderer } from "./SlidePreview";

interface CarouselExportProps {
  slides: CarouselSlide[];
  width: number;
  height: number;
  title: string;
}

export default function CarouselExport({ slides, width, height, title }: CarouselExportProps) {
  const [exporting, setExporting] = useState<"png" | "pdf" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const exportPNG = async () => {
    if (!containerRef.current) return;
    setExporting("png");

    try {
      const html2canvas = (await import("html2canvas")).default;
      const slideElements = containerRef.current.querySelectorAll("[data-slide-id]");

      for (let i = 0; i < slideElements.length; i++) {
        const el = slideElements[i] as HTMLElement;
        const canvas = await html2canvas(el, {
          width,
          height,
          scale: 1,
          useCORS: true,
          backgroundColor: null,
        });

        const link = document.createElement("a");
        link.download = `${title}-slide-${i + 1}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        // Small delay between downloads
        if (i < slideElements.length - 1) {
          await new Promise((r) => setTimeout(r, 300));
        }
      }
    } catch (error) {
      console.error("PNG export error:", error);
    } finally {
      setExporting(null);
    }
  };

  const exportPDF = async () => {
    if (!containerRef.current) return;
    setExporting("pdf");

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const slideElements = containerRef.current.querySelectorAll("[data-slide-id]");

      const pdf = new jsPDF({
        orientation: width > height ? "landscape" : "portrait",
        unit: "px",
        format: [width, height],
      });

      for (let i = 0; i < slideElements.length; i++) {
        if (i > 0) pdf.addPage([width, height]);

        const el = slideElements[i] as HTMLElement;
        const canvas = await html2canvas(el, {
          width,
          height,
          scale: 1,
          useCORS: true,
          backgroundColor: null,
        });

        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
      }

      pdf.save(`${title}.pdf`);
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setExporting(null);
    }
  };

  return (
    <>
      <SlideExportRenderer
        slides={slides}
        width={width}
        height={height}
        containerRef={containerRef}
      />

      <div className="flex gap-2">
        <button
          onClick={exportPNG}
          disabled={exporting !== null}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
            "border-border text-muted-foreground hover:text-foreground hover:border-primary/30 disabled:opacity-50"
          )}
        >
          {exporting === "png" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <FileImage size={14} />
          )}
          PNG
        </button>
        <button
          onClick={exportPDF}
          disabled={exporting !== null}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
            "border-border text-muted-foreground hover:text-foreground hover:border-primary/30 disabled:opacity-50"
          )}
        >
          {exporting === "pdf" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <FileText size={14} />
          )}
          PDF
        </button>
        <button
          onClick={exportPNG}
          disabled={exporting !== null}
          className="flex items-center gap-2 btn-primary !py-2.5 !px-5 disabled:opacity-50"
        >
          {exporting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          Exportar
        </button>
      </div>
    </>
  );
}
