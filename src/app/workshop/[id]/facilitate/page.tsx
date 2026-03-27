'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { STAGES } from '@/lib/stages';
import FacilitatorSlide from '@/components/FacilitatorSlide';

const BASE_W = 960;
const BASE_H = 540;
const TOP_BAR_H = 44;

export default function FacilitatePage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [stageIdx, setStageIdx] = useState(0);
  const [stageLoaded, setStageLoaded] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [artifacts, setArtifacts] = useState<any>(null);
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [synthLoading, setSynthLoading] = useState(false);
  const [seedsLoading, setSeedsLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [hiddenStages, setHiddenStages] = useState<Set<string>>(new Set());
  const [showConfig, setShowConfig] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const stage = STAGES[stageIdx];
  const visibleStages = STAGES.filter(s => !hiddenStages.has(s.id));
  const visibleIdx = visibleStages.findIndex(s => s.id === stage?.id);

  // Restore saved stage from DB on mount
  useEffect(() => {
    fetch(`/api/workshop/${sessionId}/stage`)
      .then(r => r.json())
      .then(data => {
        if (data.stage) {
          const idx = STAGES.findIndex(s => s.id === data.stage);
          if (idx >= 0) setStageIdx(idx);
        }
      })
      .catch(() => {})
      .finally(() => setStageLoaded(true));
  }, [sessionId]);

  // Calculate scale to fit below the top bar
  useEffect(() => {
    const calc = () => {
      const sw = window.innerWidth / BASE_W;
      const sh = (window.innerHeight - TOP_BAR_H) / BASE_H;
      setScale(Math.min(sw, sh));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Load hidden stages from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`hidden_stages_${sessionId}`);
      if (saved) setHiddenStages(new Set(JSON.parse(saved)));
    } catch {}
  }, [sessionId]);

  // Poll participants
  useEffect(() => {
    const fetchParticipants = () => {
      fetch(`/api/workshop/${sessionId}/participants`)
        .then(r => r.json())
        .then(d => setParticipants(d.participants || []))
        .catch(() => {});
    };
    fetchParticipants();
    const interval = setInterval(fetchParticipants, 5000);
    return () => clearInterval(interval);
  }, [sessionId]);

  // Change stage in DB
  const changeStage = useCallback(async (idx: number) => {
    setStageIdx(idx);
    setSynthesis(null);
    const s = STAGES[idx];
    await fetch(`/api/workshop/${sessionId}/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: s.id }),
    }).catch(() => {});
  }, [sessionId]);

  // Poll responses/artifacts for interactive stages
  useEffect(() => {
    if (!stage) return;
    const inter = stage.interaction;
    if (inter === 'none' && !['b1s', 'b1y', 'b2ay', 'b2by', 'b3y'].includes(stage.id)) return;

    const fetchData = async () => {
      // Fetch responses for write stages
      if (inter === 'write' || stage.id === 'b1s' || stage.id === 'b1y') {
        const block = 'b1_write';
        const res = await fetch(`/api/workshop/${sessionId}/responses?block=${block}`).then(r => r.json()).catch(() => ({ responses: [] }));
        setResponses(res.responses || []);
      }

      // Fetch artifacts for multi_add / organize stages
      if (inter === 'multi_add' || inter === 'organize' || ['b2ay', 'b2by', 'b3y', 'b2a2', 'b2b2', 'b3fp', 'b4n'].includes(stage.id)) {
        let artifactType = '';
        if (['b2a', 'b2a2', 'b2ax', 'b2ay'].includes(stage.id)) artifactType = 'operations';
        else if (['b2b', 'b2b2', 'b2bx1', 'b2bx2', 'b2by'].includes(stage.id)) artifactType = 'questions';
        else if (['b3', 'b3fp', 'b3y'].includes(stage.id)) artifactType = 'data_fields';
        else if (stage.id === 'b4n') artifactType = 'next_steps';

        if (artifactType) {
          const res = await fetch(`/api/workshop/${sessionId}/artifacts/${artifactType}`).then(r => r.json()).catch(() => ({ artifact: null }));
          setArtifacts(res.artifact?.payload || null);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [sessionId, stage]);

  // Trigger AI synthesis
  const triggerSynthesis = async () => {
    setSynthLoading(true);
    try {
      let block = '';
      if (stage.id === 'b1y') block = 'b1';
      else if (stage.id === 'b2ay') block = 'b2a';
      else if (stage.id === 'b2by') block = 'b2b';
      else if (stage.id === 'b3y') block = 'b3';

      const res = await fetch(`/api/workshop/${sessionId}/ai/synth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block }),
      });
      const data = await res.json();
      setSynthesis(data.synthesis || 'Sin respuesta de IA');
    } catch {
      setSynthesis('Error generando síntesis');
    } finally {
      setSynthLoading(false);
    }
  };

  // Trigger AI seeds (pre-generate items for B2B or B3)
  const handleGenerateSeeds = async () => {
    setSeedsLoading(true);
    try {
      let block = '';
      if (stage.id === 'b2bx1') block = 'b2b';
      else if (stage.id === 'b3w1') block = 'b3';

      await fetch(`/api/workshop/${sessionId}/ai/seeds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block }),
      });
    } catch {
      // silent fail — seeds are optional
    } finally {
      setSeedsLoading(false);
    }
  };

  // Export PDF
  const handleExport = async (type: string) => {
    setExportLoading(type);
    try {
      const res = await fetch(`/api/workshop/${sessionId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Workshop_PIS_${type}_${new Date().toISOString().slice(0,10)}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      alert('Error exportando');
    } finally {
      setExportLoading(null);
    }
  };

  // Navigate to next/prev visible stage
  const goNext = useCallback(() => {
    for (let i = stageIdx + 1; i < STAGES.length; i++) {
      if (!hiddenStages.has(STAGES[i].id)) { changeStage(i); return; }
    }
  }, [stageIdx, hiddenStages, changeStage]);

  const goPrev = useCallback(() => {
    for (let i = stageIdx - 1; i >= 0; i--) {
      if (!hiddenStages.has(STAGES[i].id)) { changeStage(i); return; }
    }
  }, [stageIdx, hiddenStages, changeStage]);

  const toggleStageVisibility = useCallback((id: string) => {
    setHiddenStages(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(`hidden_stages_${sessionId}`, JSON.stringify([...next]));
      return next;
    });
  }, [sessionId]);

  // Persist artifact changes from organize slides (drag/drop and priority updates)
  const updateArtifactsItems = useCallback(async (items: any[]) => {
    if (!stage?.id) return;

    let artifactType = '';
    if (['b2a', 'b2a2', 'b2ax', 'b2ay'].includes(stage.id)) artifactType = 'operations';
    else if (['b2b', 'b2b2', 'b2bx1', 'b2bx2', 'b2by'].includes(stage.id)) artifactType = 'questions';
    else if (['b3', 'b3fp', 'b3y'].includes(stage.id)) artifactType = 'data_fields';
    else if (stage.id === 'b4n') artifactType = 'next_steps';

    if (!artifactType) return;

    // Optimistic UI update
    setArtifacts({ items });

    try {
      await fetch(`/api/workshop/${sessionId}/artifacts/${artifactType}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: { items } }),
      });
    } catch {
      // Silent fail; periodic polling will restore latest server state
    }
  }, [sessionId, stage?.id]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') setShowConfig(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  return (
    <div ref={containerRef} className="h-screen w-screen bg-black overflow-hidden flex flex-col">

      {/* ── TOP BAR ── */}
      <div
        style={{ height: `${TOP_BAR_H}px` }}
        className="shrink-0 flex items-center justify-between px-4 bg-gray-950 border-b border-white/10 z-50"
      >
        {/* Left: prev */}
        <button
          onClick={goPrev}
          disabled={visibleIdx <= 0}
          className="px-4 py-1.5 bg-navy/80 text-white rounded-lg text-xs font-semibold disabled:opacity-20 hover:bg-navy transition-all"
        >
          ← Anterior
        </button>

        {/* Center: counter + config + stage label */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-2 py-1 rounded-md text-[11px] text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title="Configurar láminas"
          >
            ⚙️
          </button>
          <span className="px-3 py-1 bg-white/10 rounded-full text-[11px] text-gray-300 font-medium tabular-nums">
            {visibleIdx + 1} / {visibleStages.length}
          </span>
          <span className="text-[11px] text-gray-500 hidden sm:block truncate max-w-[200px]">
            {stage?.label}
          </span>
        </div>

        {/* Right: next + export (on thx) */}
        <div className="flex items-center gap-2">
          {stage?.id === 'thx' && [
            { type: 'acta', label: 'Acta', bg: 'bg-orange' },
            { type: 'funcionalidades', label: 'Func.', bg: 'bg-navy' },
            { type: 'campos', label: 'Campos', bg: 'bg-teal' },
            { type: 'pasos', label: 'Pasos', bg: 'bg-gray-700' },
          ].map(btn => (
            <button
              key={btn.type}
              onClick={() => handleExport(btn.type)}
              disabled={exportLoading === btn.type}
              className={`${btn.bg} text-white px-2.5 py-1 rounded-md text-[10px] font-bold hover:opacity-90 disabled:opacity-50`}
            >
              {exportLoading === btn.type ? '…' : `📄 ${btn.label}`}
            </button>
          ))}
          <button
            onClick={goNext}
            disabled={visibleIdx >= visibleStages.length - 1}
            className="px-4 py-1.5 bg-orange/90 text-white rounded-lg text-xs font-semibold disabled:opacity-20 hover:bg-orange transition-all"
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* ── SLIDE AREA ── */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div
          style={{
            width: `${BASE_W}px`,
            height: `${BASE_H}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {!stageLoaded ? (
            <div className="w-full h-full bg-navy flex items-center justify-center">
              <span className="text-white/50 text-sm">Cargando sesión…</span>
            </div>
          ) : (
            <FacilitatorSlide
              stageId={stage?.id || 'cover'}
              sessionId={sessionId}
              responses={responses}
              artifacts={artifacts}
              synthesis={synthesis}
              participants={participants}
              onTriggerSynthesis={triggerSynthesis}
              synthLoading={synthLoading}
              onTriggerSeeds={['b2bx1', 'b3w1'].includes(stage?.id) ? handleGenerateSeeds : undefined}
              seedsLoading={seedsLoading}
              onUpdateArtifactsItems={updateArtifactsItems}
            />
          )}
        </div>
      </div>

      {/* ── SLIDE CONFIG PANEL ── */}
      {showConfig && (
        <div className="absolute top-0 left-0 bottom-0 w-[260px] bg-gray-900/95 backdrop-blur-sm z-[60] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h3 className="text-white text-sm font-bold">Láminas</h3>
            <button onClick={() => setShowConfig(false)} className="text-gray-400 hover:text-white text-lg">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
            {STAGES.map(s => (
              <label
                key={s.id}
                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-[11px] transition-all ${
                  stage?.id === s.id ? 'bg-orange/20 text-orange' : 'text-gray-300 hover:bg-gray-800'
                } ${hiddenStages.has(s.id) ? 'opacity-40 line-through' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={!hiddenStages.has(s.id)}
                  onChange={() => toggleStageVisibility(s.id)}
                  className="accent-orange w-3 h-3"
                />
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="truncate">{s.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
