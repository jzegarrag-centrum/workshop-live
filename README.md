# Workshop Live

Aplicación web para facilitar workshops de co-creación en tiempo real (facilitador + participantes móviles) con captura de insumos, síntesis con IA y exportación de reportes PDF.

## Novedades recientes (2026-03-27)

- Reordenamiento por arrastre habilitado en paneles del facilitador:
  - `B2A Organizar` (`b2a2`)
  - `B2B Organizar` (`b2b2`)
- Feedback visual de drag and drop:
  - elemento arrastrado con opacidad reducida
  - elemento destino resaltado con anillo de color
- Persistencia automática al backend al soltar (drop).
- Priorización editable en `B2A Organizar` (`Crítica`, `Alta`, `Media`, `Futura`).

## Resumen funcional

- Vista de facilitador con láminas en formato 16:9 y navegación por etapas.
- Vista móvil para participantes con interacción por etapa.
- Captura y versionado de artefactos en PostgreSQL (Neon).
- Síntesis IA por bloque usando Anthropic Claude (opcional).
- Exportación de reportes PDF: `acta`, `funcionalidades`, `campos`, `pasos`.

## Stack técnico

- Next.js 15 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Neon PostgreSQL (`@neondatabase/serverless`)
- Anthropic SDK (`@anthropic-ai/sdk`)
- jsPDF (`jspdf`, `jspdf-autotable`)

## Rutas de UI

- `/` -> login de facilitador
- `/workshop/lobby` -> listado/gestión de sesiones
- `/workshop/[id]/facilitate` -> panel de facilitación
- `/workshop/[id]/participate` -> vista móvil de participantes (pública)

## Autenticación

- Login básico por cookie (`wl_auth`) en `/api/auth/login`.
- `middleware` protege `/workshop/*` excepto `/workshop/[id]/participate`.
- Credenciales por defecto:
  - usuario: `admin`
  - password: valor de `ADMIN_PASSWORD` (fallback: `admin1234`)

## Variables de entorno

Usa `.env.local` para desarrollo. Puedes copiar `.env.example`.

Variables usadas por el código:

- `DATABASE_URL` (obligatoria)
- `ANTHROPIC_API_KEY` (opcional, habilita IA)
- `ADMIN_PASSWORD` (recomendada)
- `NEXT_PUBLIC_APP_URL` (recomendada)

## Instalación local

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

```bash
cp .env.example .env.local
```

En Windows (PowerShell):

```powershell
Copy-Item .env.example .env.local
```

3. Crear tablas en PostgreSQL (una sola vez).

4. Levantar entorno de desarrollo:

```bash
npm run dev
```

5. Abrir `http://localhost:3000`.

## Esquema mínimo de base de datos

Este esquema está alineado con las consultas actuales de `src/app/api`.

```sql
CREATE TABLE IF NOT EXISTS workshop_sessions (
  id SERIAL PRIMARY KEY,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  facilitator_id TEXT NOT NULL,
  current_stage TEXT NOT NULL DEFAULT 'cover',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workshop_participants (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES workshop_sessions(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'participant',
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workshop_responses (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES workshop_sessions(id) ON DELETE CASCADE,
  participant_id INTEGER NOT NULL REFERENCES workshop_participants(id) ON DELETE CASCADE,
  block TEXT NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (session_id, participant_id, block)
);

CREATE TABLE IF NOT EXISTS workshop_artifacts (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES workshop_sessions(id) ON DELETE CASCADE,
  artifact_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workshop_exports (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES workshop_sessions(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL,
  file_name TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop_sessions_created_at ON workshop_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workshop_participants_session_id ON workshop_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_workshop_responses_session_block ON workshop_responses(session_id, block);
CREATE INDEX IF NOT EXISTS idx_workshop_artifacts_session_type_version ON workshop_artifacts(session_id, artifact_type, version DESC);
```

## API principal

### Auth

- `POST /api/auth/login`
  - body: `{ user, password }`
  - 200: `{ ok: true }` + cookie `wl_auth`

### Sesiones

- `POST /api/workshop/create`
  - body opcional: `{ title?, project_id? }`
  - crea sesión + artifacts seed (`operations`, `next_steps`)
  - 200: `{ id }`

- `GET /api/workshop/list`
  - lista sesiones con `participant_count`

- `PATCH /api/workshop/[id]`
  - body: `{ title? , status? }`

### Etapa actual

- `GET /api/workshop/[id]/stage`
- `PUT /api/workshop/[id]/stage`
  - body: `{ stage }`

### Participantes

- `GET /api/workshop/[id]/participants`
- `POST /api/workshop/[id]/participants`
  - body: `{ display_name, role? }`

### Respuestas

- `GET /api/workshop/[id]/responses?block=b1_write`
- `POST /api/workshop/[id]/responses`
  - body: `{ participant_id, block, payload }`

### Artefactos (versionados)

- `GET /api/workshop/[id]/artifacts/[type]`
- `PUT /api/workshop/[id]/artifacts/[type]`
  - body: `{ payload }`

Tipos usados actualmente:

- `operations`
- `questions`
- `data_fields`
- `next_steps`
- `b1_synthesis`, `b2a_synthesis`, `b2b_synthesis`, `b3_synthesis` (generados por IA)

### IA

- `POST /api/workshop/[id]/ai/seeds`
  - body: `{ block: "b2b" | "b3" }`

- `POST /api/workshop/[id]/ai/synth`
  - body: `{ block: "b1" | "b2a" | "b2b" | "b3" }`

Si no hay `ANTHROPIC_API_KEY`, la app sigue funcionando sin síntesis/seeds IA.

### Exportación

- `POST /api/workshop/[id]/export`
  - body: `{ type: "acta" | "funcionalidades" | "campos" | "pasos" }`
  - respuesta: `application/pdf` (descarga)

## Etapas del workshop

Las etapas se definen en `src/lib/stages.ts`.

- Total actual: 33 etapas.
- Bloques:
  - Apertura: `cover`, `qr`, `team`, `agenda`
  - B1: descubrimiento
  - B2A/B2B: funcionalidades y preguntas
  - B3: inventario de datos
  - B4: gestión y próximos pasos
  - Cierre: `qa`, `thx`

Tipos de interacción por etapa:

- `none`
- `write`
- `multi_add`
- `organize`
- `links`

Notas de `organize`:

- `b2a2`: permite reordenar operaciones por arrastre y ajustar prioridad.
- `b2b2`: permite reordenar preguntas por arrastre.
- Los cambios se guardan automáticamente en `workshop_artifacts` mediante `PUT /api/workshop/[id]/artifacts/[type]`.

## Estructura de carpetas

```text
src/
  app/
    api/
      auth/login/route.ts
      workshop/
        create/route.ts
        list/route.ts
        [id]/
          route.ts
          stage/route.ts
          participants/route.ts
          responses/route.ts
          artifacts/[type]/route.ts
          ai/seeds/route.ts
          ai/synth/route.ts
          export/route.ts
    workshop/
      lobby/page.tsx
      [id]/facilitate/page.tsx
      [id]/participate/page.tsx
  components/
    FacilitatorSlide.tsx
  lib/
    db.ts
    seeds.ts
    stages.ts
```

## Comandos npm

- `npm run dev` -> desarrollo
- `npm run build` -> build producción
- `npm run build:cf` -> build OpenNext para Cloudflare Worker
- `npm run start` -> correr build
- `npm run deploy` -> despliegue con Wrangler

## Deploy en Cloudflare Workers

Esta app usa OpenNext para empaquetar Next.js en un Worker.

Configuración requerida ya incluida en el repo:

- `open-next.config.ts`
- `wrangler.toml` con:
  - `main = ".open-next/worker.js"`
  - `[assets] directory = ".open-next/assets"`

Comandos recomendados en CI/CD:

1. `npm clean-install`
2. `npm run build:cf`
3. `npm run deploy`

Si usas Cloudflare Build con comandos personalizados:

- Build command: `npm run build:cf`
- Deploy command: `npm run deploy`

## Notas operativas

- Las variables sensibles no deben versionarse (`.env.local`).
- Se recomienda rotar credenciales y API keys periódicamente.
- El lobby permite archivar/reactivar sesiones vía `status`.
- El panel de facilitador permite ocultar láminas por sesión (localStorage del navegador).

## Troubleshooting

- Error de conexión a DB:
  - validar `DATABASE_URL` y conectividad Neon.
- Login no funciona:
  - revisar `ADMIN_PASSWORD` y cookies del navegador.
- IA no responde:
  - revisar `ANTHROPIC_API_KEY` y cuota del proveedor.
- PDF no descarga:
  - revisar consola de red (`/api/workshop/[id]/export`) y permisos del navegador.
- El arrastre no reordena en panel del facilitador:
  - confirmar que estás en `b2a2` o `b2b2`.
  - verificar que no haya error en `PUT /api/workshop/[id]/artifacts/[type]`.
  - revisar conectividad a DB (`DATABASE_URL`) si el orden vuelve al estado anterior.
- Error de deploy en Wrangler: `Missing entry-point to Worker script or to assets directory`
  - confirmar que el build ejecutado es OpenNext (`npm run build`).
  - confirmar que existe `.open-next/worker.js` tras el build.
  - confirmar que `wrangler.toml` tiene `main` y `[assets]` apuntando a `.open-next`.
