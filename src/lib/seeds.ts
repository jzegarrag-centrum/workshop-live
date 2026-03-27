export const SEED_OPERATIONS = [
  { title: 'Registrar datos del personal', detail: 'Alta, baja, actualizaci\u00f3n de informaci\u00f3n b\u00e1sica', process: 'Onboarding / Admin. personal', origin: 'seed' },
  { title: 'Cargar grados acad\u00e9micos', detail: 'T\u00edtulos, universidades, fechas, documentos de respaldo', process: 'Gesti\u00f3n de legajos', origin: 'seed' },
  { title: 'Asignar y validar skills', detail: 'Autorreporte del colaborador + aprobaci\u00f3n de GTH', process: 'Desarrollo de talento', origin: 'seed' },
  { title: 'Verificar credenciales', detail: 'Consulta SUNEDU, tokens de verificaci\u00f3n', process: 'Verificaci\u00f3n de antecedentes', origin: 'seed' },
  { title: 'Gestionar estados', detail: 'Activo, licencia, cesado (nunca borrar, solo cambiar estado \u2014 soft delete)', process: 'Admin. personal', origin: 'seed' },
];

export const SEED_NEXT_STEPS = [
  { action: 'Consolidar insumos del workshop', responsible: 'JZ', deadline: '28/03' },
  { action: 'Matriz de coherencia transaccional ↔ analítica', responsible: 'RN + JZ', deadline: 'Sem. 31/03' },
  { action: 'Schema de datos v0.1 (DBML)', responsible: 'JZ + RN', deadline: 'Sem. 31/03' },
  { action: 'Enviar accesos Notion y Drive a GTH', responsible: 'JZ', deadline: '28/03' },
];
