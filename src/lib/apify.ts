import { Platform, Reference } from "./types";

const APIFY_TOKEN = process.env.APIFY_API_TOKEN!;
const APIFY_BASE = "https://api.apify.com/v2";
const POLL_INTERVAL = 2000;
const MAX_TIMEOUT = 55000;

interface ApifyInstagramPost {
  url?: string;
  displayUrl?: string;
  caption?: string;
  likesCount?: number;
  commentsCount?: number;
  timestamp?: string;
  ownerUsername?: string;
  videoUrl?: string;
  imageUrl?: string;
}

interface ApifyTikTokPost {
  webVideoUrl?: string;
  covers?: string[];
  text?: string;
  diggCount?: number;
  commentCount?: number;
  shareCount?: number;
  createTime?: number;
  authorMeta?: { name?: string };
}

export async function searchInstagram(topic: string, limit = 20): Promise<Reference[]> {
  const input = {
    search: topic,
    resultsType: "posts",
    resultsLimit: limit,
    searchType: "hashtag",
  };

  const results = await runApifyActor("apify/instagram-scraper", input);

  return (results as ApifyInstagramPost[]).map((post, i) => ({
    id: `ig-${i}`,
    url: post.url || "",
    thumbnail: post.displayUrl || post.imageUrl || "",
    caption: post.caption || "",
    likes: post.likesCount || 0,
    comments: post.commentsCount || 0,
    shares: 0,
    date: post.timestamp || "",
    author: post.ownerUsername || "",
    platform: "instagram" as Platform,
  }));
}

export async function searchTikTok(topic: string, limit = 20): Promise<Reference[]> {
  const input = {
    searchQueries: [topic],
    resultsPerPage: limit,
    shouldDownloadVideos: false,
  };

  const results = await runApifyActor("clockworks/tiktok-scraper", input);

  return (results as ApifyTikTokPost[]).map((post, i) => ({
    id: `tt-${i}`,
    url: post.webVideoUrl || "",
    thumbnail: post.covers?.[0] || "",
    caption: post.text || "",
    likes: post.diggCount || 0,
    comments: post.commentCount || 0,
    shares: post.shareCount || 0,
    date: post.createTime ? new Date(post.createTime * 1000).toISOString() : "",
    author: post.authorMeta?.name || "",
    platform: "tiktok" as Platform,
  }));
}

async function runApifyActor(actorId: string, input: Record<string, unknown>): Promise<unknown[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MAX_TIMEOUT);

  try {
    // Step 1: Start the actor run (async)
    const startRes = await fetch(
      `${APIFY_BASE}/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
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

    // Step 2: Poll until SUCCEEDED or FAILED
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

    // Step 3: Fetch dataset items
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
