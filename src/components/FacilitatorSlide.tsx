'use client';
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

/* ── helpers ── */
const Footer = () => (
  <div className="absolute bottom-0 left-0 right-0 bg-navy px-4 py-1.5 flex items-center justify-between text-[7px] text-gray-400">
    <div className="flex items-center gap-2">
      <img src="/logos/logo-blanco-centrum-pucp-v3.png" alt="CENTRUM PUCP" className="h-[14px] w-auto opacity-80" />
      <span>People Intelligence System • Smart Centrum × GTH</span>
    </div>
    <span>27 de marzo de 2026</span>
  </div>
);

const Pill = ({ text, bg }: { text: string; bg: string }) => (
  <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: bg }}>{text}</span>
);

const SectionTitle = ({ eyebrow, title, accent = 'bg-orange' }: { eyebrow?: string; title: string; accent?: string }) => (
  <div>
    {eyebrow ? <span className="text-orange font-bold tracking-[2px] text-[10px] mb-1 block">{eyebrow}</span> : null}
    <h2 className="text-xl font-extrabold text-navy mb-1">{title}</h2>
    <div className={`w-16 h-0.5 ${accent} mb-3`} />
  </div>
);

const Badge = ({ text, variant }: { text: string; variant: string }) => {
  const map: Record<string, string> = {
    critical: 'bg-red-100 text-red-700',
    high: 'bg-amber-100 text-amber-700',
    medium: 'bg-yellow-100 text-yellow-700',
    future: 'bg-gray-100 text-gray-600',
    gth: 'bg-green-100 text-green-700',
    pucp: 'bg-amber-100 text-amber-700',
    new: 'bg-red-100 text-red-700',
    colaborador: 'bg-blue-100 text-blue-700',
    'gth-actor': 'bg-green-100 text-green-700',
    direccion: 'bg-purple-100 text-purple-700',
    otros: 'bg-gray-100 text-gray-600',
  };
  return <span className={`inline-block px-2 py-0.5 rounded-full text-[7px] font-semibold ${map[variant] || 'bg-gray-100 text-gray-600'}`}>{text}</span>;
};

/* ── types ── */
interface SlideProps {
  stageId: string;
  sessionId?: string;
  responses?: any[];
  artifacts?: any;
  synthesis?: string | null;
  participants?: any[];
  onTriggerSynthesis?: () => void;
  synthLoading?: boolean;
  onTriggerSeeds?: () => void;
  seedsLoading?: boolean;
}

/* ── SLIDE CONTENT ── */
export default function FacilitatorSlide({ stageId, sessionId, responses = [], artifacts, synthesis, participants = [], onTriggerSynthesis, synthLoading, onTriggerSeeds, seedsLoading }: SlideProps) {
  const participantUrl = typeof window !== 'undefined' && sessionId
    ? `${window.location.origin}/workshop/${sessionId}/participate`
    : sessionId ? `/workshop/${sessionId}/participate` : '';
  switch (stageId) {
    /* ─── COVER ─── */
    case 'cover':
      return (
        <div className="slide-dark flex flex-col items-center justify-center text-center p-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange" />
          {/* Decorative orange circle */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'rgba(255,107,0,0.08)' }} />
          <div className="max-w-[460px]">
            <img src="/logos/logo-blanco-centrum-pucp-v3.png" alt="CENTRUM PUCP" className="h-8 w-auto mb-4 opacity-90 mx-auto" />
            <h2 className="text-3xl font-extrabold text-white mb-1 leading-tight">People Intelligence System</h2>
            <p className="text-gray-300 text-sm">Taller de Co-Creación con GTH</p>
            <div className="w-16 h-0.5 bg-orange my-4 mx-auto" />
            <p className="text-gray-300 text-xs">27 de marzo de 2026</p>
          </div>
          {participantUrl && (
            <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2">
              <div className="bg-white p-2.5 rounded-xl shadow-lg border border-white/10">
                <QRCodeSVG value={participantUrl} size={124} fgColor="#003865" />
              </div>
              <p className="text-gray-400 text-[9px] font-semibold">📱 Escanea para unirte</p>
            </div>
          )}
        </div>
      );

    /* ─── QR ─── */
    case 'qr':
      return (
        <div className="slide-dark flex flex-col items-center justify-center text-center px-8 py-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange" />
          <img src="/logos/logo-blanco-centrum-pucp-v3.png" alt="CENTRUM PUCP" className="absolute top-4 left-6 h-5 w-auto opacity-80" />
          <p className="text-orange font-bold tracking-[3px] text-[10px] mb-3">PEOPLE INTELLIGENCE SYSTEM</p>
          <h2 className="text-2xl font-extrabold text-white mb-3">Únete al workshop</h2>
          {participantUrl && (
            <>
              <div className="bg-white p-3 rounded-2xl shadow-2xl">
                <QRCodeSVG value={participantUrl} size={200} fgColor="#003865" />
              </div>
              <p className="text-gray-300 text-sm font-semibold mt-3">📱 Escanea el código para participar</p>
              <p className="text-gray-500 text-[9px] mt-1 max-w-[360px] break-all leading-snug">{participantUrl}</p>
            </>
          )}
        </div>
      );

    /* ─── TEAM ─── */
    case 'team':
      return (
        <div className="slide flex flex-col justify-center p-6">
          <span className="text-orange font-bold tracking-[2px] text-[10px] mb-1">PARTICIPANTES</span>
          <h2 className="text-xl font-extrabold text-navy mb-1">Quiénes participan hoy</h2>
          <div className="w-16 h-0.5 bg-orange mb-3" />
          {participants.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-sm">Esperando participantes…</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5 overflow-y-auto flex-1 min-h-0 content-start">
              {participants.map((p, i) => (
                <div key={p.id || i} className="bg-white rounded-lg p-2 shadow-sm border-l-[3px] border-orange flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {(p.display_name || p.name || '?')[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-gray-700 truncate">{p.display_name || p.name}</p>
                    <p className="text-[8px] text-gray-400">{p.role || 'Participante'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 text-center">
            <span className="text-[10px] text-gray-400 font-medium">{participants.length} participante{participants.length !== 1 ? 's' : ''} registrado{participants.length !== 1 ? 's' : ''}</span>
          </div>
          <Footer />
        </div>
      );

    /* ─── AGENDA ─── */
    case 'agenda':
      return (
        <div className="slide flex flex-col justify-center p-6">
          <SectionTitle eyebrow="RECORRIDO" title="Agenda del taller" />
          <div className="grid grid-cols-4 gap-2">
            {[
              { n: '1', t: 'Descubrir', d: 'Visión compartida y expectativas', m: '30 min', c: 'bg-navy' },
              { n: '2', t: 'Funcionalidades', d: 'Operaciones + preguntas clave', m: '40 min', c: 'bg-orange' },
              { n: '3', t: 'Datos', d: 'Campos, fuentes y prioridades', m: '25 min', c: 'bg-teal' },
              { n: '4', t: 'Gestión', d: 'Gobernanza y próximos pasos', m: '20 min', c: 'bg-green' },
            ].map(b => (
              <div key={b.n} className="bg-white rounded-lg p-3 shadow-sm text-center">
                <div className={`w-7 h-7 rounded-full ${b.c} text-white flex items-center justify-center mx-auto mb-2 text-sm font-bold`}>{b.n}</div>
                <h5 className="font-bold text-sm text-gray-700">{b.t}</h5>
                <p className="text-[8px] text-gray-400 mt-1">{b.d}</p>
                <p className="text-[8px] font-semibold text-gray-500 mt-1">{b.m}</p>
              </div>
            ))}
          </div>
          <Footer />
        </div>
      );

    /* ─── B1 CONTEXTO ─── */
    case 'b1x':
      return (
        <div className="slide flex flex-col justify-start p-6">
          <Pill text="Bloque 1 · Descubrir" bg="#FF6B00" />
          <h2 className="text-xl font-extrabold text-navy my-2">¿Por qué People Intelligence?</h2>
          <div className="w-16 h-0.5 bg-orange mb-3" />
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm border-t-[3px] border-red-500">
              <h4 className="text-red-600 font-bold text-xs mb-1">El problema</h4>
              <p className="text-[9px] text-gray-600">
                La información de talento está <b>fragmentada en múltiples sistemas</b>. No hay visibilidad analítica sobre skills, certificaciones y trayectorias reales del staff.
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border-t-[3px] border-green-500">
              <h4 className="text-green-600 font-bold text-xs mb-1">La oportunidad</h4>
              <p className="text-[9px] text-gray-600">
                Un sistema de People Intelligence permite <b>decisiones basadas en datos</b>, asignación inteligente y desarrollo estratégico del talento académico.
              </p>
            </div>
          </div>
          <div className="mt-3 bg-navy rounded-lg p-2 text-center">
            <p className="text-orange text-[9px] font-bold">DOS IMPACTOS ESTRATÉGICOS</p>
            <p className="text-white text-[10px]">Visibilidad de talento + Capacidad de decisión</p>
          </div>
          <Footer />
        </div>
      );

    /* ─── B1 OLTP/OLAP ─── */
    case 'b1db':
      return (
        <div className="slide flex flex-col justify-center p-6">
          <Pill text="Bloque 1 · Descubrir" bg="#FF6B00" />
          <h2 className="text-xl font-extrabold text-navy my-2">Transaccional vs. Analítica</h2>
          <p className="text-[10px] text-gray-500 mb-3">Hay dos mundos de datos. No los vamos a mezclar — los vamos a <b className="text-navy">conectar</b>.</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm border-t-[3px] border-orange">
              <h4 className="text-orange font-bold text-xs mb-1">OLTP — Transaccional</h4>
              <p className="text-[9px] text-gray-600">Los sistemas del día a día: registrar un grado, actualizar un CV, asignar un curso. Cada acción individual.</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border-t-[3px] border-teal">
              <h4 className="text-teal font-bold text-xs mb-1">OLAP — Analítica</h4>
              <p className="text-[9px] text-gray-600">La capa inteligente: ¿cuántos docentes tienen PhD? ¿Qué skills faltan? Análisis, patrones, dashboards.</p>
            </div>
          </div>
          <Footer />
        </div>
      );

    /* ─── B1 PREGUNTA ─── */
    case 'b1q':
      return (
        <div className="slide-dark flex flex-col items-center justify-center text-center p-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange" />
          <Pill text="Bloque 1 · Descubrir" bg="#FF6B00" />
          <h2 className="text-2xl font-extrabold text-white mt-4 mb-2">Cuando escuchan<br /><span className="text-orange">People Intelligence</span>...</h2>
          <p className="text-gray-400 text-sm">¿qué se imaginan?</p>
          <div className="w-16 h-0.5 bg-orange my-4" />
          {participantUrl ? (
            <div className="flex items-center gap-6 mt-2">
              <div className="bg-white p-3 rounded-xl shadow-lg">
                <QRCodeSVG value={participantUrl} size={150} fgColor="#003865" />
              </div>
              <div className="text-left">
                <p className="text-gray-300 text-sm font-semibold mb-1">📱 Escanea el QR para participar</p>
                <p className="text-gray-500 text-[10px] max-w-[240px] break-all">{participantUrl}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-[10px]">Abran el link en su celular para participar</p>
          )}
        </div>
      );

    /* ─── B1 ESCRIBIR (interactive) ─── */
    case 'b1w':
      return (
        <div className="slide flex flex-col justify-start p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Pill text="Bloque 1 · Descubrir" bg="#FF6B00" />
              <h2 className="text-lg font-extrabold text-navy mt-1">Respuestas en tiempo real</h2>
            </div>
            <span className="text-[10px] text-gray-400">{responses.length} participantes</span>
          </div>
          <div className="overflow-auto flex-1 min-h-0">
            <table className="w-full text-[9px] border-collapse">
              <thead className="sticky top-0">
                <tr>
                  <th className="bg-navy text-white px-2 py-1 text-left text-[8px] w-[18%]">Participante</th>
                  <th className="bg-navy text-white px-2 py-1 text-left text-[8px] w-[27%]">¿Qué imaginan?</th>
                  <th className="bg-navy text-white px-2 py-1 text-left text-[8px] w-[27%]">¿Para qué serviría?</th>
                  <th className="bg-navy text-white px-2 py-1 text-left text-[8px] w-[28%]">¿Qué dolor resuelve?</th>
                </tr>
              </thead>
              <tbody>
                {participants.map(p => {
                  const r = responses.find((r: any) => r.participant_id === p.id);
                  const data = r?.payload;
                  const name = (p.display_name || '').split(' ');
                  const shortName = name.length >= 2 ? `${name[0]} ${name[name.length - 1][0]}.` : p.display_name;
                  return (
                    <tr key={p.id} className="border-b border-gray-100 align-top">
                      <td className="px-2 py-1 font-semibold text-navy whitespace-nowrap">{shortName}</td>
                      <td className="px-2 py-1 text-gray-600">
                        {data?.q1?.answer
                          ? <span className="line-clamp-2 block">{data.q1.answer}</span>
                          : <span className="writing-pulse">Escribiendo...</span>}
                      </td>
                      <td className="px-2 py-1 text-gray-600">
                        {data?.q2?.answer
                          ? <span className="line-clamp-2 block">{data.q2.answer}</span>
                          : <span className="writing-pulse">Escribiendo...</span>}
                      </td>
                      <td className="px-2 py-1 text-gray-600">
                        {data?.q3?.answer
                          ? <span className="line-clamp-2 block">{data.q3.answer}</span>
                          : <span className="writing-pulse">Escribiendo...</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Footer />
        </div>
      );

    /* ─── B1 COMPARTIR ─── */
    case 'b1s':
      return (
        <div className="slide flex flex-col justify-start p-5">
          <Pill text="Bloque 1 · Descubrir" bg="#FF6B00" />
          <h2 className="text-lg font-extrabold text-navy mt-1 mb-2">Lo que escuchamos</h2>
          <div className="grid grid-cols-3 gap-2 flex-1 overflow-auto min-h-0 content-start">
            {responses.map((r: any, i: number) => (
              <div key={i} className="bg-white rounded-lg p-2 shadow-sm border-l-[3px] border-orange">
                <p className="font-bold text-navy text-[10px] mb-1 truncate">{r.display_name}</p>
                {r.payload?.q1?.answer && <p className="text-[8px] text-gray-600 line-clamp-2"><b>¿Qué imaginan?</b> {r.payload.q1.answer}</p>}
                {r.payload?.q2?.answer && <p className="text-[8px] text-gray-600 line-clamp-2"><b>¿Para qué sirve?</b> {r.payload.q2.answer}</p>}
                {r.payload?.q3?.answer && <p className="text-[8px] text-gray-600 line-clamp-2"><b>¿Qué dolor?</b> {r.payload.q3.answer}</p>}
              </div>
            ))}
          </div>
          <div className="mt-2 bg-navy/5 p-2 rounded-lg text-center">
            <p className="text-[9px] text-gray-500">Patrones: <b className="text-navy">Centralización</b> · <b className="text-navy">Automatización</b> · <b className="text-navy">Visibilidad</b></p>
          </div>
          <Footer />
        </div>
      );

    /* ─── B1 SÍNTESIS ─── */
    case 'b1y':
      return (
        <div className="slide flex flex-col justify-start p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Pill text="Bloque 1 · Síntesis" bg="#FF6B00" />
              <h2 className="text-lg font-extrabold text-navy mt-1">Síntesis del Bloque 1</h2>
            </div>
            <button onClick={onTriggerSynthesis} disabled={synthLoading} className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-semibold hover:bg-indigo-700 disabled:opacity-50">
              {synthLoading ? '⏳ Generando...' : '🤖 Generar Síntesis'}
            </button>
          </div>
          <div className="flex gap-2 mb-3">
            {['Centralización', 'Skills vs. títulos', 'Automatización', 'Fragmentación'].map(k => (
              <span key={k} className="bg-navy text-white px-2 py-0.5 rounded-full text-[8px] font-semibold">{k}</span>
            ))}
          </div>
          {synthesis ? (
            <div className="ai-box">
              <p className="text-[8px] font-bold text-indigo-500 tracking-wider mb-1">GENERADO POR CLAUDE</p>
              <p className="text-[10px] text-gray-700 leading-relaxed">{synthesis}</p>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Presiona &quot;Generar Síntesis&quot; para analizar las respuestas con IA
            </div>
          )}
          <Footer />
        </div>
      );

    /* ─── B2 INTRO (¿Por qué funcionalidades?) ─── */
    case 'b2w1':
      return (
        <div className="slide-dark flex flex-col items-center justify-center text-center p-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange" />
          <Pill text="Bloque 2 · Funcionalidades" bg="#FF6B00" />
          <h2 className="text-2xl font-extrabold text-white mt-4 mb-2">¿Qué debería <span className="text-orange">hacer</span> el sistema?</h2>
          <p className="text-gray-400 text-sm mb-4">Vamos a definir funcionalidades desde lo operativo y lo analítico</p>
          <div className="w-16 h-0.5 bg-orange mb-4" />
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-orange font-bold text-xs mb-1">Parte A</p>
              <p className="text-gray-300 text-[10px]">Operaciones: qué acciones cotidianas debe soportar</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-teal font-bold text-xs mb-1">Parte B</p>
              <p className="text-gray-300 text-[10px]">Preguntas: qué necesitan responder con datos</p>
            </div>
          </div>
        </div>
      );

    /* ─── B2 DOS CAPAS ─── */
    case 'b2w2':
      return (
        <div className="slide flex flex-col justify-center p-6">
          <Pill text="Bloque 2 · Funcionalidades" bg="#FF6B00" />
          <h2 className="text-xl font-extrabold text-navy my-2">Dos capas del sistema</h2>
          <div className="w-16 h-0.5 bg-orange mb-3" />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border-t-[3px] border-orange text-center">
              <div className="w-10 h-10 rounded-full bg-orange text-white flex items-center justify-center mx-auto mb-2 text-xl">⚙️</div>
              <h4 className="text-orange font-bold text-sm mb-1">Operaciones (OLTP)</h4>
              <p className="text-[9px] text-gray-500">Las acciones del día a día: registrar, actualizar, asignar. Lo que la gente <b>hace</b>.</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-t-[3px] border-teal text-center">
              <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center mx-auto mb-2 text-xl">📊</div>
              <h4 className="text-teal font-bold text-sm mb-1">Preguntas (OLAP)</h4>
              <p className="text-[9px] text-gray-500">Lo que necesitan responder: ¿cuántos? ¿quiénes? ¿qué falta? Lo que la gente <b>necesita saber</b>.</p>
            </div>
          </div>
          <Footer />
        </div>
      );

    /* ─── B2A CONTEXTO ─── */
    case 'b2ax':
      return (
        <div className="slide-dark flex flex-col items-center justify-center text-center p-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange" />
          <Pill text="Bloque 2A · Operaciones" bg="#FF6B00" />
          <h2 className="text-xl font-extrabold text-white mt-4 mb-2">Imaginen que llega un<br />nuevo colaborador</h2>
          <p className="text-gray-400 text-[11px] mt-2 leading-relaxed max-w-md">
            ¿Qué acciones tiene que hacer GTH en sus sistemas?<br />
            ¿Qué datos hay que registrar?<br />
            ¿Qué pasos son manuales hoy?
          </p>
          <div className="w-16 h-0.5 bg-orange my-4" />
          <p className="text-gray-500 text-[10px]">Vamos a listar esas operaciones entre todos</p>
        </div>
      );

    /* ─── B2A AGREGAR (multi_add) ─── */
    case 'b2a':
      return (
        <div className="slide flex flex-col justify-start p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Pill text="Bloque 2A · Operaciones" bg="#FF6B00" />
              <h2 className="text-lg font-extrabold text-navy mt-1">Operaciones del sistema</h2>
            </div>
            <span className="text-[10px] text-gray-400">{(artifacts?.items || []).length} operaciones</span>
          </div>
          <div className="overflow-auto flex-1 min-h-0">
            <table className="w-full text-[9px] border-collapse">
              <thead className="sticky top-0">
                <tr>
                  <th className="bg-orange text-white px-2 py-1 text-left text-[8px] w-[4%]">#</th>
                  <th className="bg-orange text-white px-2 py-1 text-left text-[8px] w-[30%]">Operación</th>
                  <th className="bg-orange text-white px-2 py-1 text-left text-[8px] w-[38%]">Detalle</th>
                  <th className="bg-orange text-white px-2 py-1 text-left text-[8px] w-[28%]">Origen</th>
                </tr>
              </thead>
              <tbody>
                {(artifacts?.items || []).map((item: any, i: number) => (
                  <tr key={i} className={`border-b border-gray-100 align-top ${item.source === 'participant' ? 'bg-orange/5' : ''}`}>
                    <td className="px-2 py-1 font-bold text-navy">{i + 1}</td>
                    <td className="px-2 py-1"><span className="line-clamp-2 font-semibold text-gray-700 block">{item.title}</span></td>
                    <td className="px-2 py-1"><span className="line-clamp-2 text-gray-500 block">{item.detail || '—'}</span></td>
                    <td className="px-2 py-1">
                      {item.source === 'seed' ? <Badge text="IA" variant="pucp" /> : <Badge text={item.author || 'Participante'} variant="new" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Footer />
        </div>
      );

    /* ─── B2A ORGANIZAR ─── */
    case 'b2a2':
      return (
        <div className="slide flex flex-col justify-start p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Pill text="Bloque 2A · Organizar" bg="#FF6B00" />
              <h2 className="text-lg font-extrabold text-navy mt-1">Priorizar operaciones</h2>
            </div>
            <span className="text-[10px] text-gray-400">{(artifacts?.items || []).length} items</span>
          </div>
          <div className="overflow-auto flex-1 min-h-0 space-y-1">
            {(artifacts?.items || []).map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-white rounded-lg border-l-[3px] border-navy shadow-sm">
                <span className="text-gray-300 text-base cursor-grab shrink-0">⠿</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-[10px] truncate">{item.title}</p>
                  {item.detail && <p className="text-[8px] text-gray-400 truncate">{item.detail}</p>}
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded text-[8px] font-semibold text-white ${
                  item.priority === 'Crítica' ? 'bg-red-500' :
                  item.priority === 'Alta' ? 'bg-orange' :
                  item.priority === 'Media' ? 'bg-amber-500' : 'bg-gray-400'
                }`}>{item.priority || '—'}</span>
              </div>
            ))}
          </div>
          <Footer />
        </div>
      );

    /* ─── B2A SÍNTESIS ─── */
    case 'b2ay':
      return (
        <div className="slide flex flex-col justify-start p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Pill text="Bloque 2A · Síntesis" bg="#FF6B00" />
              <h2 className="text-lg font-extrabold text-navy mt-1">Síntesis de Operaciones</h2>
            </div>
            <button onClick={onTriggerSynthesis} disabled={synthLoading} className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-semibold hover:bg-indigo-700 disabled:opacity-50">
              {synthLoading ? '⏳ Generando...' : '🤖 Generar Síntesis'}
            </button>
          </div>
          {artifacts?.items && (
            <div className="flex gap-2 mb-3">
              {['Crítica', 'Alta', 'Media', 'Futura'].map(p => {
                const count = (artifacts.items || []).filter((it: any) => it.priority === p).length;
                return count > 0 ? (
                  <div key={p} className="bg-gray-100 rounded-lg px-3 py-1.5 text-center">
                    <p className="text-lg font-extrabold text-navy">{count}</p>
                    <p className="text-[8px] text-gray-500">{p}</p>
                  </div>
                ) : null;
              })}
            </div>
          )}
          {synthesis ? (
            <div className="ai-box">
              <p className="text-[8px] font-bold text-indigo-500 tracking-wider mb-1">GENERADO POR CLAUDE</p>
              <p className="text-[10px] text-gray-700 leading-relaxed">{synthesis}</p>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Presiona &quot;Generar Síntesis&quot; para analizar las operaciones con IA
            </div>
          )}
          <Footer />
        </div>
      );

    /* ─── B2B CONTEXTO 1 ─── */
    case 'b2bx1':
      return (
        <div className="slide-dark flex flex-col items-center justify-center text-center p-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange" />
          <Pill text="Bloque 2B · Preguntas" bg="#0D9488" />
          <h2 className="text-xl font-extrabold text-white mt-4 mb-2">¿Qué preguntas necesitan<br /><span className="text-teal">responder con datos</span>?</h2>
          <p className="text-gray-400 text-[11px] mt-2 leading-relaxed max-w-md">
            Ahora pensemos en lo analítico: reportes, indicadores, dashboards.<br />
            ¿Qué necesitan saber que hoy no pueden responder fácilmente?
          </p>
          <div className="w-16 h-0.5 bg-teal my-4" />
          <p className="text-gray-500 text-[10px]">Vamos a listar esas preguntas entre todos</p>
          {onTriggerSeeds && (
            <button
              onClick={onTriggerSeeds}
              disabled={seedsLoading}
              className="mt-5 px-4 py-2 bg-teal/80 hover:bg-teal text-white rounded-lg text-[11px] font-semibold transition disabled:opacity-50"
            >
              {seedsLoading ? '⏳ Generando semillas…' : '🤖 Pre-generar preguntas con IA'}
            </button>
          )}
        </div>
      );

    /* ─── B2B ACTORES ─── */
    case 'b2bx2':
      return (
        <div className="slide flex flex-col justify-start p-6">
          <Pill text="Bloque 2B · Preguntas" bg="#0D9488" />
          <h2 className="text-xl font-extrabold text-navy my-2">¿Quién pregunta?</h2>
          <p className="text-[10px] text-gray-500 mb-3">Cada pregunta tiene un actor principal. Esto nos ayuda a diseñar los dashboards correctos.</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { a: '👤', n: 'Colaborador', d: 'El docente o staff que consulta su propia información', c: 'bg-blue-50 border-blue-200', tc: 'text-blue-700' },
              { a: '🏢', n: 'GTH', d: 'El equipo de gestión humana que administra y reporta', c: 'bg-green-50 border-green-200', tc: 'text-green-700' },
              { a: '📊', n: 'Dirección', d: 'Decisores que necesitan visión estratégica', c: 'bg-purple-50 border-purple-200', tc: 'text-purple-700' },
              { a: '🔗', n: 'Otros', d: 'Sistemas, auditoría, comités externos', c: 'bg-gray-50 border-gray-200', tc: 'text-gray-700' },
            ].map(actor => (
              <div key={actor.n} className={`rounded-lg p-3 border ${actor.c} text-center`}>
                <p className="text-2xl mb-1">{actor.a}</p>
                <h5 className={`font-bold text-sm ${actor.tc}`}>{actor.n}</h5>
                <p className="text-[8px] text-gray-500 mt-1">{actor.d}</p>
              </div>
            ))}
          </div>
          <Footer />
        </div>
      );

    /* ─── B2B AGREGAR (multi_add) ─── */
    case 'b2b':
      return (
        <div className="slide flex flex-col justify-start p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Pill text="Bloque 2B · Preguntas" bg="#0D9488" />
              <h2 className="text-lg font-extrabold text-navy mt-1">Preguntas clave</h2>
            </div>
            <span className="text-[10px] text-gray-400">{(artifacts?.items || []).length} preguntas</span>
          </div>
          <div className="overflow-auto flex-1 min-h-0">
            <table className="w-full text-[9px] border-collapse">
              <thead className="sticky top-0">
                <tr>
                  <th className="bg-teal text-white px-2 py-1 text-left text-[8px] w-[4%]">#</th>
                  <th className="bg-teal text-white px-2 py-1 text-left text-[8px] w-[56%]">Pregunta</th>
                  <th className="bg-teal text-white px-2 py-1 text-left text-[8px] w-[16%]">Actor</th>
                  <th className="bg-teal text-white px-2 py-1 text-left text-[8px] w-[24%]">Origen</th>
                </tr>
              </thead>
              <tbody>
                {(artifacts?.items || []).map((item: any, i: number) => (
                  <tr key={i} className={`border-b border-gray-100 align-top ${item.source === 'participant' ? 'bg-teal/5' : ''}`}>
                    <td className="px-2 py-1 font-bold text-navy">{i + 1}</td>
                    <td className="px-2 py-1"><span className="line-clamp-2 font-semibold text-gray-700 block">{item.title}</span></td>
                    <td className="px-2 py-1"><Badge text={item.actor || '—'} variant={
                      item.actor === 'Colaborador' ? 'colaborador' :
                      item.actor === 'GTH' ? 'gth-actor' :
                      item.actor === 'Dirección' ? 'direccion' : 'otros'
                    } /></td>
                    <td className="px-2 py-1">
                      {item.source === 'seed' ? <Badge text="IA" variant="pucp" /> : <Badge text={item.author || 'Participante'} variant="new" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Footer />
        </div>
      );

    /* ─── B2B ORGANIZAR ─── */
    case 'b2b2':
      return (
        <div className="slide flex flex-col justify-start p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Pill text="Bloque 2B · Organizar" bg="#0D9488" />
              <h2 className="text-lg font-extrabold text-navy mt-1">Organizar preguntas</h2>
            </div>
            <span className="text-[10px] text-gray-400">{(artifacts?.items || []).length} items</span>
          </div>
          <div className="overflow-auto flex-1 min-h-0 space-y-1">
            {(artifacts?.items || []).map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-white rounded-lg border-l-[3px] border-teal shadow-sm">
                <span className="text-gray-300 text-base cursor-grab shrink-0">⠿</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-[10px] truncate">{item.title}</p>
                  {item.actor && <Badge text={item.actor} variant={
                    item.actor === 'Colaborador' ? 'colaborador' :
                    item.actor === 'GTH' ? 'gth-actor' :
                    item.actor === 'Dirección' ? 'direccion' : 'otros'
                  } />}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button className="px-1.5 py-0.5 rounded bg-gray-100 text-[8px] font-semibold text-gray-600">✏️</button>
                  <button className="px-1.5 py-0.5 rounded bg-red-50 text-[8px] font-semibold text-red-500">🗑</button>
                </div>
              </div>
            ))}
          </div>
          <Footer />
        </div>
      );

    /* ─── B2B SÍNTESIS ─── */
    case 'b2by':
      return (
        <div className="slide flex flex-col justify-start p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Pill text="Bloque 2B · Síntesis" bg="#0D9488" />
              <h2 className="text-lg font-extrabold text-navy mt-1">Síntesis de Preguntas</h2>
            </div>
            <button onClick={onTriggerSynthesis} disabled={synthLoading} className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-semibold hover:bg-indigo-700 disabled:opacity-50">
              {synthLoading ? '⏳ Generando...' : '🤖 Generar Síntesis'}
            </button>
          </div>
          {artifacts?.items && (
            <div className="flex gap-2 mb-3">
              {['Colaborador', 'GTH', 'Dirección', 'Otros'].map(a => {
                const count = (artifacts.items || []).filter((it: any) => it.actor === a).length;
                return count > 0 ? (
                  <div key={a} className="bg-gray-100 rounded-lg px-3 py-1.5 text-center">
                    <p className="text-lg font-extrabold text-navy">{count}</p>
                    <p className="text-[8px] text-gray-500">{a}</p>
                  </div>
                ) : null;
              })}
            </div>
          )}
          {synthesis ? (
            <div className="ai-box">
              <p className="text-[8px] font-bold text-indigo-500 tracking-wider mb-1">GENERADO POR CLAUDE</p>
              <p className="text-[10px] text-gray-700 leading-relaxed">{synthesis}</p>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Presiona &quot;Generar Síntesis&quot; para analizar las preguntas con IA
            </div>
          )}
          <Footer />
        </div>
      );

    /* ─── B3 INTRO (¿Por qué datos?) ─── */
    case 'b3w1':
      return (
        <div className="slide-dark flex flex-col items-center justify-center text-center p-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-teal" />
          <Pill text="Bloque 3 · Datos" bg="#0D9488" />
          <h2 className="text-2xl font-extrabold text-white mt-4 mb-2">¿Qué <span className="text-teal">datos</span> necesitamos?</h2>
          <p className="text-gray-400 text-sm mb-4">Vamos a inventariar los campos de información del sistema</p>
          <div className="w-16 h-0.5 bg-teal mb-4" />
          <p className="text-gray-500 text-[10px]">Cada dato tiene: nombre, fuente y nivel de prioridad</p>
          {onTriggerSeeds && (
            <button
              onClick={onTriggerSeeds}
              disabled={seedsLoading}
              className="mt-5 px-4 py-2 bg-teal/80 hover:bg-teal text-white rounded-lg text-[11px] font-semibold transition disabled:opacity-50"
            >
              {seedsLoading ? '⏳ Generando campos…' : '🤖 Pre-generar campos con IA'}
            </button>
          )}
        </div>
      );

    /* ─── B3 DIMENSIONES ─── */
    case 'b3w2':
      return (
        <div className="slide flex flex-col justify-start p-6">
          <Pill text="Bloque 3 · Datos" bg="#0D9488" />
          <h2 className="text-xl font-extrabold text-navy my-2">3 dimensiones por campo</h2>
          <div className="w-16 h-0.5 bg-teal mb-4" />
          <div className="grid grid-cols-3 gap-3">
            {[
              { n: '1', t: '¿Qué dato?', d: 'El nombre del campo: grado académico, skill certificado, antigüedad...', c: 'bg-teal' },
              { n: '2', t: '¿Dónde está?', d: 'La fuente actual: GTH tiene, PUCP tiene, es nuevo...', c: 'bg-navy' },
              { n: '3', t: '¿Qué tan importante?', d: 'Prioridad: Crítico, Alto, Deseable', c: 'bg-orange' },
            ].map(d => (
              <div key={d.n} className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className={`w-8 h-8 rounded-full ${d.c} text-white flex items-center justify-center mx-auto mb-2 text-sm font-bold`}>{d.n}</div>
                <h5 className="font-bold text-sm text-gray-700 mb-1">{d.t}</h5>
                <p className="text-[9px] text-gray-500">{d.d}</p>
              </div>
            ))}
          </div>
          <Footer />
        </div>
      );

    /* ─── B3 AGREGAR (multi_add) ─── */
    case 'b3':
      return (
        <div className="slide flex flex-col justify-start p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Pill text="Bloque 3 · Datos" bg="#0D9488" />
              <h2 className="text-lg font-extrabold text-navy mt-1">Inventario de campos</h2>
            </div>
            <span className="text-[10px] text-gray-400">{(artifacts?.items || []).length} campos</span>
          </div>
          <div className="overflow-auto flex-1 min-h-0">
            <table className="w-full text-[9px] border-collapse">
              <thead className="sticky top-0">
                <tr>
                  <th className="bg-teal text-white px-2 py-1 text-left text-[8px] w-[4%]">#</th>
                  <th className="bg-teal text-white px-2 py-1 text-left text-[8px] w-[30%]">Campo</th>
                  <th className="bg-teal text-white px-2 py-1 text-left text-[8px] w-[42%]">Descripción</th>
                  <th className="bg-teal text-white px-2 py-1 text-left text-[8px] w-[24%]">Origen</th>
                </tr>
              </thead>
              <tbody>
                {(artifacts?.items || []).map((item: any, i: number) => (
                  <tr key={i} className={`border-b border-gray-100 align-top ${item.source === 'participant' ? 'bg-teal/5' : ''}`}>
                    <td className="px-2 py-1 font-bold text-navy">{i + 1}</td>
                    <td className="px-2 py-1"><span className="line-clamp-2 font-semibold text-gray-700 block">{item.title}</span></td>
                    <td className="px-2 py-1"><span className="line-clamp-2 text-gray-500 block">{item.detail || '—'}</span></td>
                    <td className="px-2 py-1">
                      {item.source === 'seed' ? <Badge text="IA" variant="pucp" /> : <Badge text={item.author || 'Participante'} variant="new" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Footer />
        </div>
      );

    /* ─── B3 FUENTE+PRIORIDAD (organize) ─── */
    case 'b3fp':
      return (
        <div className="slide flex flex-col justify-start p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Pill text="Bloque 3 · Clasificar" bg="#0D9488" />
              <h2 className="text-lg font-extrabold text-navy mt-1">Fuente y prioridad</h2>
            </div>
            <span className="text-[10px] text-gray-400">{(artifacts?.items || []).length} campos</span>
          </div>
          <div className="overflow-auto flex-1 min-h-0">
            <table className="w-full text-[9px] border-collapse">
              <thead className="sticky top-0">
                <tr>
                  <th className="bg-teal text-white px-2 py-1 text-left text-[8px] w-[50%]">Campo</th>
                  <th className="bg-teal text-white px-2 py-1 text-left text-[8px] w-[25%]">Fuente</th>
                  <th className="bg-teal text-white px-2 py-1 text-left text-[8px] w-[25%]">Prioridad</th>
                </tr>
              </thead>
              <tbody>
                {(artifacts?.items || []).map((item: any, i: number) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-2 py-1 font-semibold text-navy truncate">{item.title}</td>
                    <td className="px-2 py-1">
                      <Badge text={item.fuente || 'GTH tiene'} variant={
                        item.fuente === 'PUCP' ? 'pucp' : item.fuente === 'Nuevo' ? 'new' : 'gth'
                      } />
                    </td>
                    <td className="px-2 py-1">
                      <Badge text={item.priority || 'Alto'} variant={
                        item.priority === 'Crítico' ? 'critical' : item.priority === 'Alto' ? 'high' : 'medium'
                      } />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Footer />
        </div>
      );

    /* ─── B3 SÍNTESIS ─── */
    case 'b3y':
      return (
        <div className="slide flex flex-col justify-start p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Pill text="Bloque 3 · Síntesis" bg="#0D9488" />
              <h2 className="text-lg font-extrabold text-navy mt-1">Síntesis de Datos</h2>
            </div>
            <button onClick={onTriggerSynthesis} disabled={synthLoading} className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-semibold hover:bg-indigo-700 disabled:opacity-50">
              {synthLoading ? '⏳ Generando...' : '🤖 Generar Síntesis'}
            </button>
          </div>
          {artifacts?.items && (
            <div className="flex gap-2 mb-3">
              {[
                { l: 'Campos', v: (artifacts.items || []).length },
                { l: 'GTH tiene', v: (artifacts.items || []).filter((it: any) => it.fuente === 'GTH tiene' || it.fuente === 'GTH').length },
                { l: 'Nuevos', v: (artifacts.items || []).filter((it: any) => it.fuente === 'Nuevo').length },
                { l: 'Críticos', v: (artifacts.items || []).filter((it: any) => it.priority === 'Crítico').length },
              ].map(s => (
                <div key={s.l} className="bg-gray-100 rounded-lg px-3 py-1.5 text-center">
                  <p className="text-lg font-extrabold text-navy">{s.v}</p>
                  <p className="text-[8px] text-gray-500">{s.l}</p>
                </div>
              ))}
            </div>
          )}
          {synthesis ? (
            <div className="ai-box">
              <p className="text-[8px] font-bold text-indigo-500 tracking-wider mb-1">GENERADO POR CLAUDE</p>
              <p className="text-[10px] text-gray-700 leading-relaxed">{synthesis}</p>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Presiona &quot;Generar Síntesis&quot; para analizar el inventario con IA
            </div>
          )}
          <Footer />
        </div>
      );

    /* ─── B4 GESTIÓN ─── */
    case 'b4w1':
      return (
        <div className="slide flex flex-col justify-center p-6">
          <Pill text="Bloque 4 · Gestión" bg="#059669" />
          <h2 className="text-xl font-extrabold text-navy my-2">Gobernanza del proyecto</h2>
          <div className="w-16 h-0.5 bg-green mb-3" />
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 shadow-sm border-t-[3px] border-green-500 text-center">
              <p className="text-xl mb-1">🔮</p>
              <h4 className="text-green-600 font-bold text-sm mb-1">Predictivo</h4>
              <p className="text-[9px] text-gray-500">El diseño del sistema anticipará necesidades. Gobernanza de datos, taxonomías, esquemas.</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-t-[3px] border-orange text-center">
              <p className="text-xl mb-1">🔄</p>
              <h4 className="text-orange font-bold text-sm mb-1">Adaptativo</h4>
              <p className="text-[9px] text-gray-500">La ejecución será ágil. Sprints, entregables incrementales, retroalimentación permanente.</p>
            </div>
          </div>
          <Footer />
        </div>
      );

    /* ─── B4 DONDE ESTAMOS ─── */
    case 'b4w2':
      return (
        <div className="slide flex flex-col justify-center p-6">
          <Pill text="Bloque 4 · Gestión" bg="#059669" />
          <h2 className="text-lg font-extrabold text-navy mb-2">Dónde estamos</h2>
          <p className="text-[10px] text-gray-500 mb-2">El proyecto tiene un charter aprobado y estamos transitando de Iniciación a Planificación. Los insumos de hoy alimentan directamente los artefactos de planificación.</p>
          <div className="flex gap-1.5 flex-wrap mb-3">
            <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-[9px] font-semibold">Iniciación (completada)</span>
            <span className="bg-orange text-white px-2 py-0.5 rounded-full text-[9px] font-semibold">Planificación (en curso)</span>
            <span className="bg-gray-400 text-white px-2 py-0.5 rounded-full text-[9px] font-semibold">Ejecución</span>
            <span className="bg-gray-400 text-white px-2 py-0.5 rounded-full text-[9px] font-semibold">Monitoreo</span>
            <span className="bg-gray-400 text-white px-2 py-0.5 rounded-full text-[9px] font-semibold">Cierre</span>
          </div>
          <div className="bg-navy rounded-lg p-3">
            <p className="text-orange text-[9px] font-bold">TRANSPARENCIA TOTAL</p>
            <p className="text-white text-[10px]">Todos los artefactos, decisiones y avances estarán disponibles en Notion y Google Drive. Ustedes tendrán acceso permanente al estado del proyecto.</p>
          </div>
          <Footer />
        </div>
      );

    /* ─── B4 HERRAMIENTAS ─── */
    case 'b4t':
      return (
        <div className="slide flex flex-col justify-center p-6">
          <Pill text="Bloque 4 · Gestión" bg="#059669" />
          <h2 className="text-lg font-extrabold text-navy mb-3">Herramientas de trabajo</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 shadow-sm text-center border-t-[3px] border-navy">
              <h4 className="text-navy font-bold text-sm mb-1">Notion</h4>
              <p className="text-[9px] text-gray-500">Gestión del proyecto: tareas, backlog, seguimiento de decisiones y avances.</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm text-center border-t-[3px] border-teal">
              <h4 className="text-teal font-bold text-sm mb-1">Google Drive</h4>
              <p className="text-[9px] text-gray-500">Documentos compartidos: actas, entregables, archivos de referencia.</p>
            </div>
          </div>
          <p className="text-center text-[10px] text-navy font-semibold mt-3">Les enviaremos los accesos hoy mismo.</p>
          <Footer />
        </div>
      );

    /* ─── B4 FASES ─── */
    case 'b4p':
      return (
        <div className="slide flex flex-col justify-start p-6">
          <Pill text="Bloque 4 · Gestión" bg="#059669" />
          <h2 className="text-lg font-extrabold text-navy mb-3">People Intelligence: 3 fases</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { n: 'Fase 1 · Dashboard + Piloto', w: '8 semanas', items: ['Dashboard de grados académicos', 'Piloto skills con 10-15 personas', 'PoC Report para Dir. General'], c: 'bg-orange', tc: 'text-orange' },
              { n: 'Fase 2 · Skills Analytics', w: '12 semanas', items: ['Autorreporte 100% staff', 'Dashboard analítico', 'Gobernanza de datos'], c: 'bg-navy', tc: 'text-navy' },
              { n: 'Fase 3 · Predictive', w: '8 semanas', items: ['Gap analysis', 'Asignación inteligente', 'Rutas de carrera'], c: 'bg-teal', tc: 'text-teal' },
            ].map(f => (
              <div key={f.n} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className={`${f.c} text-white text-center py-1.5 text-[10px] font-bold`}>{f.n}</div>
                <p className={`text-center ${f.tc} font-bold text-[10px] py-0.5`}>{f.w}</p>
                <ul className="p-2 pl-4 space-y-1 list-disc">
                  {f.items.map(item => (
                    <li key={item} className="text-[9px] text-gray-600 leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center mt-3 text-[10px]">
            <span className="text-gray-400">Estamos aquí →</span>{' '}
            <b className="text-orange">Fase 1: marzo – mayo 2026</b>
          </p>
          <Footer />
        </div>
      );

    /* ─── B4 PRÓXIMOS PASOS ─── */
    case 'b4n':
      return (
        <div className="slide flex flex-col justify-center p-4">
          <Pill text="Bloque 4 · Próximos pasos" bg="#059669" />
          <h2 className="text-lg font-extrabold text-navy mt-2 mb-1">Acuerdos de salida</h2>
          <div className="w-16 h-0.5 bg-green mb-2" />
          <table className="w-full text-[9px] border-collapse mt-2">
            <thead>
              <tr>
                <th className="bg-gray-700 text-white px-2 py-1 text-left text-[8px]">Acción</th>
                <th className="bg-gray-700 text-white px-2 py-1 text-left text-[8px]">Responsable</th>
                <th className="bg-gray-700 text-white px-2 py-1 text-left text-[8px]">Plazo</th>
              </tr>
            </thead>
            <tbody>
              {(artifacts?.items || [
                { title: 'Consolidar insumos del workshop', responsible: 'JZ', deadline: '28/03' },
                { title: 'Matriz de coherencia transaccional/analítica', responsible: 'RN + JZ', deadline: 'Sem. 31/03' },
                { title: 'Schema de datos v0.1 (DBML)', responsible: 'JZ + RN', deadline: 'Sem. 31/03' },
                { title: 'Enviar accesos Notion y Drive a GTH', responsible: 'JZ', deadline: '28/03' },
              ]).map((item: any, i: number) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-2 py-1.5 font-semibold text-gray-700">{item.title}</td>
                  <td className="px-2 py-1.5 text-gray-500">{item.responsible}</td>
                  <td className="px-2 py-1.5 text-gray-500">{item.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 bg-navy rounded-lg p-3">
            <p className="text-orange text-[10px] font-bold">REUNIÓN DE COORDINACIÓN SEMANAL</p>
            <p className="text-white text-[10px]">Se establecerá una reunión semanal de coordinación entre Smart Centrum y GTH para dar seguimiento al avance del proyecto.</p>
          </div>
          <Footer />
        </div>
      );

    /* ─── PREGUNTAS ─── */
    case 'qa':
      return (
        <div className="slide-dark flex flex-col items-center justify-center text-center p-8">
          <img src="/logos/logo-blanco-centrum-pucp-v3.png" alt="CENTRUM PUCP" className="absolute top-4 left-6 h-5 w-auto opacity-80" />
          <h2 className="text-2xl font-extrabold text-white">Preguntas</h2>
          <div className="w-16 h-0.5 bg-orange my-4" />
          <p className="text-gray-400 text-sm leading-relaxed">
            Antes de cerrar, este es el espacio<br />para cualquier duda, comentario<br />o inquietud que quieran compartir.
          </p>
          <p className="text-orange/80 text-[13px] mt-4 font-semibold">
            Sobre el proyecto, el sistema, los datos,<br />la forma de trabajo, los plazos — lo que sea.
          </p>
        </div>
      );

    /* ─── CIERRE ─── */
    case 'thx':
      return (
        <div className="slide-dark flex flex-col items-center justify-center text-center p-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full" style={{ background: 'rgba(255,107,0,0.08)' }} />
          <img src="/logos/logo-blanco-centrum-pucp-v3.png" alt="CENTRUM PUCP" className="h-7 w-auto mb-3 opacity-90" />
          <h2 className="text-3xl font-extrabold text-white">Gracias</h2>
          <p className="text-gray-400 text-sm mt-2">Lo que construimos hoy es el cimiento<br />del sistema que gestionará el talento de CENTRUM.</p>
          <div className="w-16 h-0.5 bg-orange my-4" />
          <div className="flex gap-2 flex-wrap justify-center">
            <span className="px-3 py-1.5 rounded-lg bg-orange text-white text-[10px] font-bold cursor-pointer hover:scale-105 transition-transform">Exportar Acta</span>
            <span className="px-3 py-1.5 rounded-lg bg-navy text-white text-[10px] font-bold cursor-pointer hover:scale-105 transition-transform">Síntesis Funcionalidades</span>
            <span className="px-3 py-1.5 rounded-lg bg-teal text-white text-[10px] font-bold cursor-pointer hover:scale-105 transition-transform">Inventario Campos</span>
            <span className="px-3 py-1.5 rounded-lg bg-gray-700 text-white text-[10px] font-bold cursor-pointer hover:scale-105 transition-transform">Próximos Pasos</span>
          </div>
          <p className="text-gray-500 text-[8px] mt-4">
            Documentos generados por IA desde los datos del taller<br />Workshop Live · Smart Centrum · CENTRUM PUCP
          </p>
        </div>
      );

    default:
      return (
        <div className="slide flex items-center justify-center">
          <p className="text-gray-400">Slide no encontrado: {stageId}</p>
        </div>
      );
  }
}
