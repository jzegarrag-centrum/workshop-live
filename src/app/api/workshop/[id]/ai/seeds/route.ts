import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { block } = await request.json();

    // Gather context from previous blocks
    const responses = await sql`
      SELECT r.*, p.display_name FROM workshop_responses r
      JOIN workshop_participants p ON p.id = r.participant_id
      WHERE r.session_id = ${id}
      ORDER BY r.block
    `;

    const artifacts = await sql`
      SELECT * FROM workshop_artifacts
      WHERE session_id = ${id}
      ORDER BY artifact_type, version DESC
    `;

    // Build context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const b1Responses = (responses as any[]).filter((r) => r.block === 'b1_write');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const operations = (artifacts as any[]).find((a) => a.artifact_type === 'operations');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const questions = (artifacts as any[]).find((a) => a.artifact_type === 'questions');

    let prompt = '';
    let artifactType = '';

    if (block === 'b2b') {
      const b1Patterns = b1Responses.map((r: { display_name: string; payload: { q1?: { answer?: string }; q2?: { answer?: string }; q3?: { answer?: string } } }) =>
        `${r.display_name}: ${r.payload.q1?.answer}, ${r.payload.q2?.answer}, ${r.payload.q3?.answer}`
      ).join('\n');
      const opsList = operations?.payload?.items?.map(
        (o: { operation: string; description: string }) => `- ${o.operation}: ${o.description}`
      ).join('\n') || 'No hay operaciones definidas aún';

      prompt = `Dado el siguiente contexto de un taller de cocreación para el sistema People Intelligence de CENTRUM PUCP:

Patrones identificados en B1:
${b1Patterns}

Operaciones definidas en B2A:
${opsList}

Genera 4-5 preguntas analíticas que el sistema debería poder responder, distribuidas entre los actores: Colaborador, GTH, y Dirección. Las preguntas deben ser respondibles si las operaciones definidas se implementan.

Responde SOLO en JSON: { "seeds": [{ "actor": "GTH|Colaborador|Dirección", "title": "la pregunta completa" }] }`;
      artifactType = 'questions';
    } else if (block === 'b3') {
      const opsList = operations?.payload?.items?.map(
        (o: { title: string; detail: string }) => `- ${o.title}: ${o.detail}`
      ).join('\n') || '';
      const qList = questions?.payload?.items?.map(
        (q: { actor: string; title: string }) => `- [${q.actor}] ${q.title}`
      ).join('\n') || '';

      prompt = `Dado el siguiente contexto:

Operaciones:
${opsList}

Preguntas:
${qList}

Para que el sistema pueda ejecutar estas operaciones y responder estas preguntas, ¿qué campos de datos necesita? Genera 7-10 campos con nombre y descripción breve. NO incluyas fuente ni prioridad.

Responde SOLO en JSON: { "seeds": [{ "title": "nombre del campo", "detail": "descripción breve" }] }`;
      artifactType = 'data_fields';
    } else {
      return NextResponse.json({ error: 'Bloque no soportado para seeds' }, { status: 400 });
    }

    // Call Claude API
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key no configurada', seeds: [] }, { status: 200 });
    }

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!claudeRes.ok) {
      console.error('Claude API error:', await claudeRes.text());
      return NextResponse.json({ error: 'Error de IA, continúe sin semillas', seeds: [] });
    }

    const claudeData = await claudeRes.json();
    const text = claudeData.content?.[0]?.text || '{}';

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const seeds = jsonMatch ? JSON.parse(jsonMatch[0]).seeds || [] : [];

    // Store seeds as artifact
    if (seeds.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existingItems = (block === 'b2b' ? questions : (artifacts as any[]).find((a) => a.artifact_type === artifactType))?.payload?.items || [];
      const mergedItems = [...existingItems, ...seeds.map((s: Record<string, string>) => ({ ...s, origin: 'ai' }))];

      await sql`
        INSERT INTO workshop_artifacts (session_id, artifact_type, payload, version)
        VALUES (${id}, ${artifactType}, ${JSON.stringify({ items: mergedItems })}::jsonb, 1)
      `;
    }

    return NextResponse.json({ seeds });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error generando semillas';
    console.error('Seeds error:', error);
    return NextResponse.json({ error: message, seeds: [] });
  }
}
