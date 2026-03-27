export interface Stage {
  id: string;
  label: string;
  color: string;
  block: string | null;
  interaction: 'none' | 'write' | 'multi_add' | 'organize' | 'links';
}

export const STAGES: Stage[] = [
  { id: 'cover', label: '🎯 Portada', color: '#003865', block: null, interaction: 'none' },
  { id: 'qr', label: '📱 QR', color: '#003865', block: null, interaction: 'none' },
  { id: 'team', label: '👥 Equipo', color: '#003865', block: null, interaction: 'none' },
  { id: 'agenda', label: '📋 Agenda', color: '#003865', block: null, interaction: 'none' },
  // Intro + B0 — Apertura / Resumen del Proyecto
  { id: 'intro',    label: '👥 Equipo SC + GTH', color: '#003865', block: null, interaction: 'none' },
  { id: 'b0div',    label: '📋 B0 Resumen',      color: '#FF6B00', block: 'B0', interaction: 'none' },
  { id: 'b0world',  label: 'B0 Contexto',        color: '#FF6B00', block: 'B0', interaction: 'none' },
  { id: 'b0skl',    label: 'B0 Skills-first',    color: '#FF6B00', block: 'B0', interaction: 'none' },
  { id: 'b0pi',     label: 'B0 PI Qué es',       color: '#FF6B00', block: 'B0', interaction: 'none' },
  { id: 'b0use',    label: 'B0 Usos',            color: '#FF6B00', block: 'B0', interaction: 'none' },
  { id: 'b0wef',    label: 'B0 WEF',             color: '#FF6B00', block: 'B0', interaction: 'none' },
  { id: 'b0phases', label: 'B0 Fases',           color: '#FF6B00', block: 'B0', interaction: 'none' },
  { id: 'b0scope',  label: 'B0 Alcance',         color: '#FF6B00', block: 'B0', interaction: 'none' },
  { id: 'b1div',    label: '📌 B1 Inicio',       color: '#003865', block: 'B1', interaction: 'none' },
  // B1 — Descubrir
  { id: 'b1x', label: 'B1 Contexto', color: '#003865', block: 'B1', interaction: 'none' },
  { id: 'b1db', label: 'B1 OLTP/OLAP', color: '#003865', block: 'B1', interaction: 'none' },
  { id: 'b1q', label: 'B1 Pregunta', color: '#003865', block: 'B1', interaction: 'none' },
  { id: 'b1w', label: 'B1 Escribir', color: '#003865', block: 'B1', interaction: 'write' },
  { id: 'b1s', label: 'B1 Compartir', color: '#003865', block: 'B1', interaction: 'none' },
  { id: 'b1y', label: 'B1 Síntesis', color: '#003865', block: 'B1', interaction: 'none' },
  // B2A — Funcionalidades (Operaciones)
  { id: 'b2w1', label: 'B2 ¿Por qué?', color: '#FF6B00', block: 'B2A', interaction: 'none' },
  { id: 'b2w2', label: 'B2 Dos capas', color: '#FF6B00', block: 'B2A', interaction: 'none' },
  { id: 'b2ax', label: 'B2A Contexto', color: '#FF6B00', block: 'B2A', interaction: 'none' },
  { id: 'b2a', label: 'B2A Agregar', color: '#FF6B00', block: 'B2A', interaction: 'multi_add' },
  { id: 'b2a2', label: 'B2A Organizar', color: '#FF6B00', block: 'B2A', interaction: 'organize' },
  { id: 'b2ay', label: 'B2A Síntesis', color: '#FF6B00', block: 'B2A', interaction: 'none' },
  // B2B — Funcionalidades (Preguntas)
  { id: 'b2bx1', label: 'B2B Contexto', color: '#FF6B00', block: 'B2B', interaction: 'none' },
  { id: 'b2bx2', label: 'B2B Actores', color: '#FF6B00', block: 'B2B', interaction: 'none' },
  { id: 'b2b', label: 'B2B Agregar', color: '#FF6B00', block: 'B2B', interaction: 'multi_add' },
  { id: 'b2b2', label: 'B2B Organizar', color: '#FF6B00', block: 'B2B', interaction: 'organize' },
  { id: 'b2by', label: 'B2B Síntesis', color: '#FF6B00', block: 'B2B', interaction: 'none' },
  // B3 — Datos
  { id: 'b3w1', label: 'B3 ¿Por qué?', color: '#0D9488', block: 'B3', interaction: 'none' },
  { id: 'b3w2', label: 'B3 Dimensiones', color: '#0D9488', block: 'B3', interaction: 'none' },
  { id: 'b3', label: 'B3 Agregar', color: '#0D9488', block: 'B3', interaction: 'multi_add' },
  { id: 'b3fp', label: 'B3 Fuente+Prior', color: '#0D9488', block: 'B3', interaction: 'organize' },
  { id: 'b3y', label: 'B3 Síntesis', color: '#0D9488', block: 'B3', interaction: 'none' },
  // B4 — Gestión
  { id: 'b4div', label: '📋 B4 Gestión', color: '#059669', block: 'B4', interaction: 'none' },
  { id: 'b4w1', label: 'B4 Gestión', color: '#059669', block: 'B4', interaction: 'none' },
  { id: 'b4w2', label: 'B4 Manual', color: '#059669', block: 'B4', interaction: 'none' },
  { id: 'b4t', label: 'B4 Herramientas', color: '#059669', block: 'B4', interaction: 'links' },
  { id: 'b4p', label: 'B4 Fases', color: '#059669', block: 'B4', interaction: 'none' },
  { id: 'b4n', label: 'B4 Pasos', color: '#059669', block: 'B4', interaction: 'none' },
  // Cierre
  { id: 'qa', label: '❓ Preguntas', color: '#003865', block: null, interaction: 'none' },
  { id: 'thx', label: '🎉 Cierre', color: '#003865', block: null, interaction: 'none' },
];

export function getStageIndex(stageId: string): number {
  return STAGES.findIndex(s => s.id === stageId);
}

export function getStageById(stageId: string): Stage | undefined {
  return STAGES.find(s => s.id === stageId);
}
