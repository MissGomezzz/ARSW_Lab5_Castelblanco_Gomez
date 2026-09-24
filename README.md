# Lab – React Client for Blueprints (Redux + Axios + JWT)

> Basado en el cliente HTML/JS del repo de referencia, este laboratorio moderniza el _frontend_ con **React + Vite**, **Redux Toolkit**, **Axios** (con interceptores y JWT), **React Router** y pruebas con **Vitest + Testing Library**.

## Objetivos de aprendizaje

- Diseñar una SPA en React aplicando **componetización** y **Redux (reducers/slices)**.
- Consumir APIs REST de Blueprints con **Axios** y manejar **estados de carga/errores**.
- Integrar **autenticación JWT** con interceptores y rutas protegidas.
- Aplicar buenas prácticas: estructura de carpetas, `.env`, linters, testing, CI.

## Requisitos previos

- Tener corriendo el backend de Blueprints de los **Labs 3 y 4** (APIs + seguridad).
- Node.js 18+ y npm.

Ver la especificación de glosario clave, consulta las [Definiciones del laboratorio](./DEFINICIONES.md).

## Endpoints esperados (ajústalos si tu backend quedo diferente)

Endpoints reales del backend del Lab 4 (todos los de `/api/v1` requieren JWT):

- `GET /api/v1/blueprints` → lista general o catálogo para derivar autores.
- `GET /api/v1/blueprints/{author}`
- `GET /api/v1/blueprints/{author}/{name}`
- `POST /api/v1/blueprints` (scope `blueprints.write`)
- `PUT /api/v1/blueprints/{author}/{name}` → `{ points }` (scope `blueprints.write`)
- `DELETE /api/v1/blueprints/{author}/{name}` (scope `blueprints.write`)
- `POST /auth/login` → `{ access_token, token_type, expires_in }`

Las respuestas de `/api/v1` vienen envueltas en `{ code, message, data }`.

Configura el modo (mock o API real) en `.env`.

## Cómo arrancar

```bash
npm install
cp .env.example .env
# edita .env con la URL del backend
npm run dev
```

Abre `http://localhost:5173`

## Variables de entorno

Crea un archivo `.env` en la raíz (ver `.env.example`):

```variable
VITE_USE_MOCK=true
VITE_API_BASE_URL=
VITE_BACKEND_URL=http://localhost:8080
```

- `VITE_USE_MOCK`: `true` usa `apimock` (sin backend); `false` usa `apiclient` contra el API real.
- `VITE_API_BASE_URL`: vacío para pasar por el _proxy_ de Vite (mismo origen, sin problemas de CORS).
- `VITE_BACKEND_URL`: backend al que el _proxy_ de Vite reenvía `/api` y `/auth`.

> **Tip:** en producción usa variables seguras o un _reverse proxy_.

## Estructura

```carpetas
blueprints-react-lab/
├─ src/
│  ├─ components/
│  ├─ features/blueprints/blueprintsSlice.js
│  ├─ pages/
│  ├─ services/apiClient.js   # axios + interceptores JWT
│  ├─ store/index.js          # Redux Toolkit
│  ├─ App.jsx, main.jsx, styles.css
├─ tests/
├─ .github/workflows/ci.yml
├─ index.html, package.json, vite.config.js, README.md
```

## 📌 Requerimientos del laboratorio

## 1. Canvas (lienzo)

- Agregar un lienzo (Canvas) a la página.
- Incluir un componente `BlueprintCanvas` con un identificador propio.
- Definir dimensiones adecuadas (ej. `520×360`) para que no ocupe toda la pantalla pero permita dibujar los planos.

## 2. Listar los planos de un autor

- Permitir ingresar el nombre de un autor y consultar sus planos desde el backend (o mock).
- Mostrar los resultados en una tabla con las siguientes columnas:
  - Nombre del plano
  - Número de puntos
  - Botón `Open` para abrirlo

## 3. Seleccionar un plano y graficarlo

Al hacer clic en el botón `Open`, debe:

- Actualizar un campo de texto con el nombre del plano actual.
- Obtener los puntos del plano correspondiente.
- Dibujar consecutivamente los segmentos de recta en el canvas y marcar cada punto.

## 4. Servicios: `apimock` y `apiclient`

- Implementar dos servicios con la misma interfaz:
  - `apimock`: retorna datos de prueba desde memoria.
  - `apiclient`: consume el API REST real con Axios.
- La interfaz de ambos debe incluir los métodos:
  - `getAll`
  - `getByAuthor`
  - `getByAuthorAndName`
  - `create`
- Habilitar el cambio entre `apimock` y `apiclient` con una sola línea de código:
  - Definir un módulo `blueprintsService.js` que importe uno u otro según una variable en `.env`.
  - Ejemplo en `.env` (Vite):

```env
VITE_USE_MOCK=true
```

- `VITE_USE_MOCK=true` usa el mock.
- `VITE_USE_MOCK=false` usa el API real.

## 5. Interfaz con React

- El nombre del plano actual debe mostrarse en el DOM como parte del estado global (Redux).
- Evitar manipular directamente el DOM; usar componentes y props/estado.

## 6. Estilos

- Agregar estilos para mejorar la presentación.
- Se puede usar Bootstrap u otro framework CSS.
- Ajustar la tabla, botones y tarjetas para acercarse al mock de referencia.

## 7. Pruebas unitarias

- Agregar pruebas con Vitest + Testing Library para validar:
  - Render del canvas.
  - Envío de formularios.
  - Interacciones básicas con Redux (por ejemplo: dispatch de `fetchByAuthor`).

---

### Notas rápidas y recomendaciones

- Para el canvas en tests con jsdom: agregar un mock de `HTMLCanvasElement.prototype.getContext` en `tests/setup.js`.
- Para usar `@testing-library/jest-dom` con Vitest: en `tests/setup.js` importar `import '@testing-library/jest-dom'` y asegurarse de que Vitest provea el global `expect` (configurar `vitest.config.js` con la opción `test: { globals: true, setupFiles: './tests/setup.js' }`).
- Para la conmutación de servicios en Vite, usar `import.meta.env.VITE_USE_MOCK` para leer la variable en tiempo de ejecución.

## 📌 Recomendaciones y actividades sugeridas para el exito del laboratorio

1. **Redux avanzado**
   - [x] Agrega estados `loading/error` por _thunk_ y muéstralos en la UI.
   - [x] Implementa _memo selectors_ para derivar el top-5 de blueprints por cantidad de puntos.
2. **Rutas protegidas**
   - [x] Crea un componente `<PrivateRoute>` y protege la creación/edición.
3. **CRUD completo**
   - [x] Implementa `PUT /api/blueprints/{author}/{name}` y `DELETE ...` en el slice y en la UI.
   - [x] Optimistic updates (revertir si falla).
4. **Dibujo interactivo**
   - [x] Reemplaza el `svg` por un lienzo donde el usuario haga _click_ para agregar puntos.
   - [x] Botón “Guardar” que envíe el blueprint.
5. **Errores y _Retry_**
   - [ ] Si `GET` falla, muestra un banner y un botón **Reintentar** que dispare el thunk.
6. **Testing**
   - [ ] Pruebas de `blueprintsSlice` (reducers puros).
   - [ ] Pruebas de componentes con Testing Library (render, interacción).
7. **CI/Lint/Format**
   - [ ] Activa **GitHub Actions** (workflow incluido) → lint + test + build.
8. **Docker (opcional)**
   - [ ] Crea `Dockerfile` (+ `compose`) para front + backend.

## Criterios de evaluación

- Funcionalidad y cobertura de casos (30%)
- Calidad de código y arquitectura (Redux, componentes, servicios) (25%)
- Manejo de estado, errores, UX (15%)
- Pruebas automatizadas (15%)
- Seguridad (JWT/Interceptores/Rutas protegidas) (10%)
- CI/Lint/Format (5%)

## Scripts

- `npm run dev` – servidor de desarrollo Vite
- `npm run build` – build de producción
- `npm run preview` – previsualizar build
- `npm run lint` – ESLint
- `npm run format` – Prettier
- `npm test` – Vitest

---

### Extensiones propuestas del reto

- **Redux Toolkit Query** para _caching_ de requests.
- **MSW** para _mocks_ sin backend.
- **Dark mode** y diseño responsive.

> Este proyecto es un punto de partida para que tus estudiantes evolucionen el cliente clásico de Blueprints a una SPA moderna con prácticas de la industria.

---

## Respuestas

### Requerimientos del laboratorio (1 a 7)

1. **Canvas**: `BlueprintCanvas` dibuja sobre un `<canvas>` de `520×360` con identificador propio (`id="blueprint-canvas"` en la vista principal).
2. **Planos de un autor**: se ingresa el autor (o se elige de la lista de autores) y se muestran sus planos en una tabla con nombre, número de puntos y botón `Open`, más el total de puntos del autor.
3. **Seleccionar y graficar**: `Open` consulta el plano en el backend, actualiza el campo de texto `Current blueprint` y dibuja los segmentos consecutivos marcando cada punto.
4. **Servicios**: `services/apiMock.js` (datos en memoria) y `services/apiClient.js` (Axios + interceptores JWT) exponen la misma interfaz (`getAll`, `getByAuthor`, `getByAuthorAndName`, `create`, además de `update`, `remove` y `login`). `services/blueprintsService.js` elige uno u otro en una sola línea según `VITE_USE_MOCK`.
5. **React + Redux**: el plano actual vive en el estado global (`currentKey` del slice) y la UI se construye solo con componentes, props y estado, sin manipular el DOM.
6. **Estilos**: toda la interfaz usa **Tailwind CSS v4** (plugin `@tailwindcss/vite`).
7. **Pruebas**: Vitest + Testing Library cubren el render del canvas, el envío del formulario, el flujo de consultar un autor y abrir un plano con Redux, el slice, el `apimock` y `PrivateRoute`.

### Recomendaciones 1 a 4

1. **Redux avanzado**: cada _thunk_ tiene su propio estado `loading/error` en `state.blueprints.requests`, que se muestra en la UI con `RequestStatus`. El top-5 por número de puntos se deriva con un _memo selector_ (`createSelector`) en `blueprintsSelectors.js`.
2. **Rutas protegidas**: `<PrivateRoute>` redirige a `/login` si no hay sesión y protege la creación (`/blueprints/new`) y la edición (`/blueprints/:author/:name/edit`). Tras el login se regresa a la ruta solicitada.
3. **CRUD completo**: se agregaron al backend del Lab 4 los endpoints `PUT /api/v1/blueprints/{author}/{name}` y `DELETE /api/v1/blueprints/{author}/{name}` (scope `blueprints.write`), y los _thunks_ `updateBlueprint` y `deleteBlueprint` con sus botones en la UI. Ambos son **optimistas**: el cambio se aplica de inmediato, se guarda una copia y, si el backend falla, se revierte y se muestra el error.
4. **Dibujo interactivo**: el `svg` del detalle se reemplazó por el canvas. En crear y editar, cada _click_ sobre el lienzo agrega un punto (con opciones de deshacer y limpiar), y el botón **Guardar** envía el blueprint al backend.
