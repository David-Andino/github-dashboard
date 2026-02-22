# 🔭 GitScope — Dashboard de Análisis de Repositorios GitHub

> Analiza perfiles de GitHub en tiempo real: repositorios, commits, lenguajes y métricas clave, todo desde una interfaz limpia y rápida.

![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![GitHub API](https://img.shields.io/badge/GitHub_API-REST_v3-181717?logo=github&logoColor=white)
![Deploy](https://img.shields.io/badge/Deploy-GitHub_Pages-222?logo=github&logoColor=white)

---

## 📋 Tabla de contenidos

- [Demo](#-demo)
- [Features](#-features)
- [Primeros pasos](#-primeros-pasos)
- [Cómo usar la app](#-cómo-usar-la-app)
- [Token de API](#-token-de-api-opcional-pero-recomendado)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Arquitectura técnica](#-arquitectura-técnica)
- [Stack y dependencias](#-stack-y-dependencias)
- [Rate Limiting](#-rate-limiting)

---

## 🚀 Demo

🌐 **[Ver demo en vivo](https://David-Andino.io/github-dashboard/)**

> Reemplaza la URL con tu propia instancia desplegada en GitHub Pages.

---

## ✨ Features

| Feature | Descripción |
|---|---|
| 🔍 **Búsqueda de usuarios** | Busca cualquier perfil público de GitHub al instante |
| 👤 **Perfil completo** | Avatar, bio, empresa, ubicación, Twitter, web y stats clave |
| 📦 **Grid de repositorios** | Lista todos los repos con paginación de 30 en 30 |
| ⭐ **Filtros y ordenamiento** | Filtra por stars mínimas, ordena por fecha, stars o forks |
| 🔀 **Commits recientes** | Haz clic en cualquier repo para ver sus últimos 10 commits |
| 🍩 **Gráfica de lenguajes** | Donut chart con los lenguajes más usados en todos los repos |
| 🔑 **Soporte de Token API** | Aumenta el rate limit de 60 a 5,000 requests por hora |
| ⚡ **Rate Limit visual** | Indicador en tiempo real del consumo de la API en el header |
| 🌙 **Modo oscuro / claro** | Toggle con persistencia en `localStorage` |
| 💀 **Manejo de errores** | Gestión de errores 403 (rate limit), 404 y otros |
| 📱 **Responsive** | Diseño adaptado para móvil, tablet y escritorio |
| ✨ **Animaciones** | Entradas suaves con `fadeUp` escalonado y micro-interacciones |

---


## 🏁 Primeros pasos

### Requisitos

- Node.js **18+**
- npm **9+**

### Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/David-Andino/github-dashboard.git
cd github-dashboard

# 2. Instala dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo con HMR
npm run build    # Build de producción en /dist
npm run preview  # Vista previa del build
npm run deploy   # Build + deploy a GitHub Pages (requiere gh-pages)
```

---

## 📖 Cómo usar la app

### 1. Buscar un usuario

Escribe el nombre de usuario de GitHub en el campo de búsqueda y presiona **Analizar** (o `Enter`).

También puedes hacer clic en cualquiera de los **chips de sugerencias** en la pantalla de inicio: `torvalds`, `gvanrossum`, `sindresorhus`, etc.

### 2. Ver el perfil

Una vez que la búsqueda sea exitosa, verás:

- **UserCard** (panel izquierdo): avatar, nombre, bio, empresa, ubicación, links y 4 métricas principales (repos, seguidores, siguiendo, gists).
- **Gráfica de lenguajes**: donut chart que agrega los bytes de código de los primeros 12 repositorios para mostrar los lenguajes dominantes.

### 3. Explorar repositorios

El grid de repos se carga automáticamente. Desde ahí puedes:

- **Filtrar** por número mínimo de ⭐ stars usando el campo numérico.
- **Ordenar** por fecha de actualización, stars o forks usando el selector desplegable.
- **Paginar** con los botones *Anterior* / *Siguiente* para navegar de 30 en 30.

Cada tarjeta muestra: nombre, descripción, lenguaje, stars, forks y hace cuánto tiempo fue actualizado.

### 4. Ver commits de un repositorio

Haz clic sobre cualquier repo del grid para abrir el **CommitPanel** debajo de la lista. Verás:

- Los **10 commits más recientes** con avatar del autor, mensaje y hash SHA.
- **Metadata del repo**: stars, forks, issues abiertos, lenguaje, tamaño y licencia.
- Un botón **"Ver en GitHub"** para abrir el repo directamente.

Haz clic en el mismo repo (o en el botón ✕) para cerrar el panel.

### 5. Modo oscuro

Haz clic en el ícono 🌙 / ☀️ en el header para cambiar entre modo claro y oscuro. La preferencia se guarda automáticamente.

---

## 🔑 Token de API (opcional pero recomendado)

La API de GitHub tiene un límite de **60 requests por hora** sin autenticación. Con un token personal sube a **5,000 requests por hora**.

El indicador de rate limit en el header cambia de color:
- 🟢 Verde → más de 50% disponible
- 🟡 Amarillo → entre 20% y 50%
- 🔴 Rojo → menos del 20%

### Cómo obtener un token

1. Ve a [GitHub → Settings → Personal Access Tokens](https://github.com/settings/tokens/new)
2. Escribe un nombre descriptivo (ej: `gitscope-app`)
3. Selecciona los siguientes scopes:
   - ✅ `public_repo`
   - ✅ `read:user`
4. Haz clic en **Generate token** y copia el valor (empieza con `ghp_...`)

### Agregar el token a la app

1. Haz clic en el botón **"Token API"** en el header
2. Pega tu token en el campo
3. Haz clic en **Guardar**

> ⚠️ **Seguridad**: el token se guarda únicamente en el `localStorage` de tu navegador. No se transmite a ningún servidor propio, solo se usa en las cabeceras de los requests directos a `api.github.com`.

---


## 📁 Estructura del proyecto

```
github-dashboard/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD para GitHub Pages
├── public/                     # Assets estáticos
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navegación, toggle de tema y rate limit
│   │   ├── Header.module.css
│   │   ├── SearchBar.jsx       # Input de búsqueda + chips de sugerencias
│   │   ├── SearchBar.module.css
│   │   ├── UserCard.jsx        # Perfil del usuario con stats
│   │   ├── UserCard.module.css
│   │   ├── RepoList.jsx        # Grid de repos con filtros y paginación
│   │   ├── RepoList.module.css
│   │   ├── CommitPanel.jsx     # Panel de commits del repo seleccionado
│   │   ├── CommitPanel.module.css
│   │   ├── LanguageChart.jsx   # Donut chart de lenguajes (Recharts)
│   │   ├── LanguageChart.module.css
│   │   ├── TokenModal.jsx      # Modal para configurar el token de API
│   │   ├── TokenModal.module.css
│   │   ├── ErrorBanner.jsx     # Banner de errores dismissible
│   │   └── ErrorBanner.module.css
│   ├── hooks/
│   │   └── useGitHub.js        # Hook con toda la lógica de la GitHub API
│   ├── App.jsx                 # Componente raíz y orquestación del estado
│   ├── App.module.css
│   ├── index.css               # Variables CSS globales (temas, animaciones)
│   └── main.jsx                # Entry point de React
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🏗 Arquitectura técnica

### Hook `useGitHub` — capa de datos

Toda la comunicación con la API de GitHub está encapsulada en `src/hooks/useGitHub.js`. El hook:

- Gestiona el **token** de autenticación con persistencia en `localStorage`.
- Extrae el **rate limit** de los headers de cada respuesta (`x-ratelimit-remaining`, `x-ratelimit-limit`, `x-ratelimit-reset`) y lo expone como estado reactivo.
- Lanza errores descriptivos para los códigos HTTP más comunes (403 rate limit, 404 usuario no encontrado).
- Expone las funciones: `getUser`, `getRepos`, `getCommits`, `getLanguages`.

### Endpoints de la GitHub REST API utilizados

| Función | Endpoint |
|---|---|
| Perfil de usuario | `GET /users/:username` |
| Listado de repos | `GET /users/:username/repos` |
| Commits de un repo | `GET /repos/:owner/:repo/commits` |
| Lenguajes de un repo | `GET /repos/:owner/:repo/languages` |

### Caching de lenguajes

El componente `LanguageChart` implementa un caché en memoria (`useRef`) para evitar requests duplicados al cambiar entre pestañas de la misma sesión. Los resultados de `/languages` se acumulan y se agrupan por lenguaje sumando sus bytes totales antes de renderizar la gráfica.

### Paginación del lado del cliente

Los repos se cargan de la API con `sort=updated&per_page=30`. La lógica de paginación detecta si hay más páginas comprobando si la respuesta devuelve exactamente 30 items (`hasMore = data.length === PER_PAGE`).

### CSS Modules + Variables CSS

El sistema de temas usa variables CSS definidas en `:root` (modo claro) y `[data-theme="dark"]`. Cada componente tiene su propio `.module.css`, lo que elimina conflictos de nombres y mantiene los estilos colocalizados.

---

## 🛠 Stack y dependencias

| Paquete | Versión | Uso |
|---|---|---|
| `vite` | ^5.0 | Bundler y servidor de desarrollo |
| `react` | ^18.2 | UI framework |
| `react-dom` | ^18.2 | Renderizado en el DOM |
| `recharts` | ^2.10 | Donut chart de lenguajes |
| `lucide-react` | ^0.263 | Íconos SVG |
| `gh-pages` | ^6.1 | Deploy manual a GitHub Pages |

No hay librerías de estado externas (Redux, Zustand, etc.) — todo se maneja con `useState`, `useEffect` y `useCallback` nativos de React.

---

## ⚡ Rate Limiting

La GitHub API aplica límites por IP (sin token) o por usuario (con token):

| Tipo | Límite |
|---|---|
| Sin autenticación | 60 requests / hora |
| Con Personal Access Token | 5,000 requests / hora |
| Con GitHub App | 15,000 requests / hora |

La app consume aproximadamente:
- `1` request para el perfil del usuario
- `1` request para los repos (por página)
- `1` request por repositorio al ver commits
- `1` request por repositorio para la gráfica de lenguajes (hasta 12 en paralelo)

Con un token, puedes analizar decenas de perfiles sin problema.

---

### Ideas de mejoras futuras

- [ ] Gráfica de actividad de commits por mes (contribuciones)
- [ ] Comparador de dos usuarios lado a lado
- [ ] Exportar perfil como PDF o imagen
- [ ] Visualización de issues y pull requests
- [ ] Historial de búsquedas recientes
- [ ] Soporte para organizaciones de GitHub

---

## 📄 Licencia

MIT © 2024 — Libre para uso personal y comercial.

---

<div align="center">
  <sub>Construido con ❤️ usando la <a href="https://docs.github.com/en/rest">GitHub REST API</a></sub>
</div>
