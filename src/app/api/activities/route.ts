import { NextRequest, NextResponse } from "next/server";
import { fetchActivities, insertActivity } from "@/lib/db";

export async function GET() {
  try {
    const activities = await fetchActivities();
    return NextResponse.json(activities);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await insertActivity(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
