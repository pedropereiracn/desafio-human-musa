import { NextRequest, NextResponse } from "next/server";
import { searchInstagram, searchTikTok } from "@/lib/apify";
import { Platform } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { topic, platform } = await request.json() as { topic: string; platform: Platform };

    if (!topic) {
      return NextResponse.json({ error: "Tema é obrigatório" }, { status: 400 });
    }

    const searchFn = platform === "tiktok" ? searchTikTok : searchInstagram;
    const references = await searchFn(topic);

    // Filter out zero-engagement posts
    const filtered = references.filter(r => r.views > 0 || r.likes > 0 || r.comments > 0);

    return NextResponse.json({ references: filtered });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Erro ao buscar referências" }, { status: 500 });
  }
}
