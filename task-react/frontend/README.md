# Gestor de Tareas — Frontend (React + Vite)

Aplicación web para gestionar tareas de proyectos de software (tipo _task tracker_ / tablero de
actividades). Permite crear, editar, finalizar, eliminar y filtrar tareas, con campos pensados para
un contexto de gestión de proyectos: proyecto, sprint, tipo de actividad, prioridad, persona
asignada, fechas, etc.

Este directorio contiene **solo el frontend**. La base de datos PostgreSQL y la orquestación de
contenedores están definidas un nivel arriba, en [`../docker-compose.yml`](../docker-compose.yml).

---

## Stack

- React 19 + Vite 8
- JavaScript (JSX), sin TypeScript
- Express y `cors` presentes como dependencias (scaffold de Vite, integrative en `vite.config.js`)
- Docker / Docker Compose para el entorno de desarrollo

## Estructura

```text
frontend/
├── dockerfile            # Multi-stage: builder (build de producción) y development (Vite dev server)
├── vite.config.js
├── eslint.config.js
├── index.html
└── src/
    ├── main.jsx          # Punto de entrada, monta <App />
    ├── App.jsx           # Estado global de tareas y lógica de alta/edición/baja/finalización
    ├── App.css           # Estilos de la app
    └── components/
        ├── FormularioTarea.jsx  # Formulario de alta y de edición
        ├── ListadoTareas.jsx    # Listado + filtros por estado con contadores
        └── Tarea.jsx            # Tarjeta de una tarea con sus acciones
```

---

## Levantar el proyecto con Docker

El `docker-compose.yml` vive en el directorio padre (`task-react/`), por lo que los comandos se
ejecutan **desde `task-react/`**, no desde `frontend/`.

### 1. Requisitos

- Docker Desktop (o Docker Engine + Compose plugin) instalado y corriendo.

### 2. Variables de entorno

El compose lee las credenciales de la base desde `task-react/.env`. Si el archivo no existe,
créalo con:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password
POSTGRES_DB=task_db
```

### 3. Levantar todo

```bash
cd ..
docker compose up -d --build
```

Luego:

- Frontend: <http://localhost:5173>
- PostgreSQL: `localhost:5433` (se mapea a `5432` dentro del contenedor para no chocar con un
  Postgres local)

Comandos útiles:

```bash
docker compose logs -f task_frontend   # ver el log de Vite
docker compose ps                      # estado de los contenedores
docker compose down                    # parar los contenedores
docker compose down -v                 # parar y además borrar el volumen de la base de datos
```

### 4. Levantar solo el frontend

Si la base ya está corriendo (o si querés iterar rápido sobre la UI):

```bash
cd ..
docker compose up -d task_frontend
```

### Levantar sin Docker

```bash
npm install
npm run dev
```

---

## Cómo está armado el Docker

### `dockerfile` (multi-stage)

- **`builder`** → `node:22-alpine`, instala dependencias con `npm ci` y compila con `npm run build`.
  Genera el bundle de producción en `dist/`.
- **`development`** → `node:22-alpine`, instala dependencias y levanta el dev server con
  `npm run dev -- --host 0.0.0.0` en el puerto `5173`.

El flag `--host 0.0.0.0` es necesario para que Vite escuche en la red de Docker y sea alcanzable
desde el navegador del host.

### Servicios del `docker-compose.yml`

| Servicio        | Imagen / build                              | Puerto      | Función                           |
| --------------- | ------------------------------------------- | ----------- | --------------------------------- |
| `task_frontend` | build de `./frontend`, target `development` | `5173:5173` | Dev server de Vite con hot-reload |
| `task_db`       | `postgres:16-alpine`                        | `5433:5432` | Base de datos PostgreSQL          |

Detalles importantes:

- **Hot-reload**: se monta `./frontend:/app`, así que los cambios que hagas en los archivos de tu
  máquina se reflejan en el navegador sin reconstruir la imagen. Se agrega el volumen anónimo
  `/app/node_modules` para que las dependencias instaladas _dentro_ del contenedor no queden
  tapadas por la carpeta del host.
- **Volumen nombrado `task_db_data`**: guarda los datos de PostgreSQL en `/var/lib/postgresql/data`
  para que no se pierdan al recrear el contenedor.
- **`./data:/docker-entrypoint-initdb.d`**: los scripts `.sql` que dejes en `task-react/data` se
  ejecutan automáticamente **solo la primera vez** que se crea el volumen. Si agregás scripts
  después, hay que recrear el volumen (`docker compose down -v && docker compose up -d`).
- **Healthcheck** de `task_db` con `pg_isready`, y red compartida `task_net` para que ambos
  contenedores se comuniquen por nombre (`task_db`).

---

## Funcionalidad de la app

- **Alta de tareas** con validación de campos obligatorios (`alert` si falta alguno).
- **Edición**: al editar, el formulario se abre dentro de la tarjeta de la tarea; si no estás
  editando, el formulario principal se oculta.
- **Finalización**: el botón _Finalizar_ fija el estado en `Finalizada` y completa automáticamente
  la `fechaCierre` con la fecha de hoy. Una tarea finalizada ya no permite cambiar su estado ni su
  fecha de cierre.
- **Eliminación** de una tarea.
- **Filtrado** por estado (Todas / Pendientes / En progreso / Finalizadas) con contadores por
  opción.

### Modelo de tarea

| Campo             | Tipo   | Obligatorio | Valores                                 |
| ----------------- | ------ | ----------- | --------------------------------------- |
| `nombreProyecto`  | texto  | Sí          | —                                       |
| `tipoActividad`   | select | Sí          | Tarea, Historia de Usuario, Bug, Mejora |
| `estado`          | select | Sí          | Pendiente, En progreso, Finalizada      |
| `prioridad`       | select | Sí          | Baja, Media, Alta                       |
| `resumen`         | texto  | No          | —                                       |
| `descripcion`     | texto  | Sí          | —                                       |
| `informador`      | texto  | Sí          | —                                       |
| `personaAsignada` | texto  | Sí          | —                                       |
| `precondicion`    | texto  | No          | —                                       |
| `fechaCreacion`   | fecha  | Sí          | —                                       |
| `fechaCierre`     | fecha  | No          | Se autocompleta al finalizar            |
| `sprint`          | texto  | Sí          | —                                       |

> **Nota**: el estado de las tareas vive hoy en `useState` dentro de `App.jsx`, es decir, se pierde
> al recargar el navegador. El contenedor `task_db` ya está levanta y listo para ser conectado; los
> scripts de inicialización de la base se dejan en `task-react/data/`.

---

## Scripts

| Comando           | Descripción                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Levanta el dev server de Vite             |
| `npm run build`   | Compila la app para producción en `dist/` |
| `npm run lint`    | Corre ESLint                              |
| `npm run preview` | Sirve localmente el build de `dist/`      |
