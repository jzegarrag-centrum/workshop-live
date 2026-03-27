import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { block } = await request.json();

    // Gather all data for this session
    const responses = await sql`
      SELECT r.*, p.display_name FROM workshop_responses r
      JOIN workshop_participants p ON p.id = r.participant_id
      WHERE r.session_id = ${id}
      ORDER BY r.block
    `;

    const artifacts = await sql`
      SELECT DISTINCT ON (artifact_type) * FROM workshop_artifacts
      WHERE session_id = ${id}
      ORDER BY artifact_type, version DESC
    `;

    // Build block-specific context
    let datos = '';
    let blockLabel = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyResponses = responses as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyArtifacts = artifacts as any[];

    if (block === 'b1') {
      blockLabel = 'Bloque 1 — Descubrir';
      const b1 = anyResponses.filter((r) => r.block === 'b1_write');
      datos = b1.map((r) =>
        `${r.display_name}:\n  1. ${r.payload.q1?.question}: ${r.payload.q1?.answer}\n  2. ${r.payload.q2?.question}: ${r.payload.q2?.answer}\n  3. ${r.payload.q3?.question}: ${r.payload.q3?.answer}`
      ).join('\n\n');
    } else if (block === 'b2a') {
      blockLabel = 'Bloque 2A — Operaciones';
      const ops = anyArtifacts.find((a) => a.artifact_type === 'operations');
      datos = ops?.payload?.items?.map(
        (o: { title: string; detail: string; process?: string; origin?: string }) =>
          `- ${o.title}${o.process ? ` (${o.process})` : ''}: ${o.detail} [${o.origin || 'gth'}]`
      ).join('\n') || 'Sin datos';
    } else if (block === 'b2b') {
      blockLabel = 'Bloque 2B — Preguntas';
      const qs = anyArtifacts.find((a) => a.artifact_type === 'questions');
      datos = qs?.payload?.items?.map(
        (q: { actor: string; title: string; origin?: string }) =>
          `- [${q.actor}] ${q.title} [${q.origin || 'gth'}]`
      ).join('\n') || 'Sin datos';
    } else if (block === 'b3') {
      blockLabel = 'Bloque 3 — Datos';
      const fields = anyArtifacts.find((a) => a.artifact_type === 'data_fields');
      datos = fields?.payload?.items?.map(
        (f: { title: string; detail: string; source?: string; priority?: string }) =>
          `- ${f.title}: ${f.detail} [fuente: ${f.source || '?'}, prioridad: ${f.priority || '?'}]`
      ).join('\n') || 'Sin datos';
    } else {
      return NextResponse.json({ error: 'Bloque no soportado' }, { status: 400 });
    }

    const prompt = `Eres un analista de proyectos de Smart Centrum. Analiza los resultados del ${blockLabel} del taller de cocreación para People Intelligence System.

Contexto del proyecto: CENTRUM PUCP no puede consultar las capacidades reales de sus colaboradores. Se está construyendo un sistema basado en la Global Skills Taxonomy del WEF con arquitectura OLTP/OLAP separada.

Datos capturados:
${datos}

Genera un análisis de 3-4 oraciones que identifique: patrones principales, hallazgos relevantes, coherencia con bloques anteriores, y una recomendación concreta. Sé específico, menciona nombres de participantes cuando sea relevante. No uses emojis. Tono profesional pero accesible.

Responde SOLO con el texto del análisis, sin formato JSON.`;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ synthesis: 'Síntesis no disponible — API key no configurada' });
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
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!claudeRes.ok) {
      console.error('Claude synth error:', await claudeRes.text());
      return NextResponse.json({ synthesis: 'Error generando síntesis. Puede continuar sin IA.' });
    }

    const claudeData = await claudeRes.json();
    const synthesis = claudeData.content?.[0]?.text || 'Sin análisis generado';

    // Store synthesis artifact
    const synthType = `${block}_synthesis`;
    await sql`
      INSERT INTO workshop_artifacts (session_id, artifact_type, payload, version)
      VALUES (${id}, ${synthType}, ${JSON.stringify({ text: synthesis })}::jsonb, 1)
    `;

    return NextResponse.json({ synthesis });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error';
    console.error('Synth error:', error);
    return NextResponse.json({ synthesis: 'Error generando síntesis: ' + message });
  }
}
