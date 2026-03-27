'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { STAGES, getStageById } from '@/lib/stages';

interface Session {
  id: string;
  title: string;
  current_stage: string;
  created_at: string;
  status: string;
  participant_count: number;
}

function stageProgress(stageId: string) {
  const idx = STAGES.findIndex(s => s.id === stageId);
  return { idx: idx >= 0 ? idx : 0, total: STAGES.length };
}

function statusBadge(s: Session) {
  if (s.status === 'archived') return { text: 'Archivada', cls: 'bg-gray-100 text-gray-500' };
  const { idx, total } = stageProgress(s.current_stage);
  if (idx === 0) return { text: 'Nueva', cls: 'bg-blue-100 text-blue-700' };
  if (idx >= total - 1) return { text: 'Completada', cls: 'bg-green-100 text-green-700' };
  return { text: 'En curso', cls: 'bg-orange/10 text-orange' };
}

export default function WorkshopLobby() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('Workshop PIS — Cocreación con GTH');
  const [creating, setCreating] = useState(false);

  // Inline rename
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const loadSessions = () => {
    setLoading(true);
    fetch('/api/workshop/list')
      .then(r => r.json())
      .then(d => setSessions(d.sessions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadSessions(); }, []);

  async function createSession() {
    setCreating(true);
    try {
      const res = await fetch('/api/workshop/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() || 'Workshop PIS' }),
      });
      const data = await res.json();
      if (data.id) router.push(`/workshop/${data.id}/facilitate`);
    } catch {
      alert('Error creando sesión');
    } finally {
      setCreating(false);
    }
  }

  async function patchSession(id: string, patch: Record<string, string>) {
    await fetch(`/api/workshop/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    loadSessions();
  }

  async function saveTitle(id: string) {
    if (!editTitle.trim()) return setEditingId(null);
    await patchSession(id, { title: editTitle.trim() });
    setEditingId(null);
  }

  const visible = sessions.filter(s =>
    showArchived ? s.status === 'archived' : s.status !== 'archived'
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--off)' }}>
      {/* ── Header ── */}
      <header className="bg-navy text-white px-6 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="/logos/logo-blanco-centrum-pucp-v3.png"
            alt="CENTRUM PUCP"
            className="h-5 w-auto opacity-80"
          />
          <span className="text-white/30 mx-1">|</span>
          <span className="text-sm text-white/60 font-medium">Workshop Live</span>
        </div>
        <button
          onClick={() => {
            setNewTitle('Workshop PIS — Cocreación con GTH');
            setShowCreate(true);
          }}
          className="px-4 py-2 bg-orange text-white rounded-xl font-semibold text-sm hover:bg-orange/90 transition"
        >
          + Nueva sesión
        </button>
      </header>

      {/* ── Main ── */}
      <main className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-title text-xl font-bold text-navy">Registro de sesiones</h1>
          <button
            onClick={() => setShowArchived(v => !v)}
            className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
              showArchived
                ? 'bg-gray-700 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {showArchived ? '← Ver activas' : 'Ver archivadas'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Cargando sesiones…</div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-base mb-4">
              {showArchived ? 'No hay sesiones archivadas' : 'No hay sesiones activas'}
            </p>
            {!showArchived && (
              <button
                onClick={() => setShowCreate(true)}
                className="px-6 py-2.5 bg-navy text-white rounded-xl font-semibold text-sm hover:bg-navy/90 transition"
              >
                Crear primera sesión
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map(s => {
              const { idx, total } = stageProgress(s.current_stage);
              const pct = Math.round((idx / (total - 1)) * 100);
              const stageLabel = getStageById(s.current_stage)?.label ?? s.current_stage;
              const badge = statusBadge(s);
              const isEditing = editingId === s.id;

              return (
                <div key={s.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  {/* Row 1: title + badge */}
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveTitle(s.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            className="flex-1 border border-navy/30 rounded-lg px-2 py-0.5 text-sm font-semibold text-navy focus:outline-none focus:ring-1 focus:ring-navy/40"
                          />
                          <button
                            onClick={() => saveTitle(s.id)}
                            className="text-[10px] bg-navy text-white px-2 py-1 rounded-md"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-[10px] text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-navy text-sm truncate">{s.title}</h3>
                          <button
                            onClick={() => { setEditingId(s.id); setEditTitle(s.title); }}
                            className="text-gray-300 hover:text-gray-500 text-[11px] leading-none shrink-0"
                            title="Renombrar"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(s.created_at).toLocaleDateString('es-PE', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                        {' · '}
                        {new Date(s.created_at).toLocaleTimeString('es-PE', {
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>
                      {badge.text}
                    </span>
                  </div>

                  {/* Row 2: stage progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] text-gray-400 truncate">{stageLabel}</span>
                      <span className="text-[9px] text-gray-400 shrink-0 ml-2 tabular-nums">
                        {idx + 1} / {total}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: '#FF6B00', transition: 'width 0.4s' }}
                      />
                    </div>
                  </div>

                  {/* Row 3: participants + actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">
                      👥 {s.participant_count} participante{s.participant_count !== 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/workshop/${s.id}/participate`;
                          navigator.clipboard.writeText(url).then(() => {}).catch(() => {});
                        }}
                        title="Copiar link de participante"
                        className="px-3 py-1 rounded-lg text-[10px] font-semibold bg-teal/10 text-teal hover:bg-teal/20 transition"
                      >
                        📋 Link
                      </button>
                      {s.status !== 'archived' ? (
                        <>
                          <button
                            onClick={() => patchSession(s.id, { status: 'archived' })}
                            className="px-3 py-1 rounded-lg text-[10px] font-semibold bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                          >
                            Archivar
                          </button>
                          <button
                            onClick={() => router.push(`/workshop/${s.id}/facilitate`)}
                            className="px-4 py-1 rounded-lg text-[10px] font-bold bg-navy text-white hover:bg-navy/90 transition"
                          >
                            Continuar →
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => patchSession(s.id, { status: 'active' })}
                          className="px-3 py-1 rounded-lg text-[10px] font-semibold bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                        >
                          Restaurar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Create session modal ── */}
      {showCreate && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowCreate(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="font-title text-lg font-bold text-navy mb-1">Nueva sesión</h2>
            <p className="text-xs text-gray-400 mb-4">El nombre aparecerá en el registro y en la portada.</p>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre de la sesión</label>
            <input
              autoFocus
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !creating) createSession(); }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm mb-5 focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
              placeholder="Ej: Workshop PIS — Sesión 2"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={createSession}
                disabled={creating || !newTitle.trim()}
                className="flex-1 py-2.5 bg-orange text-white rounded-xl text-sm font-semibold hover:bg-orange/90 transition disabled:opacity-50"
              >
                {creating ? 'Creando…' : 'Crear y facilitar →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
