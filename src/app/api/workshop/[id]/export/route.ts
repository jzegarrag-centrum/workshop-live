import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateAIReport(context: string, reportType: string): Promise<string> {
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Eres un consultor senior de sistemas de gestión de talento humano. Genera un reporte ejecutivo en español basado en los datos de un workshop de co-creación del "People Intelligence System" de CENTRUM PUCP.

Tipo de reporte: ${reportType}
Datos del workshop:
${context}

Genera el reporte con secciones claras, hallazgos clave, y recomendaciones. Sé conciso pero completo. Usa formato de texto plano (sin markdown).`,
      }],
    });
    const block = msg.content[0];
    return block.type === 'text' ? block.text : 'Error generando reporte';
  } catch {
    return 'No se pudo generar el reporte con IA. Datos incluidos a continuación.';
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: sessionId } = await params;
  const { type } = await request.json();

  // Gather data
  const [responsesRes, participantsRes] = await Promise.all([
    sql`SELECT wr.*, wp.display_name FROM workshop_responses wr LEFT JOIN workshop_participants wp ON wr.participant_id = wp.id WHERE wr.session_id = ${sessionId}`,
    sql`SELECT * FROM workshop_participants WHERE session_id = ${sessionId} ORDER BY joined_at`,
  ]);

  const artifactTypes = ['operations', 'questions', 'data_fields', 'next_steps'];
  const artifacts: Record<string, any> = {};
  for (const at of artifactTypes) {
    const res = await sql`SELECT * FROM workshop_artifacts WHERE session_id = ${sessionId} AND artifact_type = ${at} ORDER BY version DESC LIMIT 1`;
    if (res.length > 0) artifacts[at] = res[0].payload;
  }

  // Build PDF content (using dynamic import for jsPDF)
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const navy = [0, 56, 101];
  const orange = [255, 107, 0];
  const pageW = 210;
  let y = 20;

  const addHeader = (title: string) => {
    doc.setFillColor(navy[0], navy[1], navy[2]);
    doc.rect(0, 0, pageW, 35, 'F');
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.rect(0, 35, pageW, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('CENTRUM PUCP | People Intelligence System', 15, 12);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 15, 26);
    doc.setTextColor(0, 0, 0);
    y = 48;
  };

  const addSection = (title: string, content: string) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(title, 15, y);
    y += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(content, pageW - 30);
    for (const line of lines) {
      if (y > 280) { doc.addPage(); y = 20; }
      doc.text(line, 15, y);
      y += 4.5;
    }
    y += 5;
  };

  const addFooter = () => {
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(`People Intelligence System — Workshop de Co-Creación — ${new Date().toLocaleDateString('es-PE')}`, 15, 290);
      doc.text(`Página ${i} de ${pages}`, pageW - 35, 290);
    }
  };

  if (type === 'acta') {
    addHeader('Acta del Workshop');

    const responsesByQ: Record<string, string[]> = {};
    for (const r of responsesRes) {
      const payload = typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload;
      if (!payload) continue;
      for (const qKey of ['q1', 'q2', 'q3']) {
        const q = payload[qKey];
        if (q?.answer) {
          const label = q.question || qKey;
          if (!responsesByQ[label]) responsesByQ[label] = [];
          responsesByQ[label].push(`${r.display_name || 'Anon'}: ${q.answer}`);
        }
      }
    }

    const contextData = `
Participantes: ${participantsRes.map((p: any) => p.display_name).join(', ')}
Fecha: ${new Date().toLocaleDateString('es-PE')}

Respuestas del Bloque 1 (Descubrimiento):
${Object.entries(responsesByQ).map(([k, v]) => `${k}:\n${v.join('\n')}`).join('\n\n')}

Operaciones definidas:
${artifacts.operations?.items?.map((i: any, idx: number) => `${idx + 1}. ${i.title}: ${i.detail || ''}`).join('\n') || 'No definidas'}

Preguntas analíticas:
${artifacts.questions?.items?.map((i: any, idx: number) => `${idx + 1}. ${i.title} (${i.actor || ''})`).join('\n') || 'No definidas'}

Campos de datos:
${artifacts.data_fields?.items?.map((i: any, idx: number) => `${idx + 1}. ${i.title} — Fuente: ${i.source || 'TBD'}, Prioridad: ${i.priority || 'TBD'}`).join('\n') || 'No definidos'}

Próximos pasos:
${artifacts.next_steps?.items?.map((i: any, idx: number) => `${idx + 1}. ${i.title}: ${i.detail || ''}`).join('\n') || 'No definidos'}`;

    const aiReport = await generateAIReport(contextData, 'Acta completa del workshop');

    addSection('Información General', `Fecha: ${new Date().toLocaleDateString('es-PE')}\nParticipantes: ${participantsRes.length}\nDuración estimada: 90 minutos`);
    addSection('Reporte Generado por IA', aiReport);
    addSection('Participantes', participantsRes.map((p: any) => `• ${p.display_name} (${p.role || 'Participante'})`).join('\n'));

  } else if (type === 'funcionalidades') {
    addHeader('Síntesis de Funcionalidades');

    const ops = artifacts.operations?.items || [];
    const qs = artifacts.questions?.items || [];
    const contextData = `
Operaciones del sistema (${ops.length}):
${ops.map((i: any, idx: number) => `${idx + 1}. ${i.title}: ${i.detail || ''} — Fuente: ${i.source || 'Workshop'}`).join('\n')}

Preguntas analíticas (${qs.length}):
${qs.map((i: any, idx: number) => `${idx + 1}. ${i.title} — Actor: ${i.actor || 'General'}`).join('\n')}`;

    const aiReport = await generateAIReport(contextData, 'Síntesis de funcionalidades del sistema');
    addSection('Reporte de Funcionalidades', aiReport);
    addSection('Operaciones Identificadas', ops.length > 0
      ? ops.map((i: any, idx: number) => `${idx + 1}. ${i.title}\n   ${i.detail || 'Sin detalle'}`).join('\n')
      : 'No se registraron operaciones.');
    addSection('Preguntas Analíticas', qs.length > 0
      ? qs.map((i: any, idx: number) => `${idx + 1}. [${i.actor || '?'}] ${i.title}`).join('\n')
      : 'No se registraron preguntas.');

  } else if (type === 'campos') {
    addHeader('Inventario de Campos de Datos');

    const fields = artifacts.data_fields?.items || [];
    const contextData = `
Campos de datos identificados (${fields.length}):
${fields.map((i: any, idx: number) => `${idx + 1}. ${i.title} — Fuente: ${i.source || 'TBD'}, Prioridad: ${i.priority || 'TBD'}, Detalle: ${i.detail || ''}`).join('\n')}`;

    const aiReport = await generateAIReport(contextData, 'Inventario de campos de datos');
    addSection('Análisis de Datos', aiReport);
    addSection('Inventario Completo', fields.length > 0
      ? fields.map((i: any, idx: number) => `${idx + 1}. ${i.title}\n   Fuente: ${i.source || 'TBD'} | Prioridad: ${i.priority || 'TBD'}\n   ${i.detail || ''}`).join('\n')
      : 'No se registraron campos.');

  } else if (type === 'pasos') {
    addHeader('Próximos Pasos');

    const steps = artifacts.next_steps?.items || [];
    const contextData = `
Próximos pasos definidos (${steps.length}):
${steps.map((i: any, idx: number) => `${idx + 1}. ${i.title}: ${i.detail || ''} — Responsable: ${i.owner || 'TBD'}, Fecha: ${i.date || 'TBD'}`).join('\n')}`;

    const aiReport = await generateAIReport(contextData, 'Plan de próximos pasos');
    addSection('Plan de Acción', aiReport);
    addSection('Lista de Acciones', steps.length > 0
      ? steps.map((i: any, idx: number) => `${idx + 1}. ${i.title}\n   ${i.detail || ''}\n   Responsable: ${i.owner || 'TBD'} | Fecha: ${i.date || 'TBD'}`).join('\n')
      : 'No se registraron próximos pasos.');
  }

  addFooter();

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

  // Save export record
  await sql`INSERT INTO workshop_exports (session_id, export_type, file_name)
    VALUES (${sessionId}, ${type}, ${`PIS_Workshop_${type}_${new Date().toISOString().slice(0, 10)}.pdf`})`.catch(() => {});

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="PIS_Workshop_${type}_${new Date().toISOString().slice(0, 10)}.pdf"`,
    },
  });
}
