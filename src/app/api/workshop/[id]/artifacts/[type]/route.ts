import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string; type: string } }
) {
  try {
    const rows = await sql`
      SELECT * FROM workshop_artifacts
      WHERE session_id = ${params.id} AND artifact_type = ${params.type}
      ORDER BY version DESC LIMIT 1
    `;
    if (rows.length === 0) {
      return NextResponse.json({ artifact: null });
    }
    return NextResponse.json({ artifact: rows[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; type: string } }
) {
  try {
    const { payload } = await request.json();

    // Get current version
    const current = await sql`
      SELECT version FROM workshop_artifacts
      WHERE session_id = ${params.id} AND artifact_type = ${params.type}
      ORDER BY version DESC LIMIT 1
    `;
    const nextVersion = current.length > 0 ? current[0].version + 1 : 1;

    await sql`
      INSERT INTO workshop_artifacts (session_id, artifact_type, payload, version)
      VALUES (${params.id}, ${params.type}, ${JSON.stringify(payload)}::jsonb, ${nextVersion})
    `;

    return NextResponse.json({ ok: true, version: nextVersion });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
