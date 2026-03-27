export const SEED_OPERATIONS = [
  { title: 'Registrar datos del personal', detail: 'Alta, baja, actualización de información básica', process: 'Onboarding / Admin. personal', origin: 'seed' },
  { title: 'Cargar grados académicos', detail: 'Títulos, universidades, fechas, documentos de respaldo', process: 'Gestión de legajos', origin: 'seed' },
  { title: 'Asignar y validar skills', detail: 'Autorreporte del colaborador + aprobación de GTH', process: 'Desarrollo de talento', origin: 'seed' },
  { title: 'Verificar credenciales', detail: 'Consulta SUNEDU, tokens de verificación', process: 'Verificación de antecedentes', origin: 'seed' },
  { title: 'Gestionar estados', detail: 'Activo, licencia, cesado (nunca borrar, solo cambiar estado — soft delete)', process: 'Admin. personal', origin: 'seed' },
];

export const SEED_NEXT_STEPS = [
  { action: 'Consolidar insumos del workshop', responsible: 'JZ', deadline: '28/03' },
  { action: 'Matriz de coherencia transaccional ↔ analítica', responsible: 'RN + JZ', deadline: 'Sem. 31/03' },
  { action: 'Schema de datos v0.1 (DBML)', responsible: 'JZ + RN', deadline: 'Sem. 31/03' },
  { action: 'Enviar accesos Notion y Drive a GTH', responsible: 'JZ', deadline: '28/03' },
];
