import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Idempotent: add status column if it doesn't exist yet
    await sql`
      ALTER TABLE workshop_sessions
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
    `;

    const sessions = await sql`
      SELECT
        s.id,
        s.title,
        s.current_stage,
        s.created_at,
        COALESCE(s.status, 'active') AS status,
        COUNT(p.id)::int AS participant_count
      FROM workshop_sessions s
      LEFT JOIN workshop_participants p ON p.session_id = s.id
      GROUP BY s.id, s.title, s.current_stage, s.created_at, s.status
      ORDER BY s.created_at DESC
      LIMIT 50
    `;

    return NextResponse.json({ sessions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
