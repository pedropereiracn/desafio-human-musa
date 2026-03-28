import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

type ModelTier = "fast" | "creative";

const MODELS: Record<ModelTier, string> = {
  fast: "claude-sonnet-4-6-20250610",
  creative: "claude-opus-4-6-20250610",
};

export async function askClaude(
  systemPrompt: string,
  userMessage: string,
  options?: { tier?: ModelTier; maxTokens?: number }
): Promise<string> {
  const tier = options?.tier ?? "creative";
  const maxTokens = options?.maxTokens ?? 4096;

  const response = await anthropic.messages.create({
    model: MODELS[tier],
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const block = response.content[0];
  if (block.type === "text") {
    return block.text;
  }
  throw new Error("Unexpected response type from Claude");
}

export function parseClaudeJSON<T>(raw: string): T {
  let cleaned = raw.trim();
  // Strip markdown code blocks if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  return JSON.parse(cleaned);
}
