import { Platform, Reference } from "./types";

const APIFY_TOKEN = process.env.APIFY_API_TOKEN!;
const APIFY_BASE = "https://api.apify.com/v2";
const POLL_INTERVAL = 2000;
const MAX_TIMEOUT = 55000;

const MIN_LIKES = 100;
const MIN_VIEWS = 1000;
const FETCH_LIMIT = 30;
const RETURN_LIMIT = 12;

interface ApifyInstagramPost {
  url?: string;
  displayUrl?: string;
  caption?: string;
  likesCount?: number;
  commentsCount?: number;
  videoPlayCount?: number;
  sharesCount?: number;
  timestamp?: string;
  ownerUsername?: string;
  videoUrl?: string;
  imageUrl?: string;
}

interface ApifyTikTokPost {
  webVideoUrl?: string;
  covers?: string[];
  videoMeta?: { coverUrl?: string };
  text?: string;
  diggCount?: number;
  commentCount?: number;
  shareCount?: number;
  playCount?: number;
  createTime?: number;
  authorMeta?: { name?: string };
}

function engagementScore(ref: Reference): number {
  return (ref.views * 0.1) + ref.likes + (ref.comments * 2) + (ref.shares * 3);
}

function filterAndSort(refs: Reference[]): Reference[] {
  const filtered = refs.filter(r =>
    r.likes >= MIN_LIKES || r.views >= MIN_VIEWS
  );

  const pool = filtered.length >= 5 ? filtered : refs;
  pool.sort((a, b) => engagementScore(b) - engagementScore(a));
  return pool.slice(0, RETURN_LIMIT);
}

export async function searchInstagram(topic: string, limit = FETCH_LIMIT): Promise<Reference[]> {
  const input = {
    hashtags: [topic.replace(/\s+/g, "").toLowerCase()],
    resultsLimit: limit,
  };

  const results = await runApifyActor("apify/instagram-hashtag-scraper", input);

  const refs = (results as ApifyInstagramPost[]).map((post, i) => ({
    id: `ig-${i}`,
    url: post.url || "",
    thumbnail: post.displayUrl || post.imageUrl || "",
    caption: post.caption || "",
    views: post.videoPlayCount || 0,
    likes: post.likesCount || 0,
    comments: post.commentsCount || 0,
    shares: post.sharesCount || 0,
    date: post.timestamp || "",
    author: post.ownerUsername || "",
    platform: "instagram" as Platform,
  }));

  return filterAndSort(refs);
}

export async function searchTikTok(topic: string, limit = FETCH_LIMIT): Promise<Reference[]> {
  const input = {
    searchQueries: [topic],
    resultsPerPage: limit,
    shouldDownloadVideos: false,
  };

  const results = await runApifyActor("clockworks/tiktok-scraper", input);

  const refs = (results as ApifyTikTokPost[]).map((post, i) => ({
    id: `tt-${i}`,
    url: post.webVideoUrl || "",
    thumbnail: post.covers?.[0] || post.videoMeta?.coverUrl || "",
    caption: post.text || "",
    views: post.playCount || 0,
    likes: post.diggCount || 0,
    comments: post.commentCount || 0,
    shares: post.shareCount || 0,
    date: post.createTime ? new Date(post.createTime * 1000).toISOString() : "",
    author: post.authorMeta?.name || "",
    platform: "tiktok" as Platform,
  }));

  return filterAndSort(refs);
}

async function runApifyActor(actorId: string, input: Record<string, unknown>): Promise<unknown[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MAX_TIMEOUT);

  try {
    const encodedActorId = actorId.replace("/", "~");
    const startRes = await fetch(
      `${APIFY_BASE}/acts/${encodedActorId}/runs?token=${APIFY_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: controller.signal,
      }
    );

    if (!startRes.ok) {
      const errorText = await startRes.text();
      throw new Error(`Apify start error: ${startRes.status} - ${errorText}`);
    }

    const runData = await startRes.json();
    const runId = runData.data?.id;
    if (!runId) throw new Error("Apify: no run ID returned");

    let status = runData.data?.status;
    let defaultDatasetId = runData.data?.defaultDatasetId;

    while (status !== "SUCCEEDED" && status !== "FAILED" && status !== "ABORTED" && status !== "TIMED-OUT") {
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));

      const pollRes = await fetch(
        `${APIFY_BASE}/actor-runs/${runId}?token=${APIFY_TOKEN}`,
        { signal: controller.signal }
      );

      if (!pollRes.ok) throw new Error(`Apify poll error: ${pollRes.status}`);

      const pollData = await pollRes.json();
      status = pollData.data?.status;
      defaultDatasetId = pollData.data?.defaultDatasetId || defaultDatasetId;
    }

    if (status !== "SUCCEEDED") {
      throw new Error(`Apify actor finished with status: ${status}`);
    }

    const datasetRes = await fetch(
      `${APIFY_BASE}/datasets/${defaultDatasetId}/items?token=${APIFY_TOKEN}`,
      { signal: controller.signal }
    );

    if (!datasetRes.ok) throw new Error(`Apify dataset error: ${datasetRes.status}`);

    return datasetRes.json();
  } finally {
    clearTimeout(timeout);
  }
}
