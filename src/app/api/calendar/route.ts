import { NextRequest, NextResponse } from "next/server";
import {
  fetchCalendarEntries,
  insertCalendarEntry,
  updateCalendarEntry,
  deleteCalendarEntry,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || "");
    const month = parseInt(searchParams.get("month") || "");

    if (isNaN(year) || isNaN(month)) {
      return NextResponse.json({ error: "year e month são obrigatórios" }, { status: 400 });
    }

    const entries = await fetchCalendarEntries(year, month);
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Calendar GET error:", error);
    return NextResponse.json({ error: "Erro ao buscar entradas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = await insertCalendarEntry(body);
    return NextResponse.json({ id });
  } catch (error) {
    console.error("Calendar POST error:", error);
    return NextResponse.json({ error: "Erro ao criar entrada" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id é obrigatório" }, { status: 400 });
    }
    await updateCalendarEntry(id, updates);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Calendar PUT error:", error);
    return NextResponse.json({ error: "Erro ao atualizar entrada" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id é obrigatório" }, { status: 400 });
    }
    await deleteCalendarEntry(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Calendar DELETE error:", error);
    return NextResponse.json({ error: "Erro ao deletar entrada" }, { status: 500 });
  }
}
