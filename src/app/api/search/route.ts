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
    const references = await searchFn(topic, 15);

    // Sort by engagement
    references.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));

    return NextResponse.json({ references: references.slice(0, 12) });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Erro ao buscar referências" }, { status: 500 });
  }
}
