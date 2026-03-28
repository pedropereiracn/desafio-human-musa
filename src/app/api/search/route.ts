import { NextRequest, NextResponse } from "next/server";
import { searchInstagram, searchTikTok } from "@/lib/apify";
import { Platform, Reference } from "@/lib/types";

const VIRAL_THRESHOLD = 500;

export async function POST(request: NextRequest) {
  try {
    const { topic, platform } = await request.json() as { topic: string; platform: Platform };

    if (!topic) {
      return NextResponse.json({ error: "Tema é obrigatório" }, { status: 400 });
    }

    let references: Reference[] = [];
    let actualPlatform = platform;

    if (platform === "tiktok") {
      references = await searchTikTok(topic);
    } else {
      // Try Instagram first, catch errors gracefully
      try {
        references = await searchInstagram(topic);
      } catch (igError) {
        console.warn("Instagram search failed, falling back to TikTok:", igError);
        references = [];
      }

      // If Instagram returned weak results or failed, fallback to TikTok
      const hasViral = references.some(r => r.likes >= VIRAL_THRESHOLD || r.views >= 5000);
      if (!hasViral) {
        try {
          references = await searchTikTok(topic);
          actualPlatform = "tiktok";
        } catch (ttError) {
          console.error("TikTok fallback also failed:", ttError);
          // If both failed and we had some IG results, use those
          if (references.length === 0) {
            return NextResponse.json({ error: "Erro ao buscar referências. Tente novamente." }, { status: 500 });
          }
        }
      }
    }

    // Filter out zero-engagement posts
    const filtered = references.filter(r => r.views > 0 || r.likes > 0 || r.comments > 0);

    // If filter removed everything, return unfiltered
    const finalRefs = filtered.length > 0 ? filtered : references;

    return NextResponse.json({
      references: finalRefs,
      platform: actualPlatform,
      fallback: actualPlatform !== platform,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Erro ao buscar referências" }, { status: 500 });
  }
}
