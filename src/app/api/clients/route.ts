import { NextRequest, NextResponse } from "next/server";
import {
  fetchClients,
  insertClient,
  updateClientById,
  deleteClientById,
  fetchCopyHistoryByClient,
  fetchBriefsByClient,
  fetchActivitiesByClient,
} from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (id) {
      const [allClients, copies, briefs, activities] = await Promise.all([
        fetchClients(),
        fetchCopyHistoryByClient(id),
        fetchBriefsByClient(id),
        fetchActivitiesByClient(id),
      ]);
      const client = allClients.find((c) => c.id === id) || null;
      return NextResponse.json({ client, copies, briefs, activities });
    }

    const clients = await fetchClients();
    return NextResponse.json(clients);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await insertClient(body);
    return NextResponse.json(client);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    await updateClientById(id, updates);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    await deleteClientById(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
