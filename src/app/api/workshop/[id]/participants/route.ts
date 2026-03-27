import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const participants = await sql`
      SELECT id, display_name, role FROM workshop_participants
      WHERE session_id = ${params.id}
      ORDER BY joined_at
    `;
    return NextResponse.json({ participants });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const displayName = String(body.display_name || '').trim();
    if (!displayName) {
      return NextResponse.json({ error: 'display_name requerido' }, { status: 400 });
    }
    const role = String(body.role || 'participant');
    const rows = await sql`
      INSERT INTO workshop_participants (session_id, display_name, role)
      VALUES (${params.id}, ${displayName}, ${role})
      RETURNING id, display_name, role
    `;
    return NextResponse.json({ participant: rows[0] }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
