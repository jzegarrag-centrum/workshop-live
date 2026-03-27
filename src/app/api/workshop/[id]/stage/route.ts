import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await sql`
      SELECT current_stage FROM workshop_sessions WHERE id = ${id}
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ stage: rows[0].current_stage });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { stage } = await request.json();
    await sql`
      UPDATE workshop_sessions SET current_stage = ${stage} WHERE id = ${id}
    `;
    return NextResponse.json({ ok: true, stage });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
