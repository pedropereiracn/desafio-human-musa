import { Platform, Reference } from "./types";

const APIFY_TOKEN = process.env.APIFY_API_TOKEN!;

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
  const runResponse = await fetch(
    `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  );

  if (!runResponse.ok) {
    const errorText = await runResponse.text();
    throw new Error(`Apify error: ${runResponse.status} - ${errorText}`);
  }

  return runResponse.json();
}
