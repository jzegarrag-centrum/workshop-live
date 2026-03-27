'use client';
import React, { useState } from 'react';
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
  onUpdateArtifactsItems?: (items: any[]) => void;
}

/* ── SLIDE CONTENT ── */
export default function FacilitatorSlide({ stageId, sessionId, responses = [], artifacts, synthesis, participants = [], onTriggerSynthesis, synthLoading, onTriggerSeeds, seedsLoading, onUpdateArtifactsItems }: SlideProps) {
  const participantUrl = typeof window !== 'undefined' && sessionId
    ? `${window.location.origin}/workshop/${sessionId}/participate`
    : sessionId ? `/workshop/${sessionId}/participate` : '';
  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragContext, setDragContext] = useState<'b2a2' | 'b2b2' | null>(null);
  const resetDrag = () => {
    setDragFromIndex(null);
    setDragOverIndex(null);
    setDragContext(null);
  };
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
          <SectionTitle eyebrow="HOY" title="Agenda del taller" />
          <div className="grid grid-cols-5 gap-2">
            {[
              { t: '15 min', b: 'APERTURA', d: 'Bienvenida + Resumen del Proyecto', sub: 'Presentaci\u00f3n del equipo, contexto general y resumen del PIS definido hasta hoy.', c: 'bg-navy' },
              { t: '25 min', b: 'BLOQUE 1', d: '\u00bfQu\u00e9 es People Intelligence?', sub: 'Skills-first, WEF Taxonomy y din\u00e1mica de exploraci\u00f3n.', c: 'bg-navy' },
              { t: '40 min', b: 'BLOQUE 2', d: 'Funcionalidades del sistema', sub: 'Co-creaci\u00f3n de operaciones y preguntas anal\u00edticas.', c: 'bg-orange' },
              { t: '20 min', b: 'BLOQUE 3', d: 'Campos de datos y fuentes', sub: 'Inventario de campos: qu\u00e9 datos necesita el sistema, d\u00f3nde est\u00e1n y con qu\u00e9 urgencia.', c: 'bg-teal' },
              { t: '15 min', b: 'BLOQUE 4 + Cierre', d: 'Gesti\u00f3n del proyecto y pr\u00f3ximos pasos', sub: 'Herramientas, fases, reuniones.', c: 'bg-green' },
            ].map(b => (
              <div key={b.b} className="bg-white rounded-lg p-3 shadow-sm flex flex-col">
                <div className={`${b.c} text-white text-center py-1 rounded-md text-[9px] font-bold mb-1`}>{b.t}</div>
                <p className="font-bold text-[9px] text-orange tracking-wide">{b.b}</p>
                <h5 className="font-bold text-[10px] text-navy mt-0.5 leading-tight">{b.d}</h5>
                <p className="text-[8px] text-gray-400 mt-1 leading-snug flex-1">{b.sub}</p>
              </div>
            ))}
          </div>
          <Footer />
        </div>
      );

    /* ─── B1 CONTEXTO ─── */
    case 'b1x':
      return (
        <div className="slide flex flex-col justify-start p-6" style={{ background: '#f8fafc' }}>
          <SectionTitle eyebrow="BLOQUE 1" title="La situaci\u00f3n actual" />
          <p className="text-xs text-gray-500 -mt-2 mb-3">Hoy gestionamos el talento con informaci\u00f3n incompleta</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { t: 'CVs que no se vuelven a usar', d: 'Los archivos se depositan en carpetas y no se vuelven a consultar. La informaci\u00f3n muere al momento de la contrataci\u00f3n.', c: 'border-red-400' },
              { t: 'Decisiones basadas en t\u00edtulos', d: 'Sabemos qu\u00e9 estudi\u00f3 cada persona, pero no qu\u00e9 sabe hacer hoy. Las credenciales no reflejan la capacidad real.', c: 'border-amber-400' },
              { t: 'Datos fragmentados', d: 'La informaci\u00f3n del personal est\u00e1 dispersa entre GTH, TI, jefaturas y correos. No existe una visi\u00f3n unificada del talento.', c: 'border-amber-400' },
              { t: 'Sin visibilidad de skills ocultos', d: 'Hay expertos en temas clave que nadie conoce porque nunca se ha mapeado lo que realmente saben hacer.', c: 'border-red-400' },
            ].map(card => (
              <div key={card.t} className={`bg-white rounded-lg p-3 shadow-sm border-l-[3px] ${card.c}`}>
                <h4 className="font-bold text-xs text-navy mb-1">{card.t}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{card.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-navy/5 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600 italic">\u201cCENTRUM forma ejecutivos para gestionar organizaciones de clase mundial. Debe gestionar su propio talento con ese mismo nivel de exigencia.\u201d</p>
          </div>
          <Footer />
        </div>
      );

    /* ─── B1 DOS CAPAS ─── */
    case 'b1db':
      return (
        <div className="slide flex flex-col justify-center p-6">
          <SectionTitle eyebrow="BLOQUE 1" title="El sistema tiene dos capas" />
          <p className="text-xs text-gray-500 -mt-2 mb-3">Una para operar el d\u00eda a d\u00eda \u00b7 Otra para tomar decisiones estrat\u00e9gicas</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border-t-[3px] border-orange">
              <p className="text-orange font-bold text-xs mb-2">CAPA OPERATIVA</p>
              <p className="text-[9px] text-gray-500 mb-2">Lo que GTH usa para trabajar d\u00eda a d\u00eda</p>
              <ul className="space-y-1">
                {['Registrar datos', 'Cargar grados / certificaciones', 'Asignar skills', 'Verificar credenciales', 'Gestionar estados y cambios de rol'].map(item => (
                  <li key={item} className="flex items-center gap-1.5 text-xs text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-t-[3px] border-teal">
              <p className="text-teal font-bold text-xs mb-2">CAPA ANAL\u00cdTICA</p>
              <p className="text-[9px] text-gray-500 mb-2">Lo que la Direcci\u00f3n consulta para decidir</p>
              <ul className="space-y-1">
                {['\u00bfQui\u00e9n puede liderar este proyecto?', '\u00bfQu\u00e9 skills nos faltan para 2027?', '\u00bfC\u00f3mo est\u00e1 distribuido el talento?', '\u00bfQui\u00e9n est\u00e1 listo para ascenso?', '\u00bfQu\u00e9 roles tienen mayor brecha?'].map(item => (
                  <li key={item} className="flex items-center gap-1.5 text-xs text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />{item}
                  </li>
                ))}
              </ul>
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
          <p className="text-orange font-bold tracking-[2px] text-[9px] mb-3">DIN\u00c1MICA \u00b7 ESCRITURA SILENCIOSA</p>
          <h2 className="text-2xl font-extrabold text-white mt-2 mb-2">Cuando escuchan People Intelligence...<br />\u00bfqu\u00e9 se imaginan?</h2>
          <p className="text-gray-400 text-sm mb-4">\u23f1 5 minutos \u00b7 Todas las ideas valen \u00b7 Silencio absoluto durante la escritura</p>
          <div className="w-16 h-0.5 bg-orange mb-4" />
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
            <p className="text-xs text-gray-500">Patrones: <b className="text-navy">Centralización</b> · <b className="text-navy">Automatización</b> · <b className="text-navy">Visibilidad</b></p>
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
            <div className="ai-box flex-1">
              <p className="text-[10px] font-bold text-indigo-500 tracking-wider mb-2">GENERADO POR CLAUDE</p>
              <p className="text-sm text-gray-700 leading-relaxed">{synthesis}</p>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Presiona &quot;Generar Síntesis&quot; para analizar las respuestas con IA
            </div>
          )}
          <Footer />
        </div>
      );

    /* ─── B2 INTRO ─── */
    case 'b2w1':
      return (
        <div className="slide-dark flex flex-col items-center justify-center text-center p-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange" />
          <p className="text-orange font-bold tracking-[3px] text-[10px] mb-4">BLOQUE 2</p>
          <h2 className="text-3xl font-extrabold text-white mb-2">Funcionalidades del Sistema</h2>
          <div className="w-16 h-0.5 bg-orange my-3" />
          <p className="text-gray-400 text-sm">Operaciones \u00b7 Preguntas anal\u00edticas por actor</p>
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
              <p className="text-xs text-gray-500">Las acciones del día a día: registrar, actualizar, asignar. Lo que la gente <b>hace</b>.</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-t-[3px] border-teal text-center">
              <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center mx-auto mb-2 text-xl">📊</div>
              <h4 className="text-teal font-bold text-sm mb-1">Preguntas (OLAP)</h4>
              <p className="text-xs text-gray-500">Lo que necesitan responder: ¿cuántos? ¿quiénes? ¿qué falta? Lo que la gente <b>necesita saber</b>.</p>
            </div>
          </div>
          <Footer />
        </div>
      );

    /* ─── B2A CONTEXTO ─── */
    case 'b2ax':
      return (
        <div className="slide flex flex-col justify-start p-6" style={{ background: '#f8fafc' }}>
          <SectionTitle eyebrow="PARTE A" title="Operaciones del sistema" />
          <p className="text-xs text-gray-500 -mt-2 mb-3">Imaginen que llega un nuevo colaborador a CENTRUM. \u00bfQu\u00e9 informaci\u00f3n necesitan registrar? \u00bfC\u00f3mo lo hacen hoy?</p>
          <div className="overflow-auto flex-1 min-h-0">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="bg-orange text-white px-3 py-1.5 text-left text-[9px] w-[70%]">Operaci\u00f3n</th>
                  <th className="bg-orange text-white px-3 py-1.5 text-left text-[9px] w-[30%]">Prioridad</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Registrar datos del nuevo colaborador', 'Cr\u00edtica'],
                  ['Cargar grados acad\u00e9micos y certificaciones', 'Cr\u00edtica'],
                  ['Asignar skills iniciales por puesto', 'Alta'],
                  ['Verificar y validar credenciales', 'Alta'],
                  ['Gestionar cambios de rol o \u00e1rea', 'Media'],
                ].map(([op, pri]) => (
                  <tr key={op} className="border-b border-gray-100">
                    <td className="px-3 py-2 font-semibold text-gray-700">{op}</td>
                    <td className="px-3 py-2"><Badge text={pri} variant={pri === 'Cr\u00edtica' ? 'critical' : pri === 'Alta' ? 'high' : 'medium'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Footer />
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
    case 'b2a2': {
      const items = artifacts?.items || [];
      const moveItem = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
        const next = [...items];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        onUpdateArtifactsItems?.(next);
      };
      const setPriority = (index: number, priority: string) => {
        const next = items.map((it: any, i: number) => (i === index ? { ...it, priority } : it));
        onUpdateArtifactsItems?.(next);
      };
      return (
        <div className="slide flex flex-col justify-start p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Pill text="Bloque 2A · Organizar" bg="#FF6B00" />
              <h2 className="text-lg font-extrabold text-navy mt-1">Priorizar operaciones</h2>
            </div>
            <span className="text-[10px] text-gray-400">{items.length} items</span>
          </div>
          <p className="text-[9px] text-gray-400 mb-2">Arrastra cada fila para reordenar prioridad.</p>
          <div className="overflow-auto flex-1 min-h-0 space-y-1">
            {items.map((item: any, i: number) => (
              <div
                key={i}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', String(i));
                  setDragContext('b2a2');
                  setDragFromIndex(i);
                  setDragOverIndex(i);
                }}
                onDragEnter={() => {
                  if (dragContext === 'b2a2') setDragOverIndex(i);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = Number(e.dataTransfer.getData('text/plain'));
                  moveItem(from, i);
                  resetDrag();
                }}
                onDragEnd={resetDrag}
                className={`flex items-center gap-2 px-2 py-1.5 bg-white rounded-lg border-l-[3px] border-navy shadow-sm transition-all ${
                  dragContext === 'b2a2' && dragFromIndex === i ? 'opacity-55 scale-[0.99]' : ''
                } ${
                  dragContext === 'b2a2' && dragOverIndex === i ? 'ring-2 ring-orange/50 bg-orange/5' : ''
                }`}
              >
                <span className="text-gray-300 text-base cursor-grab shrink-0">⠿</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-[10px] truncate">{item.title}</p>
                  {item.detail && <p className="text-[8px] text-gray-400 truncate">{item.detail}</p>}
                </div>
                <select
                  value={item.priority || 'Media'}
                  onChange={(e) => setPriority(i, e.target.value)}
                  className="shrink-0 text-[8px] font-semibold bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-navy"
                >
                  <option value="Crítica">Crítica</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Futura">Futura</option>
                </select>
              </div>
            ))}
          </div>
          <Footer />
        </div>
      );
    }

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
            <div className="ai-box flex-1">
              <p className="text-[10px] font-bold text-indigo-500 tracking-wider mb-2">GENERADO POR CLAUDE</p>
              <p className="text-sm text-gray-700 leading-relaxed">{synthesis}</p>
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
        <div className="slide flex flex-col justify-start p-6" style={{ background: '#f8fafc' }}>
          <SectionTitle eyebrow="PARTE B" title="Preguntas anal\u00edticas" />
          <p className="text-xs text-gray-500 -mt-2 mb-3">\u00bfQu\u00e9 preguntas debe poder responder el sistema? \u00bfPara qui\u00e9n?</p>
          <div className="overflow-auto flex-1 min-h-0">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="bg-teal text-white px-3 py-1.5 text-left text-[9px] w-[65%]">Pregunta</th>
                  <th className="bg-teal text-white px-3 py-1.5 text-left text-[9px] w-[35%]">Actor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['\u00bfQu\u00e9 skills tiene cada colaborador y en qu\u00e9 nivel?', 'GTH / Direcci\u00f3n'],
                  ['\u00bfQui\u00e9n est\u00e1 listo para asumir el Proyecto X hoy?', 'Direcci\u00f3n'],
                  ['\u00bfQu\u00e9 brecha de skills existe vs. objetivos 2027?', 'Direcci\u00f3n'],
                  ['\u00bfC\u00f3mo evolucionaron mis skills en el \u00faltimo a\u00f1o?', 'Colaborador'],
                  ['\u00bfQu\u00e9 candidatos internos califican para este puesto?', 'GTH'],
                ].map(([q, a]) => (
                  <tr key={q} className="border-b border-gray-100">
                    <td className="px-3 py-2 font-semibold text-gray-700">{q}</td>
                    <td className="px-3 py-2 text-gray-500">{a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {onTriggerSeeds && (
            <button
              onClick={onTriggerSeeds}
              disabled={seedsLoading}
              className="mt-3 self-start px-4 py-2 bg-teal/80 hover:bg-teal text-white rounded-lg text-[11px] font-semibold transition disabled:opacity-50"
            >
              {seedsLoading ? '\u23f3 Generando semillas\u2026' : '\uD83E\uDD16 Pre-generar preguntas con IA'}
            </button>
          )}
          <Footer />
        </div>
      );

    /* ─── B2B ACTORES ─── */
    case 'b2bx2':
      return (
        <div className="slide flex flex-col justify-center p-6">
          <SectionTitle eyebrow="PARTE B" title="Actores del sistema" />
          <p className="text-xs text-gray-500 -mt-2 mb-3">Si el sistema ya existiera y tuviera toda la informaci\u00f3n... \u00bfqu\u00e9 le preguntar\u00edan?</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { a: '👤', n: 'Colaborador', d: 'Quiere saber en qu\u00e9 nivel est\u00e1 y c\u00f3mo crecer en su carrera dentro de CENTRUM.', c: 'bg-blue-50 border-blue-200', tc: 'text-blue-700' },
              { a: '🏢', n: 'GTH', d: 'Necesita visibilidad completa del talento para tomar decisiones sobre contrataci\u00f3n y desarrollo.', c: 'bg-green-50 border-green-200', tc: 'text-green-700' },
              { a: '📊', n: 'Direcci\u00f3n', d: 'Requiere analytics de alto nivel para alinear el talento a los objetivos estrat\u00e9gicos 2027.', c: 'bg-purple-50 border-purple-200', tc: 'text-purple-700' },
              { a: '🔗', n: 'Otros', d: 'Coordinadores acad\u00e9micos, investigadores, jefes de proyecto con necesidades espec\u00edficas.', c: 'bg-gray-50 border-gray-200', tc: 'text-gray-700' },
            ].map(actor => (
              <div key={actor.n} className={`rounded-lg p-3 border ${actor.c} text-center`}>
                <p className="text-2xl mb-1">{actor.a}</p>
                <h5 className={`font-bold text-sm ${actor.tc}`}>{actor.n}</h5>
                <p className="text-[9px] text-gray-500 mt-1 leading-snug">{actor.d}</p>
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
    case 'b2b2': {
      const items = artifacts?.items || [];
      const moveItem = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
        const next = [...items];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        onUpdateArtifactsItems?.(next);
      };
      return (
        <div className="slide flex flex-col justify-start p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Pill text="Bloque 2B · Organizar" bg="#0D9488" />
              <h2 className="text-lg font-extrabold text-navy mt-1">Organizar preguntas</h2>
            </div>
            <span className="text-[10px] text-gray-400">{items.length} items</span>
          </div>
          <p className="text-[9px] text-gray-400 mb-2">Arrastra para cambiar el orden de lectura.</p>
          <div className="overflow-auto flex-1 min-h-0 space-y-1">
            {items.map((item: any, i: number) => (
              <div
                key={i}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', String(i));
                  setDragContext('b2b2');
                  setDragFromIndex(i);
                  setDragOverIndex(i);
                }}
                onDragEnter={() => {
                  if (dragContext === 'b2b2') setDragOverIndex(i);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = Number(e.dataTransfer.getData('text/plain'));
                  moveItem(from, i);
                  resetDrag();
                }}
                onDragEnd={resetDrag}
                className={`flex items-center gap-2 px-2 py-1.5 bg-white rounded-lg border-l-[3px] border-teal shadow-sm transition-all ${
                  dragContext === 'b2b2' && dragFromIndex === i ? 'opacity-55 scale-[0.99]' : ''
                } ${
                  dragContext === 'b2b2' && dragOverIndex === i ? 'ring-2 ring-teal/45 bg-teal/5' : ''
                }`}
              >
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
    }

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
            <div className="ai-box flex-1">
              <p className="text-[10px] font-bold text-indigo-500 tracking-wider mb-2">GENERADO POR CLAUDE</p>
              <p className="text-sm text-gray-700 leading-relaxed">{synthesis}</p>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Presiona &quot;Generar Síntesis&quot; para analizar las preguntas con IA
            </div>
          )}
          <Footer />
        </div>
      );

    /* ─── B3 INTRO ─── */
    case 'b3w1':
      return (
        <div className="slide-dark flex flex-col items-center justify-center text-center p-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-teal" />
          <p className="text-teal font-bold tracking-[3px] text-[10px] mb-4">BLOQUE 3</p>
          <h2 className="text-3xl font-extrabold text-white mb-2">Campos de Datos y Fuentes</h2>
          <div className="w-16 h-0.5 bg-teal my-3" />
          <p className="text-gray-400 text-sm mb-4">Sin datos no hay operaciones ni preguntas posibles.</p>
          {onTriggerSeeds && (
            <button
              onClick={onTriggerSeeds}
              disabled={seedsLoading}
              className="mt-2 px-4 py-2 bg-teal/80 hover:bg-teal text-white rounded-lg text-[11px] font-semibold transition disabled:opacity-50"
            >
              {seedsLoading ? '⏳ Generando campos…' : '🤖 Pre-generar campos con IA'}
            </button>
          )}
        </div>
      );

    /* ─── B3 DIMENSIONES ─── */
    case 'b3w2':
      return (
        <div className="slide flex flex-col justify-center p-6">
          <SectionTitle eyebrow="BLOQUE 3" title="Las tres dimensiones de cada campo" />
          <p className="text-xs text-gray-500 -mt-2 mb-4">De cada dato necesitamos saber tres cosas</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
              <h5 className="font-bold text-sm text-navy mb-1">\u00bfQu\u00e9 es?</h5>
              <p className="text-[9px] text-gray-500 mb-2">Definici\u00f3n del campo. Nombre y descripci\u00f3n del dato.</p>
              <p className="text-[8px] text-orange italic">Ej: Horas de capacitaci\u00f3n anual por colaborador.</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
              <h5 className="font-bold text-sm text-navy mb-1">\u00bfD\u00f3nde est\u00e1 hoy?</h5>
              <p className="text-[9px] text-gray-500 mb-2">Fuente actual. \u00bfGTH lo tiene? \u00bfViene de otra \u00e1rea? \u00bfNo existe a\u00fan?</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {['GTH lo tiene', 'Otra fuente', 'No existe a\u00fan'].map(b => (
                  <span key={b} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[7px] font-semibold">{b}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <div className="w-8 h-8 rounded-full bg-orange text-white flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
              <h5 className="font-bold text-sm text-navy mb-1">\u00bfQu\u00e9 tan urgente?</h5>
              <p className="text-[9px] text-gray-500 mb-2">Prioridad de implementaci\u00f3n.</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {['Cr\u00edtica', 'Alta', 'Media', 'Futura'].map(b => (
                  <span key={b} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[7px] font-semibold">{b}</span>
                ))}
              </div>
            </div>
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
            <div className="ai-box flex-1">
              <p className="text-[10px] font-bold text-indigo-500 tracking-wider mb-2">GENERADO POR CLAUDE</p>
              <p className="text-sm text-gray-700 leading-relaxed">{synthesis}</p>
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
          <SectionTitle eyebrow="BLOQUE 4" title="C\u00f3mo gestionamos el proyecto" />
          <p className="text-xs text-gray-500 -mt-2 mb-3">Modelo h\u00edbrido: gobernanza formal + ejecuci\u00f3n \u00e1gil</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border-t-[3px] border-navy">
              <p className="text-navy font-bold text-xs mb-2">GOBERNANZA FORMAL</p>
              <ul className="space-y-1.5">
                {['Project Charter (firmado por GTH y SC)', 'Actas de reuni\u00f3n (ACT-PIS-XXX)', 'Entregables con versiones', 'Sponsor institucional: Andrea Lazarte'].map(item => (
                  <li key={item} className="flex items-start gap-1.5 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-navy shrink-0 mt-1" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-t-[3px] border-orange">
              <p className="text-orange font-bold text-xs mb-2">EJECUCI\u00d3N \u00c1GIL</p>
              <ul className="space-y-1.5">
                {['Reuni\u00f3n semanal SC \u00d7 GTH (30 min, d\u00eda por definir)', 'Sprints de 2 semanas', 'Herramientas compartidas: Notion + Google Drive'].map(item => (
                  <li key={item} className="flex items-start gap-1.5 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange shrink-0 mt-1" />{item}
                  </li>
                ))}
              </ul>
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
          <p className="text-xs text-gray-500 mb-2">El proyecto tiene un charter aprobado y estamos transitando de Iniciación a Planificación. Los insumos de hoy alimentan directamente los artefactos de planificación.</p>
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
          <SectionTitle eyebrow="BLOQUE 4" title="C\u00f3mo gestionaremos el proyecto" />
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-white rounded-xl p-5 shadow-sm border-t-[3px] border-navy text-center">
              <h4 className="text-navy font-bold text-lg mb-2">Notion</h4>
              <p className="text-sm text-gray-500">Gesti\u00f3n de tareas, backlog, seguimiento de decisiones y avances del proyecto.</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border-t-[3px] border-teal text-center">
              <h4 className="text-teal font-bold text-lg mb-2">Google Drive</h4>
              <p className="text-sm text-gray-500">Documentos compartidos: actas, entregables, archivos de referencia. Accesos compartidos hoy.</p>
            </div>
          </div>
          <Footer />
        </div>
      );

    /* ─── B4 FASES ─── */
    case 'b4p':
      return (
        <div className="slide flex flex-col justify-start p-6" style={{ background: '#f8fafc' }}>
          <SectionTitle eyebrow="BLOQUE 4" title="Timeline del proyecto" />
          <p className="text-xs text-gray-500 -mt-2 mb-3">De la prueba de concepto al sistema en producci\u00f3n</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                n: '01', t: 'Prueba de concepto', w: 'Mar\u2013May 2026',
                items: ['Taxonom\u00eda WEF + Nivel 5 CENTRUM', 'Dashboard grados (quick win)', 'Piloto 10\u201315 personas'],
                deliverables: ['Instrumento Google Forms', 'Lista de participantes validada', 'Spot-check de supervisores', 'PoC Report para Direcci\u00f3n General'],
                c: 'bg-orange', badge: 'ESTAMOS AQU\u00cd',
              },
              {
                n: '02', t: 'Skills analytics', w: 'May\u2013Jul 2026',
                items: ['Inventario skills 100%', 'Dashboard analytics', 'Gap analysis vs. objetivos 2027'],
                deliverables: null,
                c: 'bg-navy', badge: null,
              },
              {
                n: '03', t: 'Inteligencia predictiva', w: 'Jul\u2013Ago 2026',
                items: ['Motor asignaci\u00f3n inteligente', 'Gap analysis predictivo', 'Sistema en producci\u00f3n'],
                deliverables: null,
                c: 'bg-teal', badge: null,
              },
            ].map(f => (
              <div key={f.n} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className={`${f.c} px-3 py-2`}>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-[9px] font-bold">{f.n}</span>
                    {f.badge && <span className="bg-white/20 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full">{f.badge}</span>}
                  </div>
                  <p className="text-white font-bold text-xs">{f.t}</p>
                  <p className="text-white/70 text-[8px]">{f.w}</p>
                </div>
                <div className="p-3">
                  <ul className="space-y-1 mb-2">
                    {f.items.map(item => (
                      <li key={item} className="flex items-start gap-1 text-[9px] text-gray-600">
                        <span className="text-gray-300 mt-0.5">·</span>{item}
                      </li>
                    ))}
                  </ul>
                  {f.deliverables && (
                    <div className="border-t border-gray-100 pt-2">
                      <p className="text-[8px] font-bold text-orange mb-1">ENTREGABLES CLAVE</p>
                      {f.deliverables.map(d => (
                        <p key={d} className="text-[8px] text-gray-500">\u2192 {d}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
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
          <p className="text-gray-300 text-sm mt-2 max-w-md leading-relaxed">\u201cLo que construimos hoy es el cimiento del sistema que gestionar\u00e1 el talento de CENTRUM.\u201d</p>
          <div className="w-16 h-0.5 bg-orange my-4" />
          <p className="text-orange font-bold text-[9px] tracking-wide mb-3">Documentos que se generar\u00e1n y compartir\u00e1n con GTH:</p>
          <div className="flex gap-2 flex-wrap justify-center">
            <span className="px-3 py-1.5 rounded-lg bg-orange text-white text-[10px] font-bold cursor-pointer hover:scale-105 transition-transform">Acta de la reuni\u00f3n (ACT-PIS-004)</span>
            <span className="px-3 py-1.5 rounded-lg bg-navy text-white text-[10px] font-bold cursor-pointer hover:scale-105 transition-transform">S\u00edntesis de Funcionalidades</span>
            <span className="px-3 py-1.5 rounded-lg bg-teal text-white text-[10px] font-bold cursor-pointer hover:scale-105 transition-transform">Inventario de Campos de Datos</span>
            <span className="px-3 py-1.5 rounded-lg bg-gray-700 text-white text-[10px] font-bold cursor-pointer hover:scale-105 transition-transform">Compromisos y Pr\u00f3ximos Pasos</span>
          </div>
          <p className="text-gray-500 text-[8px] mt-4">People Intelligence \u00b7 Smart Centrum \u00d7 GTH \u00b7 CENTRUM PUCP \u00b7 27.03.2026</p>
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
