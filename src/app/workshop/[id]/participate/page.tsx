'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { STAGES, getStageById } from '@/lib/stages';

export default function ParticipatePage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [participantId, setParticipantId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [joined, setJoined] = useState(false);
  const [stageId, setStageId] = useState('cover');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // B1: write
  const [answers, setAnswers] = useState<string[]>(['', '', '']);

  // B2/B3: multi_add
  const [inputTitle, setInputTitle] = useState('');
  const [inputDetail, setInputDetail] = useState('');
  const [addCount, setAddCount] = useState(0);

  // B2B: actor selector
  const [selectedActor, setSelectedActor] = useState('Colaborador');
  const [customActor, setCustomActor] = useState('');

  const stage = getStageById(stageId);

  // Poll current stage
  useEffect(() => {
    if (!joined) return;
    const poll = async () => {
      try {
        const res = await fetch(`/api/workshop/${sessionId}/stage`);
        const data = await res.json();
        if (data.stage && data.stage !== stageId) {
          setStageId(data.stage);
          setSent(false);
          setAddCount(0);
        }
      } catch {}
    };
    poll();
    const i = setInterval(poll, 3000);
    return () => clearInterval(i);
  }, [sessionId, joined, stageId]);

  // Join
  const handleJoin = async () => {
    if (!displayName.trim()) return;
    try {
      const res = await fetch(`/api/workshop/${sessionId}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: displayName.trim(), role: 'participant' }),
      });
      const data = await res.json();
      if (res.ok && data.participant) {
        setParticipantId(data.participant.id);
      } else {
        setParticipantId(crypto.randomUUID());
      }
      setJoined(true);
    } catch {
      setParticipantId(crypto.randomUUID());
      setJoined(true);
    }
  };

  // Submit B1 answers — all 3 as a single payload
  const submitAnswers = async () => {
    setSending(true);
    try {
      const payload = {
        q1: { question: '¿Qué se imaginan cuando escuchan People Intelligence?', answer: answers[0] || '' },
        q2: { question: '¿Para qué les serviría un software así?', answer: answers[1] || '' },
        q3: { question: '¿Qué dolores del día a día debería resolver?', answer: answers[2] || '' },
      };
      await fetch(`/api/workshop/${sessionId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: participantId,
          block: 'b1_write',
          payload,
        }),
      });
      setSent(true);
    } catch {
      alert('Error enviando');
    } finally {
      setSending(false);
    }
  };

  // Submit multi-add item
  const submitItem = async () => {
    if (!inputTitle.trim()) return;
    setSending(true);
    try {
      let artifactType = '';
      if (stageId === 'b2a') artifactType = 'operations';
      else if (stageId === 'b2b') artifactType = 'questions';
      else if (stageId === 'b3') artifactType = 'data_fields';

      // Get existing artifacts
      const existing = await fetch(`/api/workshop/${sessionId}/artifacts/${artifactType}`).then(r => r.json());
      const items = existing.artifact?.payload?.items || [];
      const actor = stageId === 'b2b'
        ? (selectedActor === 'Otros' ? (customActor.trim() || 'Otros') : selectedActor)
        : 'Participante';
      items.push({
        title: inputTitle,
        detail: inputDetail,
        source: displayName,
        actor,
      });

      const res = await fetch(`/api/workshop/${sessionId}/artifacts/${artifactType}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: { items } }),
      });

      if (!res.ok) throw new Error('Error del servidor');

      setInputTitle('');
      setInputDetail('');
      setAddCount(prev => prev + 1);
    } catch {
      alert('Error enviando, intenta de nuevo');
    } finally {
      setSending(false);
    }
  };

  // Join screen
  if (!joined) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <img src="/logos/logo-blanco-centrum-pucp-v3.png" alt="CENTRUM PUCP" className="h-8 w-auto mx-auto mb-3" />
            <h1 className="text-orange font-extrabold text-xl tracking-widest">PIS</h1>
            <p className="text-gray-400 text-xs mt-1">People Intelligence System</p>
            <p className="text-white text-sm mt-3 font-semibold">Workshop de Co-Creación</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Tu nombre</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl text-sm mb-4"
              placeholder="Ej: María García"
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
            />
            <button
              onClick={handleJoin}
              className="w-full py-3 bg-orange text-white rounded-xl font-bold text-sm"
            >
              Unirme al Workshop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Mobile header */}
      <header className="bg-navy px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logos/logo-blanco-centrum-pucp-v3.png" alt="CENTRUM PUCP" className="h-4 w-auto opacity-90" />
          <span className="text-gray-400 text-[10px]">{displayName}</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: stage?.color || '#003865' }}>
          {stage?.label.replace(/[🎯👥📋❓🎉]/g, '').trim()}
        </span>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        {/* B1: Write */}
        {stageId === 'b1w' && !sent && (
          <div>
            <div className="bg-orange/10 border border-orange/20 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-700"><b className="text-orange">Escriban en silencio.</b> Todas las ideas son válidas. Pueden separar ideas con punto y coma.</p>
            </div>
            {[
              '¿Qué se imaginan cuando escuchan People Intelligence?',
              '¿Para qué les serviría un software así?',
              '¿Qué dolores del día a día debería resolver?',
            ].map((q, i) => (
              <div key={i} className="mb-4">
                <label className="block text-xs font-semibold text-navy mb-1">{q}</label>
                <textarea
                  value={answers[i]}
                  onChange={e => {
                    const a = [...answers];
                    a[i] = e.target.value;
                    setAnswers(a);
                  }}
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
                  rows={3}
                  placeholder="Escribe aquí..."
                />
              </div>
            ))}
            <button
              onClick={submitAnswers}
              disabled={sending || answers.every(a => !a.trim())}
              className="w-full py-3 bg-orange text-white rounded-xl font-bold text-sm disabled:bg-gray-300"
            >
              {sending ? 'Enviando...' : 'Enviar Respuestas'}
            </button>
          </div>
        )}

        {stageId === 'b1w' && sent && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-lg font-bold text-navy">Respuestas enviadas</h2>
            <p className="text-gray-500 text-xs mt-1">Gracias. Miren la pantalla.</p>
          </div>
        )}

        {/* B2A / B2B / B3: Multi-add */}
        {stage?.interaction === 'multi_add' && (
          <div>
            <div className="bg-navy/5 border border-navy/20 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-700">
                <b className="text-navy">Agreguen aportes</b> desde su celular. Envíen tantos como quieran.
              </p>
            </div>
            {addCount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3 flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-xs text-green-700">Has enviado {addCount} aporte{addCount > 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-3 shadow-sm">
              <p className="text-[10px] font-semibold text-gray-400 mb-2 tracking-wider">NUEVO APORTE</p>
              {stageId === 'b2b' && (
                <div className="mb-2">
                  <p className="text-[10px] font-semibold text-gray-400 mb-1">PREGUNTO COMO</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Colaborador', 'GTH', 'Dirección', 'Otros'].map(a => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setSelectedActor(a)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                          selectedActor === a
                            ? 'bg-navy text-white border-navy'
                            : 'bg-white text-gray-500 border-gray-300'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                  {selectedActor === 'Otros' && (
                    <input
                      value={customActor}
                      onChange={e => setCustomActor(e.target.value)}
                      className="mt-2 w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-navy/20"
                      placeholder="Escribe el rol o actor..."
                    />
                  )}
                </div>
              )}
              <input
                value={inputTitle}
                onChange={e => setInputTitle(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl text-sm mb-2 focus:ring-2 focus:ring-navy/20"
                placeholder={
                  stageId === 'b2a' ? 'Nombre de la operación...' :
                  stageId === 'b2b' ? 'La pregunta...' :
                  'Nombre del campo o dato...'
                }
              />
              <input
                value={inputDetail}
                onChange={e => setInputDetail(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl text-sm mb-3 focus:ring-2 focus:ring-navy/20"
                placeholder="Descripción o detalle (opcional)..."
              />
              <button
                onClick={submitItem}
                disabled={sending || !inputTitle.trim()}
                className="w-full py-2.5 bg-navy text-white rounded-xl font-bold text-sm disabled:bg-gray-300"
              >
                {sending ? 'Enviando...' : 'Enviar Aporte'}
              </button>
            </div>
          </div>
        )}

        {/* Organize: passive */}
        {stage?.interaction === 'organize' && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3 animate-pulse">📋</div>
            <h2 className="text-lg font-bold text-navy">El facilitador está organizando</h2>
            <p className="text-gray-500 text-xs mt-2">Miren la pantalla principal</p>
          </div>
        )}

        {/* Links */}
        {stageId === 'b4t' && (
          <div>
            <h3 className="font-bold text-navy text-base mb-3">Accesos directos</h3>
            {[
              { icon: '📋', name: 'Notion — Workspace PIS', desc: 'Gestión del proyecto, backlog, decisiones', url: '#' },
              { icon: '📁', name: 'Google Drive — Carpeta PIS', desc: 'Actas, entregables, documentos compartidos', url: '#' },
              { icon: '📊', name: 'Dashboard Prototipo', desc: 'Maqueta interactiva en Figma / Looker', url: '#' },
            ].map(l => (
              <a key={l.name} href={l.url} className="flex items-center gap-3 p-3 bg-white rounded-xl mb-2 border border-gray-200 shadow-sm">
                <span className="text-xl">{l.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy">{l.name}</p>
                  <p className="text-[10px] text-gray-400">{l.desc}</p>
                </div>
                <span className="text-gray-300 text-lg">→</span>
              </a>
            ))}
          </div>
        )}

        {/* Default: passive screen */}
        {stage?.interaction === 'none' && stageId !== 'b4t' && (
          <PassiveScreen stageId={stageId} stage={stage} />
        )}
      </main>
    </div>
  );
}

function PassiveScreen({ stageId, stage }: { stageId: string; stage: any }) {
  const content: Record<string, { emoji: string; title: string; sub: string }> = {
    cover: { emoji: '🎯', title: 'Bienvenido/a', sub: 'La sesión comenzará pronto. Mantén esta página abierta.' },
    team: { emoji: '👥', title: 'Equipo de hoy', sub: 'Smart Centrum + GTH trabajando juntos.' },
    agenda: { emoji: '📋', title: 'Agenda del workshop', sub: '4 bloques: Descubrir · Funcionalidades · Datos · Gestión' },
    b1x: { emoji: '🔍', title: 'Contexto', sub: 'El grupo explica por qué necesitamos People Intelligence.' },
    b1db: { emoji: '⚖️', title: 'Dos mundos', sub: 'Transaccional + Analítica. Ambos se necesitan.' },
    b1q: { emoji: '📝', title: 'Prepárense', sub: 'Responderán 3 preguntas en silencio. Todas las ideas valen.' },
    b1s: { emoji: '🗣️', title: 'Compartir', sub: 'Cada persona comparte lo que escribió.' },
    b1y: { emoji: '🤖', title: 'Síntesis IA', sub: 'Patrones identificados a partir de sus respuestas.' },
    b2w1: { emoji: '⚙️', title: 'Funcionalidades', sub: 'Traducimos dolores en funciones concretas.' },
    b2w2: { emoji: '📊', title: 'Dos capas', sub: 'Operaciones (día a día) + Preguntas (analítica).' },
    b2ax: { emoji: '🔧', title: 'Operaciones', sub: 'Oportunidad para agregar operaciones.' },
    b2a2: { emoji: '📋', title: 'Organizando', sub: 'El facilitador está priorizando.' },
    b2ay: { emoji: '🤖', title: 'Síntesis', sub: 'Análisis IA de las operaciones.' },
    b2bx1: { emoji: '❓', title: 'Preguntas analíticas', sub: 'Si el sistema ya existiera... ¿qué le preguntarían?' },
    b2bx2: { emoji: '👤', title: 'Actores', sub: 'Cada actor tiene preguntas distintas.' },
    b2b2: { emoji: '📋', title: 'Organizando', sub: 'El facilitador edita las preguntas.' },
    b2by: { emoji: '🤖', title: 'Síntesis', sub: 'Análisis IA de las preguntas.' },
    b3w1: { emoji: '🗃️', title: 'Datos', sub: 'Sin datos no hay operaciones.' },
    b3w2: { emoji: '📐', title: 'Dimensiones', sub: 'Qué dato · Dónde está · Qué tan importante' },
    b3fp: { emoji: '📋', title: 'Clasificando', sub: 'El facilitador asigna fuente y prioridad.' },
    b3y: { emoji: '🤖', title: 'Inventario', sub: 'Inventario completo con análisis IA.' },
    b4w1: { emoji: '🛤️', title: 'Gestión', sub: 'Gobernanza + ejecución ágil.' },
    b4w2: { emoji: '📍', title: 'Donde estamos', sub: 'Charter aprobado. Transitando a planificación.' },
    b4p: { emoji: '🗺️', title: 'Fases', sub: 'Fase 1: Dashboard + Piloto.' },
    b4n: { emoji: '✅', title: 'Próximos pasos', sub: 'Coordinación semanal.' },
    qa: { emoji: '❓', title: 'Preguntas', sub: 'Espacio para dudas.' },
    thx: { emoji: '🎉', title: '¡Gracias!', sub: 'Lo que construimos hoy es el cimiento del sistema.' },
  };

  const c = content[stageId] || { emoji: '📺', title: stage?.label || '', sub: 'Miren la pantalla.' };

  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">{c.emoji}</div>
      <h2 className="text-xl font-bold text-navy mb-2">{c.title}</h2>
      <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{c.sub}</p>
    </div>
  );
}
