import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { SEED_OPERATIONS, SEED_NEXT_STEPS } from '@/lib/seeds';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const title = body.title || 'Workshop PIS — Cocreación con GTH';
    const projectId = body.project_id || 'PIS-001';

    // Create session
    const sessions = await sql`
      INSERT INTO workshop_sessions (project_id, title, facilitator_id)
      VALUES (${projectId}, ${title}, 'admin')
      RETURNING id
    `;
    const sessionId = sessions[0].id;

    // Insert seed operations as artifact
    await sql`
      INSERT INTO workshop_artifacts (session_id, artifact_type, payload)
      VALUES (
        ${sessionId},
        'operations',
        ${JSON.stringify({ items: SEED_OPERATIONS })}::jsonb
      )
    `;

    // Insert seed next steps as artifact
    await sql`
      INSERT INTO workshop_artifacts (session_id, artifact_type, payload)
      VALUES (
        ${sessionId},
        'next_steps',
        ${JSON.stringify({ items: SEED_NEXT_STEPS })}::jsonb
      )
    `;

    return NextResponse.json({ id: sessionId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creando sesión';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
