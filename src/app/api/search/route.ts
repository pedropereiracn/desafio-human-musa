import { NextRequest, NextResponse } from "next/server";
import { searchInstagram, searchTikTok } from "@/lib/apify";
import { Platform, Reference } from "@/lib/types";

const VIRAL_THRESHOLD = 500; // min likes to consider "viral"

export async function POST(request: NextRequest) {
  try {
    const { topic, platform } = await request.json() as { topic: string; platform: Platform };

    if (!topic) {
      return NextResponse.json({ error: "Tema é obrigatório" }, { status: 400 });
    }

    let references: Reference[];
    let actualPlatform = platform;

    if (platform === "tiktok") {
      references = await searchTikTok(topic);
    } else {
      // Try Instagram first
      references = await searchInstagram(topic);

      // If Instagram returned weak results, fallback to TikTok for viral content
      const hasViral = references.some(r => r.likes >= VIRAL_THRESHOLD || r.views >= 5000);
      if (!hasViral) {
        references = await searchTikTok(topic);
        actualPlatform = "tiktok";
      }
    }

    // Filter out zero-engagement posts
    const filtered = references.filter(r => r.views > 0 || r.likes > 0 || r.comments > 0);

    return NextResponse.json({
      references: filtered,
      platform: actualPlatform,
      fallback: actualPlatform !== platform,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Erro ao buscar referências" }, { status: 500 });
  }
}
