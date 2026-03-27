import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET responses for a session, optionally filtered by block
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const block = request.nextUrl.searchParams.get('block');
    let rows;
    if (block) {
      rows = await sql`
        SELECT r.*, p.display_name
        FROM workshop_responses r
        JOIN workshop_participants p ON p.id = r.participant_id
        WHERE r.session_id = ${params.id} AND r.block = ${block}
        ORDER BY r.updated_at DESC
      `;
    } else {
      rows = await sql`
        SELECT r.*, p.display_name
        FROM workshop_responses r
        JOIN workshop_participants p ON p.id = r.participant_id
        WHERE r.session_id = ${params.id}
        ORDER BY r.block, r.updated_at DESC
      `;
    }
    return NextResponse.json({ responses: rows });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST — upsert a response (participant writes)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { participant_id, block, payload } = await request.json();
    if (!participant_id || !block || !payload) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    await sql`
      INSERT INTO workshop_responses (session_id, participant_id, block, payload)
      VALUES (${params.id}, ${participant_id}, ${block}, ${JSON.stringify(payload)}::jsonb)
      ON CONFLICT (session_id, participant_id, block)
      DO UPDATE SET payload = ${JSON.stringify(payload)}::jsonb, updated_at = NOW()
    `;

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
