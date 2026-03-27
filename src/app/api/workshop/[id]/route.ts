import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    if (body.title !== undefined) {
      const title = String(body.title).trim();
      if (title) {
        await sql`
          UPDATE workshop_sessions SET title = ${title} WHERE id = ${params.id}
        `;
      }
    }

    if (body.status !== undefined) {
      const status = String(body.status);
      await sql`
        UPDATE workshop_sessions SET status = ${status} WHERE id = ${params.id}
      `;
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
