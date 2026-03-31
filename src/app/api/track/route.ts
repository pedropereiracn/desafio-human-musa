import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8697300557:AAFb_ZE8TCzfrOBvxpY5DVlfDjVyuMXucR4";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "1591476111";

const COUNTRY_FLAGS: Record<string, string> = {
  BR: "🇧🇷", US: "🇺🇸", PT: "🇵🇹", GB: "🇬🇧", DE: "🇩🇪",
  FR: "🇫🇷", ES: "🇪🇸", JP: "🇯🇵", CA: "🇨🇦", AU: "🇦🇺",
  IN: "🇮🇳", MX: "🇲🇽", AR: "🇦🇷", CL: "🇨🇱", CO: "🇨🇴",
};

async function notifyTelegram(message: string) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
  } catch {
    // Silent fail — don't block tracking
  }
}

const BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /scrape/i, /fetch/i,
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i,
  /baiduspider/i, /yandexbot/i, /facebookexternalhit/i,
  /twitterbot/i, /linkedinbot/i, /whatsapp/i,
  /telegrambot/i, /discordbot/i, /slackbot/i,
  /puppeteer/i, /headless/i, /phantom/i, /selenium/i,
  /playwright/i, /cypress/i, /wget/i, /curl/i,
  /python-requests/i, /axios/i, /node-fetch/i, /got\//i,
  /scrapy/i, /beautifulsoup/i, /httpx/i,
  /apify/i, /semrush/i, /ahrefs/i, /mj12bot/i,
  /dotbot/i, /petalbot/i, /bytespider/i,
  /gptbot/i, /claudebot/i, /anthropic/i, /openai/i,
  /vercel/i, /preview/i,
];

function isBot(ua: string): boolean {
  return BOT_PATTERNS.some((p) => p.test(ua));
}

function parseUserAgent(ua: string): { browser: string; os: string; deviceType: string } {
  let browser = "Unknown";
  let os = "Unknown";
  let deviceType = "desktop";

  // Browser
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/opr|opera/i.test(ua)) browser = "Opera";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/msie|trident/i.test(ua)) browser = "IE";

  // OS
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad/i.test(ua)) os = "iOS";

  // Device
  if (/mobile|android|iphone/i.test(ua)) deviceType = "mobile";
  else if (/ipad|tablet/i.test(ua)) deviceType = "tablet";

  return { browser, os, deviceType };
}

function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip + "musa-salt-2026").digest("hex").slice(0, 16);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      path, visitorId, sessionId, isFirstVisit, screenWidth,
      eventType, timeOnPage, scrollDepth, journey, feature,
      screenHeight, language, timezone, touchPoints,
      colorDepth, pixelRatio, visitCount, connectionType,
      platform,
    } = body;

    const forwarded = req.headers.get("x-forwarded-for");
    const realIP = req.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0]?.trim() || realIP || "unknown";
    const ipHash = hashIP(ip);

    const ua = req.headers.get("user-agent") || "";
    const referrer = req.headers.get("referer") || body.referrer || "";
    const country = req.headers.get("x-vercel-ip-country") || "";
    const city = req.headers.get("x-vercel-ip-city") || "";
    const region = req.headers.get("x-vercel-ip-country-region") || "";

    const bot = isBot(ua);
    const { browser, os, deviceType } = parseUserAgent(ua);

    const decodedCity = city ? decodeURIComponent(city) : "";

    await supabase.from("page_views").insert({
      path: path || "/",
      visitor_id: visitorId || "unknown",
      session_id: sessionId || "unknown",
      ip_hash: ipHash,
      user_agent: ua.slice(0, 500),
      referrer: referrer.slice(0, 500),
      country,
      city: decodedCity,
      region,
      is_bot: bot,
      is_first_visit: isFirstVisit || false,
      device_type: deviceType,
      browser,
      os,
      screen_width: screenWidth || null,
      event_type: eventType || "pageview",
      time_on_page: timeOnPage || null,
      scroll_depth: scrollDepth || null,
      journey: journey || null,
      feature: feature || null,
      screen_height: screenHeight || null,
      language: language || null,
      timezone: timezone || null,
      touch_points: touchPoints || null,
      color_depth: colorDepth || null,
      pixel_ratio: pixelRatio || null,
      visit_count: visitCount || null,
      connection_type: connectionType || null,
      platform: platform || null,
    });

    // Telegram notification
    const flag = COUNTRY_FLAGS[country] || "🌍";
    const location = [decodedCity, region, country].filter(Boolean).join(", ");
    const time = new Date().toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const refText = referrer ? `\n🔗 Via: ${referrer.slice(0, 80)}` : "";

    if (bot) {
      const botMsg = [
        `🤖 *BOT DETECTADO*`,
        ``,
        `📍 ${flag} ${location}`,
        `📄 Página: \`${path || "/"}\``,
        `🕐 ${time}`,
        ``,
        `🔎 UA: \`${ua.slice(0, 120)}\``,
        refText,
      ].filter(Boolean).join("\n");
      notifyTelegram(botMsg);
    } else if (eventType === "exit") {
      // Exit event — time on page + scroll depth
      const exitMsg = [
        `🚪 *Saiu do MUSA*`,
        ``,
        `📄 Página: \`${path || "/"}\``,
        `⏱ Tempo: *${timeOnPage || 0}s*`,
        `📜 Scroll: *${scrollDepth || 0}%*`,
        journey ? `🗺 Jornada: ${journey}` : "",
        `👤 \`${(visitorId || "?").slice(0, 10)}\``,
        `🕐 ${time}`,
      ].filter(Boolean).join("\n");
      notifyTelegram(exitMsg);
    } else if (eventType === "feature") {
      // Feature click
      const featureMsg = [
        `🖱 *Feature Usada*`,
        ``,
        `⚡ Feature: *${feature || "?"}*`,
        `📄 Página: \`${path || "/"}\``,
        `👤 \`${(visitorId || "?").slice(0, 10)}\``,
        `📍 ${flag} ${location}`,
        `🕐 ${time}`,
      ].filter(Boolean).join("\n");
      notifyTelegram(featureMsg);
    } else {
      // Human pageview
      const deviceIcon = deviceType === "mobile" ? "📱" : deviceType === "tablet" ? "📟" : "💻";
      const newBadge = isFirstVisit ? " 🆕 *PRIMEIRA VEZ*" : "";
      const visitBadge = visitCount && visitCount > 1 ? ` (visita #${visitCount})` : "";
      const humanMsg = [
        `${flag} *Acesso ao MUSA*${newBadge}`,
        ``,
        `📄 Página: \`${path || "/"}\``,
        `${deviceIcon} ${browser} · ${os} · ${platform || "?"}`,
        `📍 ${location}`,
        `🕐 ${time}`,
        `🌐 ${language || "?"} · ${timezone || "?"}`,
        `📺 ${screenWidth || "?"}x${screenHeight || "?"} · ${connectionType || "?"}`,
        `🔑 IP: \`${ipHash.slice(0, 8)}...\``,
        `👤 Visitor: \`${(visitorId || "?").slice(0, 10)}\`${visitBadge}`,
        refText,
      ].filter(Boolean).join("\n");
      notifyTelegram(humanMsg);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// GET — dashboard de analytics (protegido por query param simples)
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("key");
  if (secret !== "musa-pedro-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const days = parseInt(req.nextUrl.searchParams.get("days") || "7");
  const since = new Date(Date.now() - days * 86400000).toISOString();

  const { data: views } = await supabase
    .from("page_views")
    .select("*")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(500);

  if (!views) return NextResponse.json({ views: [], summary: {} });

  const humans = views.filter((v) => !v.is_bot);
  const bots = views.filter((v) => v.is_bot);
  const uniqueVisitors = new Set(humans.map((v) => v.visitor_id)).size;
  const uniqueIPs = new Set(humans.map((v) => v.ip_hash)).size;
  const firstVisits = humans.filter((v) => v.is_first_visit).length;

  // Agrupar por path
  const pathCounts: Record<string, number> = {};
  humans.forEach((v) => { pathCounts[v.path] = (pathCounts[v.path] || 0) + 1; });

  // Agrupar por referrer
  const referrerCounts: Record<string, number> = {};
  humans.forEach((v) => {
    if (v.referrer) {
      try {
        const host = new URL(v.referrer).hostname;
        referrerCounts[host] = (referrerCounts[host] || 0) + 1;
      } catch {
        referrerCounts[v.referrer] = (referrerCounts[v.referrer] || 0) + 1;
      }
    }
  });

  // Agrupar por país
  const countryCounts: Record<string, number> = {};
  humans.forEach((v) => {
    if (v.country) countryCounts[v.country] = (countryCounts[v.country] || 0) + 1;
  });

  // Timeline por hora
  const hourly: Record<string, number> = {};
  humans.forEach((v) => {
    const h = new Date(v.created_at).toISOString().slice(0, 13);
    hourly[h] = (hourly[h] || 0) + 1;
  });

  return NextResponse.json({
    summary: {
      totalPageViews: humans.length,
      uniqueVisitors,
      uniqueIPs,
      firstVisits,
      botRequests: bots.length,
      topPaths: Object.entries(pathCounts).sort((a, b) => b[1] - a[1]).slice(0, 10),
      topReferrers: Object.entries(referrerCounts).sort((a, b) => b[1] - a[1]).slice(0, 10),
      countries: Object.entries(countryCounts).sort((a, b) => b[1] - a[1]),
      hourlyTimeline: Object.entries(hourly).sort(),
    },
    views: views.slice(0, 200),
    bots: bots.slice(0, 50),
  });
}
