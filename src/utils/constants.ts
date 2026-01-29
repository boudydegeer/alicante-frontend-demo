export const GITHUB_USERNAME = 'boudydegeer'
export const LIVE_REPO_NAME = 'alicante-frontend-demo'
export const GITHUB_API_BASE = 'https://api.github.com'

// El contenido completo del prompt que genero este dashboard
// Se muestra en el PromptModal como easter egg
export const PROMPT_CONTENT = `# Proyecto: GitHub Dashboard en Vivo (TDD Edition)

Construye un dashboard de GitHub en React que muestre mis stats y el progreso de este mismo repo en tiempo real.

## Contexto
- Esto se construye EN VIVO durante una charla de 45-50 minutos
- El publico vera el dashboard actualizandose mientras hablo
- **Metodologia TDD**: Red -> Green -> Refactor
- IMPORTANTE: Haz commits frecuentes + push inmediato
- Username GitHub: boudydegeer
- Repo en vivo: alicante-frontend-demo

## Tech Stack
- React 18 + TypeScript
- Vite (con @tailwindcss/vite plugin)
- Tailwind CSS v4 (usar \`@import "tailwindcss"\` en index.css)
- **shadcn/ui** para componentes UI (Card, Progress, Badge, Avatar, Skeleton, Dialog)
- Framer Motion para animaciones
- Recharts para graficos
- canvas-confetti para easter egg
- **Vitest + React Testing Library** para TDD

---

## FASE 1: Setup Inicial

### 1.0 Configurar variable de entorno

Crear el archivo \`.env\` en la raiz del proyecto con el token de GitHub:

\`\`\`bash
# Crear archivo .env con la variable GH_PUBLIC_REPO del sistema
echo 'VITE_GITHUB_TOKEN="\${GH_PUBLIC_REPO}"' > .env
\`\`\`

Esto permite que Vite acceda al token de GitHub para:
- 5000 requests/hora (vs 60 sin token)
- Acceso a GraphQL API para contribution graph real

### 1.1 Crear proyecto e inicializar repositorio

\`\`\`bash
# Crear proyecto Vite
npm create vite@latest . -- --template react-ts
npm install

# IMPORTANTE: Crear repo ANTES de empezar a codear
git add .
git commit -m "chore: init vite + react + typescript project"
gh repo create alicante-frontend-demo --public --source=. --remote=origin --push
\`\`\`

### 1.2 Instalar dependencias

\`\`\`bash
# Dependencias de produccion
npm install framer-motion recharts canvas-confetti lucide-react

# Dependencias de desarrollo (incluyendo testing)
npm install -D @types/canvas-confetti tailwindcss @tailwindcss/vite
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw
\`\`\`

### 1.2.1 Instalar shadcn/ui

\`\`\`bash
# Inicializar shadcn/ui con defaults
npx shadcn@latest init -d

# Agregar componentes necesarios
npx shadcn@latest add card progress badge avatar skeleton dialog
\`\`\`

---

## Diseno

- Tema OSCURO: fondo #0a0a0f, texto #e8e8e8
- Accent color: #4ecdc4 (turquesa)
- Danger/Live: #ff6b6b (rojo)
- Cards: rgba(255,255,255,0.05) con borde rgba(255,255,255,0.1)
- Cuadrados vacios contribution graph: #2d2d3a (visible sobre fondo oscuro)
- Sin bordes redondeados excesivos (border-radius: 8px max)
- Animaciones suaves con Framer Motion

---

## APIs de GitHub

### REST API (con token opcional en header Authorization: Bearer)
\`\`\`
GET /users/boudydegeer
GET /users/boudydegeer/repos?per_page=100&sort=stars
GET /users/boudydegeer/events?per_page=50
GET /repos/boudydegeer/alicante-frontend-demo
GET /repos/boudydegeer/alicante-frontend-demo/commits?per_page=100
\`\`\`

### GraphQL API (requiere token para contribution graph real)
\`\`\`graphql
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
\`\`\`

---

## Estructura de Archivos

\`\`\`
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── Header.tsx
│   ├── StatsCards.tsx
│   ├── ContributionGraph.tsx
│   ├── LanguagesChart.tsx
│   ├── ActivityFeed.tsx
│   ├── FeaturedRepos.tsx
│   ├── LiveRepoSection.tsx
│   ├── PromptModal.tsx
│   └── CoverageCard.tsx
├── hooks/
│   ├── useGitHubUser.ts
│   ├── useGitHubRepos.ts
│   ├── useGitHubEvents.ts
│   ├── useLiveRepo.ts
│   └── useCoverage.ts
├── utils/
│   ├── api.ts
│   └── constants.ts
├── App.tsx
├── main.tsx
└── index.css
\`\`\`

---

## Resultado Final

El dashboard debe:
- Cargar sin errores en localhost:5173
- Mostrar datos reales de boudydegeer
- Contribution graph de 365 dias ocupando todo el ancho
- LanguagesChart con top 5 lenguajes (Recharts bar chart)
- ActivityFeed con ultimos 8 eventos y tiempo relativo
- FeaturedRepos con top 3 repos clickeables
- Actualizar seccion "en vivo" cada 30s
- Coverage card mostrando test coverage real (actualiza cada 30s)
- Confetti al click en avatar
- Modal con prompt al click en "EN VIVO"
- Responsive: funcionar en mobile, tablet y desktop
- Animaciones suaves y coordinadas
- Todos los tests pasando
- Coverage visible con barras de progreso coloreadas (verde/amarillo/rojo)
- Dashboard desplegado en Vercel con URL publica
- Accesible desde cualquier dispositivo en la sala
`
