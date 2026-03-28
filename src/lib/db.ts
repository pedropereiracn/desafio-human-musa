import { supabase } from "./supabase";
import type {
  ClientProfile,
  SavedBrief,
  CopyHistoryItem,
  ActivityItem,
  BriefResult,
  CopyResult,
  Platform,
  Format,
  CopyType,
  Tone,
} from "./types";

// ═══ Row types (snake_case from Supabase) ═══

interface ClientRow {
  id: string;
  name: string;
  segment: string;
  brand_voice: string;
  target_audience: string;
  platforms: string[];
  preferred_formats: string[];
  notes: string;
  color: string;
  created_at: string;
}

interface BriefRow {
  id: string;
  client_id: string | null;
  raw_briefing: string;
  decoded_result: Record<string, unknown>;
  created_at: string;
}

interface CopyHistoryRow {
  id: string;
  client_id: string | null;
  module: string;
  prompt: string;
  result: Record<string, unknown>;
  copy_type: string | null;
  tone: string | null;
  platform: string;
  created_at: string;
}

interface ActivityRow {
  id: string;
  type: string;
  title: string;
  client_id: string | null;
  module: string;
  created_at: string;
}

// ═══ CLIENTS ═══

function rowToClient(row: ClientRow): ClientProfile {
  return {
    id: row.id,
    name: row.name,
    segment: row.segment,
    brandVoice: row.brand_voice,
    targetAudience: row.target_audience,
    platforms: row.platforms as Platform[],
    preferredFormats: row.preferred_formats as Format[],
    notes: row.notes,
    color: row.color,
    createdAt: row.created_at,
  };
}

export async function fetchClients(): Promise<ClientProfile[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data || []) as ClientRow[]).map(rowToClient);
}

export async function insertClient(
  client: Omit<ClientProfile, "id" | "createdAt">
): Promise<ClientProfile> {
  const { data, error } = await supabase
    .from("clients")
    .insert({
      name: client.name,
      segment: client.segment,
      brand_voice: client.brandVoice,
      target_audience: client.targetAudience,
      platforms: client.platforms,
      preferred_formats: client.preferredFormats,
      notes: client.notes,
      color: client.color,
    })
    .select()
    .single();

  if (error) throw error;
  return rowToClient(data as ClientRow);
}

export async function updateClientById(
  id: string,
  updates: Partial<ClientProfile>
): Promise<void> {
  const mapped: Record<string, unknown> = {};
  if (updates.name !== undefined) mapped.name = updates.name;
  if (updates.segment !== undefined) mapped.segment = updates.segment;
  if (updates.brandVoice !== undefined) mapped.brand_voice = updates.brandVoice;
  if (updates.targetAudience !== undefined) mapped.target_audience = updates.targetAudience;
  if (updates.platforms !== undefined) mapped.platforms = updates.platforms;
  if (updates.preferredFormats !== undefined) mapped.preferred_formats = updates.preferredFormats;
  if (updates.notes !== undefined) mapped.notes = updates.notes;
  if (updates.color !== undefined) mapped.color = updates.color;

  const { error } = await supabase.from("clients").update(mapped).eq("id", id);
  if (error) throw error;
}

export async function deleteClientById(id: string): Promise<void> {
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw error;
}

// ═══ BRIEFS ═══

export async function fetchBriefs(): Promise<SavedBrief[]> {
  const { data, error } = await supabase
    .from("briefs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;

  return ((data || []) as BriefRow[]).map((row) => ({
    id: row.id,
    clientId: row.client_id || undefined,
    rawBriefing: row.raw_briefing,
    decodedResult: row.decoded_result as unknown as BriefResult,
    createdAt: row.created_at,
  }));
}

export async function insertBrief(brief: {
  clientId?: string;
  rawBriefing: string;
  decodedResult: BriefResult;
}): Promise<string> {
  const { data, error } = await supabase
    .from("briefs")
    .insert({
      client_id: brief.clientId || null,
      raw_briefing: brief.rawBriefing,
      decoded_result: brief.decodedResult as unknown as Record<string, unknown>,
    })
    .select("id")
    .single();

  if (error) throw error;
  return (data as { id: string }).id;
}

export async function deleteBriefById(id: string): Promise<void> {
  const { error } = await supabase.from("briefs").delete().eq("id", id);
  if (error) throw error;
}

// ═══ COPY HISTORY ═══

export async function fetchCopyHistory(): Promise<CopyHistoryItem[]> {
  const { data, error } = await supabase
    .from("copy_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;

  return ((data || []) as CopyHistoryRow[]).map((row) => ({
    id: row.id,
    clientId: row.client_id || undefined,
    module: row.module as "musa" | "copy-lab",
    prompt: row.prompt,
    result: row.result as unknown as CopyResult,
    copyType: (row.copy_type as CopyType) || undefined,
    tone: (row.tone as Tone) || undefined,
    platform: row.platform as Platform,
    createdAt: row.created_at,
  }));
}

export async function insertCopyHistory(item: {
  clientId?: string;
  module: "musa" | "copy-lab";
  prompt: string;
  result: CopyResult;
  copyType?: CopyType;
  tone?: Tone;
  platform: Platform;
}): Promise<string> {
  const { data, error } = await supabase
    .from("copy_history")
    .insert({
      client_id: item.clientId || null,
      module: item.module,
      prompt: item.prompt,
      result: item.result as unknown as Record<string, unknown>,
      copy_type: item.copyType || null,
      tone: item.tone || null,
      platform: item.platform,
    })
    .select("id")
    .single();

  if (error) throw error;
  return (data as { id: string }).id;
}

// ═══ ACTIVITIES ═══

export async function fetchActivities(): Promise<ActivityItem[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;

  return ((data || []) as ActivityRow[]).map((row) => ({
    id: row.id,
    type: row.type as ActivityItem["type"],
    title: row.title,
    clientId: row.client_id || undefined,
    module: row.module,
    createdAt: row.created_at,
  }));
}

export async function insertActivity(item: {
  type: ActivityItem["type"];
  title: string;
  clientId?: string;
  module: string;
}): Promise<void> {
  const { error } = await supabase.from("activities").insert({
    type: item.type,
    title: item.title,
    client_id: item.clientId || null,
    module: item.module,
  });
  if (error) throw error;
}

// ═══ FILTERED QUERIES (by client) ═══

export async function fetchCopyHistoryByClient(clientId: string): Promise<CopyHistoryItem[]> {
  const { data, error } = await supabase
    .from("copy_history")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;

  return ((data || []) as CopyHistoryRow[]).map((row) => ({
    id: row.id,
    clientId: row.client_id || undefined,
    module: row.module as "musa" | "copy-lab",
    prompt: row.prompt,
    result: row.result as unknown as CopyResult,
    copyType: (row.copy_type as CopyType) || undefined,
    tone: (row.tone as Tone) || undefined,
    platform: row.platform as Platform,
    createdAt: row.created_at,
  }));
}

export async function fetchBriefsByClient(clientId: string): Promise<SavedBrief[]> {
  const { data, error } = await supabase
    .from("briefs")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;

  return ((data || []) as BriefRow[]).map((row) => ({
    id: row.id,
    clientId: row.client_id || undefined,
    rawBriefing: row.raw_briefing,
    decodedResult: row.decoded_result as unknown as BriefResult,
    createdAt: row.created_at,
  }));
}

export async function fetchActivitiesByClient(clientId: string): Promise<ActivityItem[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;

  return ((data || []) as ActivityRow[]).map((row) => ({
    id: row.id,
    type: row.type as ActivityItem["type"],
    title: row.title,
    clientId: row.client_id || undefined,
    module: row.module,
    createdAt: row.created_at,
  }));
}

// ═══ CALENDAR ═══

export interface CalendarEntryRow {
  id: string;
  clientId: string | null;
  title: string;
  platform: string;
  format: string;
  scheduledDate: string;
  status: "rascunho" | "agendado" | "publicado";
  notes: string;
}

interface CalendarDbRow {
  id: string;
  client_id: string | null;
  title: string;
  platform: string;
  format: string;
  scheduled_date: string;
  status: string;
  notes: string;
}

export async function fetchCalendarEntries(
  year: number,
  month: number
): Promise<CalendarEntryRow[]> {
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("calendar_entries")
    .select("*")
    .gte("scheduled_date", startDate)
    .lte("scheduled_date", endDate)
    .order("scheduled_date");

  if (error) throw error;

  return ((data || []) as CalendarDbRow[]).map((row) => ({
    id: row.id,
    clientId: row.client_id,
    title: row.title,
    platform: row.platform,
    format: row.format,
    scheduledDate: row.scheduled_date,
    status: row.status as "rascunho" | "agendado" | "publicado",
    notes: row.notes,
  }));
}

export async function insertCalendarEntry(entry: {
  clientId?: string;
  title: string;
  platform: string;
  format?: string;
  scheduledDate: string;
  status?: string;
}): Promise<string> {
  const { data, error } = await supabase
    .from("calendar_entries")
    .insert({
      client_id: entry.clientId || null,
      title: entry.title,
      platform: entry.platform,
      format: entry.format || "reels",
      scheduled_date: entry.scheduledDate,
      status: entry.status || "rascunho",
    })
    .select("id")
    .single();

  if (error) throw error;
  return (data as { id: string }).id;
}

export async function updateCalendarEntry(
  id: string,
  updates: Partial<{ title: string; status: string; scheduledDate: string }>
): Promise<void> {
  const mapped: Record<string, unknown> = {};
  if (updates.title !== undefined) mapped.title = updates.title;
  if (updates.status !== undefined) mapped.status = updates.status;
  if (updates.scheduledDate !== undefined) mapped.scheduled_date = updates.scheduledDate;

  const { error } = await supabase.from("calendar_entries").update(mapped).eq("id", id);
  if (error) throw error;
}

export async function deleteCalendarEntry(id: string): Promise<void> {
  const { error } = await supabase.from("calendar_entries").delete().eq("id", id);
  if (error) throw error;
}
