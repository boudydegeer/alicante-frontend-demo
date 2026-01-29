# Proyecto: GitHub Dashboard en Vivo (TDD Edition)

Construye un dashboard de GitHub en React que muestre mis stats y el progreso de este mismo repo en tiempo real.

## Contexto
- Esto se construye EN VIVO durante una charla de 45-50 minutos
- El público verá el dashboard actualizándose mientras hablo
- **Metodología TDD**: Red -> Green -> Refactor
- IMPORTANTE: Haz commits frecuentes + push inmediato
- Username GitHub: boudydegeer
- Repo en vivo: alicante-frontend-demo

## Tech Stack
- React 18 + TypeScript
- Vite (con @tailwindcss/vite plugin)
- Tailwind CSS v4 (usar `@import "tailwindcss"` en index.css)
- **shadcn/ui** para componentes UI (Card, Progress, Badge, Avatar, Skeleton, Dialog)
- Framer Motion para animaciones
- Recharts para gráficos
- canvas-confetti para easter egg
- **Vitest + React Testing Library** para TDD

---

## FASE 1: Setup Inicial

### 1.0 Configurar variable de entorno

Crear el archivo `.env` en la raíz del proyecto con el token de GitHub:

```bash
# Crear archivo .env con la variable GH_PUBLIC_REPO del sistema
echo 'VITE_GITHUB_TOKEN="${GH_PUBLIC_REPO}"' > .env
```

Esto permite que Vite acceda al token de GitHub para:
- 5000 requests/hora (vs 60 sin token)
- Acceso a GraphQL API para contribution graph real

### 1.1 Crear proyecto e inicializar repositorio

```bash
# Crear proyecto Vite
npm create vite@latest . -- --template react-ts
npm install

# IMPORTANTE: Crear repo ANTES de empezar a codear
git add .
git commit -m "chore: init vite + react + typescript project"
gh repo create alicante-frontend-demo --public --source=. --remote=origin --push
```

### 1.2 Instalar dependencias

```bash
# Dependencias de producción
npm install framer-motion recharts canvas-confetti lucide-react

# Dependencias de desarrollo (incluyendo testing)
npm install -D @types/canvas-confetti tailwindcss @tailwindcss/vite
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw
```

### 1.2.1 Instalar shadcn/ui

```bash
# Inicializar shadcn/ui con defaults
npx shadcn@latest init -d

# Agregar componentes necesarios
npx shadcn@latest add card progress badge avatar skeleton dialog
```

### 1.3 Configurar Vite y Vitest

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      reportsDirectory: './coverage',
    },
  },
})
```

**src/test/setup.ts:**
```typescript
import '@testing-library/jest-dom'

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))
```

**tsconfig.json** - agregar en compilerOptions:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

### 1.4 Configurar npm scripts

En **package.json**, reemplazar scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "verify": "tsc --noEmit && npm run build && npm run test:coverage"
  }
}
```

### 1.5 Configurar .gitignore para coverage

**IMPORTANTE:** La carpeta `coverage/` NO debe estar en `.gitignore` porque queremos que se suba al repositorio para mostrar los reportes de coverage en el dashboard.

Verificar que `.gitignore` NO contenga ninguna línea que ignore coverage:
```bash
# Verificar si coverage está en .gitignore
grep -n "coverage" .gitignore || echo "OK: coverage no está ignorado"

# Si aparece, removerlo manualmente del .gitignore
```

El `.gitignore` NO debe contener:
```
# NO incluir estas líneas:
# coverage/
# !coverage-summary.json
```

### 1.6 Commit y push setup

```bash
npm run verify
git add .
git commit -m "chore: setup tailwind, vitest and testing infrastructure"
git push
```

---

## GitHub API Token (Referencia)

El archivo `.env` ya fue creado en el paso 1.0 con la variable `CR_PAT` del sistema.

El token solo necesita permisos de "Public repositories" (read-only).

---

## Diseño

- Tema OSCURO: fondo #0a0a0f, texto #e8e8e8
- Accent color: #4ecdc4 (turquesa)
- Danger/Live: #ff6b6b (rojo)
- Cards: rgba(255,255,255,0.05) con borde rgba(255,255,255,0.1)
- Cuadrados vacíos contribution graph: #2d2d3a (visible sobre fondo oscuro)
- Sin bordes redondeados excesivos (border-radius: 8px max)
- Animaciones suaves con Framer Motion

## Estilos Base (src/index.css)

```css
@import "tailwindcss";

/* shadcn/ui CSS variables - Dark theme */
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 91%;

  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 91%;

  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 91%;

  --primary: 174 60% 55%;  /* turquesa #4ecdc4 */
  --primary-foreground: 240 10% 3.9%;

  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 91%;

  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;

  --accent: 174 60% 55%;  /* turquesa #4ecdc4 */
  --accent-foreground: 240 10% 3.9%;

  --destructive: 0 66% 71%;  /* rojo #ff6b6b */
  --destructive-foreground: 0 0% 91%;

  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 174 60% 55%;  /* turquesa #4ecdc4 */

  --radius: 0.5rem;

  /* Custom legacy variables for compatibility */
  --bg-primary: #0a0a0f;
  --text-primary: #e8e8e8;
  --danger: #ff6b6b;
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: rgba(255, 255, 255, 0.1);
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Legacy utility classes */
.text-accent { color: hsl(var(--primary)); }
.text-danger { color: hsl(var(--destructive)); }
.bg-accent { background-color: hsl(var(--primary)); }
```

---

## APIs de GitHub

### REST API (con token opcional en header Authorization: Bearer)
```
GET /users/boudydegeer
GET /users/boudydegeer/repos?per_page=100&sort=stars
GET /users/boudydegeer/events?per_page=50
GET /repos/boudydegeer/alicante-frontend-demo
GET /repos/boudydegeer/alicante-frontend-demo/commits?per_page=100
```

### GraphQL API (requiere token para contribution graph real)
```graphql
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
```

---

## Estructura de Archivos

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── progress.tsx
│   │   └── skeleton.tsx
│   ├── Header.tsx
│   ├── Header.test.tsx
│   ├── StatsCards.tsx
│   ├── StatsCards.test.tsx
│   ├── ContributionGraph.tsx
│   ├── ContributionGraph.test.tsx
│   ├── LanguagesChart.tsx
│   ├── LanguagesChart.test.tsx
│   ├── ActivityFeed.tsx
│   ├── ActivityFeed.test.tsx
│   ├── FeaturedRepos.tsx
│   ├── FeaturedRepos.test.tsx
│   ├── LiveRepoSection.tsx
│   ├── LiveRepoSection.test.tsx
│   ├── PromptModal.tsx
│   ├── PromptModal.test.tsx
│   ├── CoverageCard.tsx
│   └── CoverageCard.test.tsx
├── lib/
│   └── utils.ts               # shadcn/ui cn() utility
├── hooks/
│   ├── useGitHubUser.ts
│   ├── useGitHubRepos.ts
│   ├── useGitHubEvents.ts
│   ├── useLiveRepo.ts
│   └── useCoverage.ts
├── utils/
│   ├── api.ts
│   └── constants.ts        # GitHub config + PROMPT_CONTENT easter egg
├── test/
│   ├── setup.ts
│   └── mocks/
│       └── handlers.ts
├── App.tsx
├── main.tsx
└── index.css
components.json              # shadcn/ui config
coverage-summary.json (repo root, committed)
```

### Utils: constants.ts

The `src/utils/constants.ts` file contains configuration constants and the easter egg prompt content:

```typescript
// src/utils/constants.ts

export const GITHUB_USERNAME = 'boudydegeer'
export const LIVE_REPO_NAME = 'alicante-frontend-demo'
export const GITHUB_API_BASE = 'https://api.github.com'

// El contenido completo del prompt que genero este dashboard
// Se muestra en el PromptModal como easter egg
export const PROMPT_CONTENT = `
# Proyecto: GitHub Dashboard en Vivo
...
(El contenido completo del DEMO-PROMPT.md)
...
`
```

**Note:** The `PROMPT_CONTENT` constant holds the full demo prompt text (the content of DEMO-PROMPT.md itself). This is displayed in the PromptModal component as an easter egg when users click on the "EN VIVO" section.

---

## FASE 2: Componentes Core con TDD

### Componente 1: Header.tsx

#### RED - Escribir test que falla

**src/components/Header.test.tsx:**
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'

const mockUser = {
  login: 'boudydegeer',
  name: 'Boudy de Geer',
  avatar_url: 'https://example.com/avatar.png',
  bio: 'Software Developer',
  followers: 100,
  public_repos: 50,
}

describe('Header', () => {
  it('renders user name and bio', () => {
    render(<Header user={mockUser} totalStars={250} isLoading={false} />)

    expect(screen.getByText('Boudy de Geer')).toBeInTheDocument()
    expect(screen.getByText('Software Developer')).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading is true', () => {
    render(<Header user={null} totalStars={0} isLoading={true} />)

    expect(screen.getByTestId('header-skeleton')).toBeInTheDocument()
  })

  it('displays stats correctly', () => {
    render(<Header user={mockUser} totalStars={250} isLoading={false} />)

    expect(screen.getByText(/250/)).toBeInTheDocument() // stars
    expect(screen.getByText(/100/)).toBeInTheDocument() // followers
    expect(screen.getByText(/50/)).toBeInTheDocument() // repos
  })

  it('triggers confetti on avatar click', async () => {
    const user = userEvent.setup()
    render(<Header user={mockUser} totalStars={250} isLoading={false} />)

    const avatar = screen.getByRole('img', { name: /avatar/i })
    await user.click(avatar)

    // Confetti should be triggered (we mock canvas-confetti in setup)
    expect(avatar).toBeInTheDocument()
  })
})
```

```bash
npm run test:run
# Test FAILS (Header component doesn't exist) - RED
```

#### GREEN - Implementar para que pase

**src/components/Header.tsx:**
```typescript
import confetti from 'canvas-confetti'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { GitHubUser } from '../utils/api'

interface HeaderProps {
  user: GitHubUser | null
  totalStars: number
  isLoading: boolean
}

export function Header({ user, totalStars, isLoading }: HeaderProps) {
  const handleAvatarClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.15, y: 0.2 },
      colors: ['#4ecdc4', '#ff6b6b', '#f1e05a', '#3178c6', '#41b883'],
    })
  }

  if (isLoading || !user) {
    return (
      <header data-testid="header-skeleton" className="flex items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </header>
    )
  }

  return (
    <header className="flex flex-col md:flex-row items-center md:items-start gap-4">
      <Avatar
        className="w-20 h-20 cursor-pointer hover:scale-105 transition-transform"
        onClick={handleAvatarClick}
      >
        <AvatarImage src={user.avatar_url} alt="avatar" />
        <AvatarFallback>{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold">{user.name || user.login}</h1>
        <p className="text-muted-foreground">{user.bio}</p>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary">{totalStars} stars</Badge>
          <Badge variant="secondary">{user.followers} followers</Badge>
          <Badge variant="secondary">{user.public_repos} repos</Badge>
        </div>
      </div>
    </header>
  )
}
```

```bash
# After RED (test) + GREEN (implementation) + REFACTOR:
npm run verify
git add -A
git commit -m "feat: implement Header component with TDD"
git push
```

### Componente 2: StatsCards.tsx

#### RED - Test primero

**src/components/StatsCards.test.tsx:**
```typescript
import { render, screen } from '@testing-library/react'
import { StatsCards } from './StatsCards'

describe('StatsCards', () => {
  it('renders all 4 stat cards', () => {
    render(
      <StatsCards
        commitsThisYear={500}
        totalStars={250}
        publicRepos={50}
        commitsToday={5}
        isLoading={false}
      />
    )

    expect(screen.getByText(/commits this year/i)).toBeInTheDocument()
    expect(screen.getByText(/total stars/i)).toBeInTheDocument()
    expect(screen.getByText(/public repos/i)).toBeInTheDocument()
    expect(screen.getByText(/commits today/i)).toBeInTheDocument()
  })

  it('shows loading skeletons when isLoading is true', () => {
    render(
      <StatsCards
        commitsThisYear={0}
        totalStars={0}
        publicRepos={0}
        commitsToday={0}
        isLoading={true}
      />
    )

    expect(screen.getByTestId('stats-skeleton')).toBeInTheDocument()
  })
})
```

#### GREEN - Implementar

**src/components/StatsCards.tsx:**
```typescript
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatsCardsProps {
  commitsThisYear: number
  totalStars: number
  publicRepos: number
  commitsToday: number
  isLoading: boolean
}

export function StatsCards({
  commitsThisYear,
  totalStars,
  publicRepos,
  commitsToday,
  isLoading,
}: StatsCardsProps) {
  if (isLoading) {
    return (
      <div data-testid="stats-skeleton" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    { emoji: '📊', value: commitsThisYear, label: 'Commits this year' },
    { emoji: '⭐', value: totalStars, label: 'Total stars' },
    { emoji: '📁', value: publicRepos, label: 'Public repos' },
    { emoji: '🔥', value: commitsToday, label: 'Commits today' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4 text-center">
            <span className="text-2xl">{stat.emoji}</span>
            <div className="text-3xl font-bold text-primary">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

```bash
npm run verify
git add .
git commit -m "feat: implement StatsCards component with TDD"
git push
```

---

## FASE 3: Componentes Principales

### Componente 3: ContributionGraph.tsx

#### RED - Test primero

**src/components/ContributionGraph.test.tsx:**
```typescript
import { render, screen } from '@testing-library/react'
import { ContributionGraph } from './ContributionGraph'

const mockContributions = [
  { date: '2024-01-01', count: 0 },
  { date: '2024-01-02', count: 5 },
  { date: '2024-01-03', count: 10 },
]

describe('ContributionGraph', () => {
  it('renders contribution squares', () => {
    render(<ContributionGraph contributions={mockContributions} isLoading={false} />)

    const squares = screen.getAllByTestId(/contribution-day/)
    expect(squares.length).toBeGreaterThan(0)
  })

  it('shows loading skeleton when isLoading is true', () => {
    render(<ContributionGraph contributions={[]} isLoading={true} />)

    expect(screen.getByTestId('contribution-skeleton')).toBeInTheDocument()
  })

  it('applies correct color intensity based on count', () => {
    render(<ContributionGraph contributions={mockContributions} isLoading={false} />)

    // Day with 0 commits should have empty color
    const emptyDay = screen.getByTestId('contribution-day-2024-01-01')
    expect(emptyDay).toHaveStyle({ backgroundColor: '#2d2d3a' })
  })
})
```

#### GREEN - Implementar

**src/components/ContributionGraph.tsx:**
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ContributionDay } from '../utils/api'

interface ContributionGraphProps {
  contributions: ContributionDay[]
  isLoading: boolean
}

const COLORS = ['#2d2d3a', '#0e4d47', '#1a7a70', '#32a89e', '#4ecdc4']

function getColor(count: number): string {
  if (count === 0) return COLORS[0]
  if (count <= 2) return COLORS[1]
  if (count <= 5) return COLORS[2]
  if (count <= 10) return COLORS[3]
  return COLORS[4]
}

export function ContributionGraph({ contributions, isLoading }: ContributionGraphProps) {
  if (isLoading) {
    return (
      <Card data-testid="contribution-skeleton">
        <CardContent className="p-4">
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  // Group by weeks
  const weeks: ContributionDay[][] = []
  let currentWeek: ContributionDay[] = []

  contributions.forEach((day, i) => {
    const date = new Date(day.date)
    if (date.getDay() === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    currentWeek.push(day)
    if (i === contributions.length - 1) {
      weeks.push(currentWeek)
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}
        >
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  data-testid={`contribution-day-${day.date}`}
                  className="aspect-square w-full rounded-sm"
                  style={{ backgroundColor: getColor(day.count) }}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

```bash
npm run verify
git add .
git commit -m "feat: implement ContributionGraph component with TDD"
git push
```

### Componente 4: LiveRepoSection.tsx

#### RED - Test primero

**src/components/LiveRepoSection.test.tsx:**
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LiveRepoSection } from './LiveRepoSection'

const mockData = {
  exists: true,
  repoCreatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  lastCommitAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(), // 1 min ago
  elapsedTime: '29:00', // formatted elapsed time from repo creation to last commit
  totalAdditions: 500,
  fileCount: 12,
  lastCommit: { message: 'feat: add Header component', date: new Date().toISOString() },
  commitCount: 5,
}

describe('LiveRepoSection', () => {
  it('renders live indicator', () => {
    render(<LiveRepoSection data={mockData} isLoading={false} onOpenModal={() => {}} />)

    expect(screen.getByText(/en vivo/i)).toBeInTheDocument()
  })

  it('shows commit stats', () => {
    render(<LiveRepoSection data={mockData} isLoading={false} onOpenModal={() => {}} />)

    expect(screen.getByText(/500/)).toBeInTheDocument() // lines added
    expect(screen.getByText(/12/)).toBeInTheDocument() // files
    expect(screen.getByText(/5/)).toBeInTheDocument() // commits
  })

  it('calls onOpenModal when clicked', async () => {
    const user = userEvent.setup()
    const mockOnOpen = vi.fn()
    render(<LiveRepoSection data={mockData} isLoading={false} onOpenModal={mockOnOpen} />)

    await user.click(screen.getByTestId('live-repo-section'))

    expect(mockOnOpen).toHaveBeenCalled()
  })

  it('shows waiting message when repo does not exist', () => {
    render(
      <LiveRepoSection
        data={{ ...mockData, exists: false }}
        isLoading={false}
        onOpenModal={() => {}}
      />
    )

    expect(screen.getByText(/esperando primer commit/i)).toBeInTheDocument()
  })
})
```

#### GREEN - Implementar

**src/components/LiveRepoSection.tsx:**
```typescript
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface LiveRepoData {
  exists: boolean
  repoCreatedAt: string | null
  lastCommitAt: string | null
  elapsedTime: string  // "MM:SS" or "HH:MM:SS" formatted
  totalAdditions: number
  fileCount: number
  lastCommit: { message: string; date: string } | null
  commitCount: number
}

interface LiveRepoSectionProps {
  data: LiveRepoData
  isLoading: boolean
  onOpenModal: () => void
}

export function LiveRepoSection({ data, isLoading, onOpenModal }: LiveRepoSectionProps) {
  if (isLoading) {
    return (
      <Card className="border-2 border-destructive/50">
        <CardContent className="p-4">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      data-testid="live-repo-section"
      whileHover={{ scale: 1.02 }}
      animate={{ borderColor: ['hsl(var(--destructive))', 'hsl(0 66% 80%)', 'hsl(var(--destructive))'] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Card className="border-2 border-destructive cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
            </span>
            <Badge variant="destructive" className="animate-pulse">EN VIVO</Badge>
          </div>
          <a
            href="https://github.com/boudydegeer/alicante-frontend-demo"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </CardHeader>
        <CardContent className="pt-0" onClick={onOpenModal}>

          {!data.exists ? (
            <p className="text-muted-foreground">Esperando primer commit...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold">{data.elapsedTime}</div>
                  <div className="text-sm text-muted-foreground">Tiempo</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{data.totalAdditions}</div>
                  <div className="text-sm text-muted-foreground">Líneas +</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{data.fileCount}</div>
                  <div className="text-sm text-muted-foreground">Archivos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{data.commitCount}</div>
                  <div className="text-sm text-muted-foreground">Commits</div>
                </div>
              </div>
              {data.lastCommit && (
                <div className="text-sm text-muted-foreground">
                  Último: {data.lastCommit.message}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

```bash
npm run verify
git add .
git add coverage-summary.json
git commit -m "feat: implement LiveRepoSection component with TDD"
git push
```

### Componente 5: CoverageCard.tsx

#### RED - Test primero

**src/components/CoverageCard.test.tsx:**
```typescript
import { render, screen } from '@testing-library/react'
import { CoverageCard } from './CoverageCard'

const mockCoverage = {
  total: {
    statements: { pct: 85.5 },
    branches: { pct: 72.3 },
    functions: { pct: 90.1 },
    lines: { pct: 84.2 },
  },
}

describe('CoverageCard', () => {
  it('renders all 4 coverage metrics', () => {
    render(<CoverageCard coverage={mockCoverage} isLoading={false} />)

    expect(screen.getByText(/statements/i)).toBeInTheDocument()
    expect(screen.getByText(/branches/i)).toBeInTheDocument()
    expect(screen.getByText(/functions/i)).toBeInTheDocument()
    expect(screen.getByText(/lines/i)).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading is true', () => {
    render(<CoverageCard coverage={null} isLoading={true} />)

    expect(screen.getByTestId('coverage-skeleton')).toBeInTheDocument()
  })

  it('displays correct percentages', () => {
    render(<CoverageCard coverage={mockCoverage} isLoading={false} />)

    expect(screen.getByText('85.5%')).toBeInTheDocument()
    expect(screen.getByText('72.3%')).toBeInTheDocument()
    expect(screen.getByText('90.1%')).toBeInTheDocument()
    expect(screen.getByText('84.2%')).toBeInTheDocument()
  })

  it('applies green color for coverage > 80%', () => {
    render(<CoverageCard coverage={mockCoverage} isLoading={false} />)

    const statementsBar = screen.getByTestId('coverage-bar-statements')
    expect(statementsBar).toHaveStyle({ backgroundColor: '#4ecdc4' })
  })

  it('applies yellow color for coverage > 60% and <= 80%', () => {
    render(<CoverageCard coverage={mockCoverage} isLoading={false} />)

    const branchesBar = screen.getByTestId('coverage-bar-branches')
    expect(branchesBar).toHaveStyle({ backgroundColor: '#f1e05a' })
  })

  it('applies red color for coverage <= 60%', () => {
    const lowCoverage = {
      total: {
        statements: { pct: 45 },
        branches: { pct: 50 },
        functions: { pct: 55 },
        lines: { pct: 40 },
      },
    }
    render(<CoverageCard coverage={lowCoverage} isLoading={false} />)

    const statementsBar = screen.getByTestId('coverage-bar-statements')
    expect(statementsBar).toHaveStyle({ backgroundColor: '#ff6b6b' })
  })

  it('shows title with emoji', () => {
    render(<CoverageCard coverage={mockCoverage} isLoading={false} />)

    expect(screen.getByText(/test coverage/i)).toBeInTheDocument()
  })
})
```

#### GREEN - Implementar

**src/components/CoverageCard.tsx:**
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

interface CoverageData {
  total: {
    statements: { pct: number }
    branches: { pct: number }
    functions: { pct: number }
    lines: { pct: number }
  }
}

interface CoverageCardProps {
  coverage: CoverageData | null
  isLoading: boolean
}

function getColor(pct: number): string {
  if (pct > 80) return '#4ecdc4' // green/primary
  if (pct > 60) return '#f1e05a' // yellow
  return '#ff6b6b' // red/destructive
}

function getColorClass(pct: number): string {
  if (pct > 80) return 'text-primary'
  if (pct > 60) return 'text-yellow-400'
  return 'text-destructive'
}

export function CoverageCard({ coverage, isLoading }: CoverageCardProps) {
  if (isLoading || !coverage) {
    return (
      <Card data-testid="coverage-skeleton">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const metrics = [
    { key: 'statements', label: 'Statements', pct: coverage.total.statements.pct },
    { key: 'branches', label: 'Branches', pct: coverage.total.branches.pct },
    { key: 'functions', label: 'Functions', pct: coverage.total.functions.pct },
    { key: 'lines', label: 'Lines', pct: coverage.total.lines.pct },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Coverage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.key}>
              <div className={`text-2xl font-bold ${getColorClass(metric.pct)}`}>
                {metric.pct}%
              </div>
              <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
              <div
                data-testid={`coverage-bar-${metric.key}`}
                className="h-2 rounded overflow-hidden bg-secondary"
                style={{ backgroundColor: getColor(metric.pct) }}
              >
                <Progress
                  value={metric.pct}
                  className="h-2"
                  style={{
                    '--progress-background': getColor(metric.pct),
                  } as React.CSSProperties}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

#### Hook: useCoverage.ts

**src/hooks/useCoverage.ts:**
```typescript
import { useState, useEffect } from 'react'

interface CoverageData {
  total: {
    statements: { pct: number }
    branches: { pct: number }
    functions: { pct: number }
    lines: { pct: number }
  }
}

const COVERAGE_URL = 'https://raw.githubusercontent.com/boudydegeer/alicante-frontend-demo/main/coverage-summary.json'

export function useCoverage() {
  const [coverage, setCoverage] = useState<CoverageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCoverage = async () => {
      try {
        const response = await fetch(COVERAGE_URL)
        if (!response.ok) {
          throw new Error('Coverage data not found')
        }
        const data = await response.json()
        setCoverage(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchCoverage()

    // Poll every 30 seconds
    const interval = setInterval(fetchCoverage, 30000)
    return () => clearInterval(interval)
  }, [])

  return { coverage, isLoading, error }
}
```

```bash
npm run verify
git add .
git add coverage-summary.json
git commit -m "feat: implement CoverageCard component with TDD"
git push
```

---

## FASE 4: Columnas - Lenguajes y Actividad

### Componente 6: LanguagesChart.tsx

#### RED - Test primero

**src/components/LanguagesChart.test.tsx:**
```typescript
import { render, screen } from '@testing-library/react'
import { LanguagesChart } from './LanguagesChart'

const mockLanguages = [
  { name: 'TypeScript', percentage: 45, color: '#3178c6' },
  { name: 'JavaScript', percentage: 30, color: '#f1e05a' },
  { name: 'Python', percentage: 15, color: '#3572A5' },
  { name: 'CSS', percentage: 7, color: '#563d7c' },
  { name: 'HTML', percentage: 3, color: '#e34c26' },
]

describe('LanguagesChart', () => {
  it('renders all languages', () => {
    render(<LanguagesChart languages={mockLanguages} isLoading={false} />)

    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading is true', () => {
    render(<LanguagesChart languages={[]} isLoading={true} />)

    expect(screen.getByTestId('languages-skeleton')).toBeInTheDocument()
  })

  it('displays percentages', () => {
    render(<LanguagesChart languages={mockLanguages} isLoading={false} />)

    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
  })

  it('renders chart title', () => {
    render(<LanguagesChart languages={mockLanguages} isLoading={false} />)

    expect(screen.getByText(/languages/i)).toBeInTheDocument()
  })

  it('limits to top 5 languages', () => {
    const manyLanguages = [
      ...mockLanguages,
      { name: 'Go', percentage: 2, color: '#00ADD8' },
      { name: 'Rust', percentage: 1, color: '#DEA584' },
    ]
    render(<LanguagesChart languages={manyLanguages} isLoading={false} />)

    // Should only show first 5
    expect(screen.queryByText('Go')).not.toBeInTheDocument()
    expect(screen.queryByText('Rust')).not.toBeInTheDocument()
  })
})
```

#### GREEN - Implementar

**src/components/LanguagesChart.tsx:**
```typescript
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

interface Language {
  name: string
  percentage: number
  color: string
}

interface LanguagesChartProps {
  languages: Language[]
  isLoading: boolean
}

export function LanguagesChart({ languages, isLoading }: LanguagesChartProps) {
  if (isLoading) {
    return (
      <Card data-testid="languages-skeleton">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const topLanguages = languages.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Languages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topLanguages}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fill: '#ffffff', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                {topLanguages.map((lang, index) => (
                  <Cell key={index} fill={lang.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/*
          NOTA: NO usar fondo de color en los labels de la leyenda.
          Los labels deben ser texto simple con color claro (text-muted-foreground)
          sobre el fondo oscuro del card. Solo el punto/círculo lleva el color del lenguaje.
          Esto evita problemas de legibilidad con fondos azules u oscuros.
        */}
        <div className="mt-4 flex flex-wrap gap-3">
          {topLanguages.map((lang) => (
            <span
              key={lang.name}
              className="text-xs text-muted-foreground flex items-center gap-1"
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: lang.color }}
              />
              {lang.name} {lang.percentage}%
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

```bash
npm run verify
git add .
git commit -m "feat: implement LanguagesChart component with TDD"
git push
```

### Componente 7: ActivityFeed.tsx

#### RED - Test primero

**src/components/ActivityFeed.test.tsx:**
```typescript
import { render, screen } from '@testing-library/react'
import { ActivityFeed } from './ActivityFeed'

const mockEvents = [
  {
    id: '1',
    type: 'PushEvent',
    repo: { name: 'user/repo1' },
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    payload: { commits: [{ message: 'fix: bug' }] },
  },
  {
    id: '2',
    type: 'PullRequestEvent',
    repo: { name: 'user/repo2' },
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    payload: { action: 'opened' },
  },
  {
    id: '3',
    type: 'WatchEvent',
    repo: { name: 'user/repo3' },
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    payload: {},
  },
]

describe('ActivityFeed', () => {
  it('renders events', () => {
    render(<ActivityFeed events={mockEvents} isLoading={false} />)

    expect(screen.getByText(/repo1/)).toBeInTheDocument()
    expect(screen.getByText(/repo2/)).toBeInTheDocument()
    expect(screen.getByText(/repo3/)).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading is true', () => {
    render(<ActivityFeed events={[]} isLoading={true} />)

    expect(screen.getByTestId('activity-skeleton')).toBeInTheDocument()
  })

  it('displays relative time', () => {
    render(<ActivityFeed events={mockEvents} isLoading={false} />)

    expect(screen.getByText(/5m ago/i)).toBeInTheDocument()
    expect(screen.getByText(/30m ago/i)).toBeInTheDocument()
    expect(screen.getByText(/1h ago/i)).toBeInTheDocument()
  })

  it('shows event type icons', () => {
    render(<ActivityFeed events={mockEvents} isLoading={false} />)

    // Should have push, PR, and star icons
    expect(screen.getByTestId('event-icon-push')).toBeInTheDocument()
    expect(screen.getByTestId('event-icon-pr')).toBeInTheDocument()
    expect(screen.getByTestId('event-icon-star')).toBeInTheDocument()
  })

  it('shows title', () => {
    render(<ActivityFeed events={mockEvents} isLoading={false} />)

    expect(screen.getByText(/activity/i)).toBeInTheDocument()
  })

  it('limits to 8 events', () => {
    const manyEvents = Array.from({ length: 15 }, (_, i) => ({
      id: String(i),
      type: 'PushEvent',
      repo: { name: `user/repo${i}` },
      created_at: new Date().toISOString(),
      payload: { commits: [{ message: 'commit' }] },
    }))
    render(<ActivityFeed events={manyEvents} isLoading={false} />)

    // Should only render 8 events
    const items = screen.getAllByTestId(/event-item/)
    expect(items.length).toBe(8)
  })
})
```

#### GREEN - Implementar

**src/components/ActivityFeed.tsx:**
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { GitHubEvent } from '../utils/api'

interface ActivityFeedProps {
  events: GitHubEvent[]
  isLoading: boolean
}

function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function getEventIcon(type: string): { icon: string; testId: string } {
  switch (type) {
    case 'PushEvent':
      return { icon: '📝', testId: 'event-icon-push' }
    case 'PullRequestEvent':
      return { icon: '🔀', testId: 'event-icon-pr' }
    case 'WatchEvent':
      return { icon: '⭐', testId: 'event-icon-star' }
    case 'ForkEvent':
      return { icon: '🍴', testId: 'event-icon-fork' }
    case 'CreateEvent':
      return { icon: '➕', testId: 'event-icon-create' }
    case 'IssuesEvent':
      return { icon: '🐛', testId: 'event-icon-issue' }
    default:
      return { icon: '📌', testId: 'event-icon-default' }
  }
}

function getEventDescription(event: GitHubEvent): string {
  const repoName = event.repo.name.split('/')[1]
  switch (event.type) {
    case 'PushEvent':
      return `pushed to ${repoName}`
    case 'PullRequestEvent':
      return `${event.payload.action} PR in ${repoName}`
    case 'WatchEvent':
      return `starred ${repoName}`
    case 'ForkEvent':
      return `forked ${repoName}`
    case 'CreateEvent':
      return `created ${repoName}`
    case 'IssuesEvent':
      return `${event.payload.action} issue in ${repoName}`
    default:
      return `activity in ${repoName}`
  }
}

export function ActivityFeed({ events, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card data-testid="activity-skeleton">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const displayEvents = events.slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {displayEvents.map((event) => {
            const { icon, testId } = getEventIcon(event.type)
            return (
              <div
                key={event.id}
                data-testid={`event-item-${event.id}`}
                className="flex items-start gap-2 text-sm"
              >
                <span data-testid={testId}>{icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-foreground/80">{getEventDescription(event)}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getRelativeTime(event.created_at)}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
```

```bash
npm run verify
git add .
git commit -m "feat: implement ActivityFeed component with TDD"
git push
```

---

## FASE 5: Repos Destacados y Easter Egg

### Componente 8: FeaturedRepos.tsx

#### RED - Test primero

**src/components/FeaturedRepos.test.tsx:**
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FeaturedRepos } from './FeaturedRepos'

const mockRepos = [
  {
    id: 1,
    name: 'awesome-project',
    description: 'A really awesome project that does amazing things',
    html_url: 'https://github.com/user/awesome-project',
    stargazers_count: 150,
    forks_count: 30,
    language: 'TypeScript',
  },
  {
    id: 2,
    name: 'cool-lib',
    description: 'A cool library',
    html_url: 'https://github.com/user/cool-lib',
    stargazers_count: 100,
    forks_count: 20,
    language: 'JavaScript',
  },
  {
    id: 3,
    name: 'my-app',
    description: null,
    html_url: 'https://github.com/user/my-app',
    stargazers_count: 50,
    forks_count: 10,
    language: 'Python',
  },
]

describe('FeaturedRepos', () => {
  it('renders top 3 repos', () => {
    render(<FeaturedRepos repos={mockRepos} isLoading={false} />)

    expect(screen.getByText('awesome-project')).toBeInTheDocument()
    expect(screen.getByText('cool-lib')).toBeInTheDocument()
    expect(screen.getByText('my-app')).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading is true', () => {
    render(<FeaturedRepos repos={[]} isLoading={true} />)

    expect(screen.getByTestId('repos-skeleton')).toBeInTheDocument()
  })

  it('displays star counts', () => {
    render(<FeaturedRepos repos={mockRepos} isLoading={false} />)

    expect(screen.getByText(/150/)).toBeInTheDocument()
    expect(screen.getByText(/100/)).toBeInTheDocument()
  })

  it('displays fork counts', () => {
    render(<FeaturedRepos repos={mockRepos} isLoading={false} />)

    expect(screen.getByText(/30/)).toBeInTheDocument()
    expect(screen.getByText(/20/)).toBeInTheDocument()
  })

  it('shows language with color', () => {
    render(<FeaturedRepos repos={mockRepos} isLoading={false} />)

    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('truncates long descriptions', () => {
    render(<FeaturedRepos repos={mockRepos} isLoading={false} />)

    // Description should be truncated with ellipsis in CSS
    const description = screen.getByText(/A really awesome project/)
    expect(description).toHaveClass('line-clamp-2')
  })

  it('shows title', () => {
    render(<FeaturedRepos repos={mockRepos} isLoading={false} />)

    expect(screen.getByText(/featured repos/i)).toBeInTheDocument()
  })

  it('repo cards are clickable links', () => {
    render(<FeaturedRepos repos={mockRepos} isLoading={false} />)

    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', 'https://github.com/user/awesome-project')
    expect(links[0]).toHaveAttribute('target', '_blank')
  })
})
```

#### GREEN - Implementar

**src/components/FeaturedRepos.tsx:**
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { GitHubRepo } from '../utils/api'

interface FeaturedReposProps {
  repos: GitHubRepo[]
  isLoading: boolean
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Vue: '#41b883',
  default: '#8b949e',
}

export function FeaturedRepos({ repos, isLoading }: FeaturedReposProps) {
  if (isLoading) {
    return (
      <Card data-testid="repos-skeleton">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-secondary rounded">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const topRepos = repos.slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Repos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {topRepos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-secondary rounded hover:bg-secondary/80 transition-colors"
            >
              <h4 className="font-semibold text-primary truncate">{repo.name}</h4>
              {repo.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{repo.description}</p>
              )}
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <Badge variant="outline" className="gap-1">
                  <span>⭐</span>
                  <span>{repo.stargazers_count}</span>
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <span>🍴</span>
                  <span>{repo.forks_count}</span>
                </Badge>
                {repo.language && (
                  <Badge
                    variant="outline"
                    className="gap-1"
                    style={{ borderColor: LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.default }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.default }}
                    />
                    <span>{repo.language}</span>
                  </Badge>
                )}
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Note:** The FeaturedRepos component handles its own responsive grid internally (`grid gap-4 md:grid-cols-3`), so in App.tsx you use it directly without wrapping it in a grid container.

```bash
npm run verify
git add .
git commit -m "feat: implement FeaturedRepos component with TDD"
git push
```

### Componente 9: PromptModal.tsx

#### RED - Test primero

**src/components/PromptModal.test.tsx:**
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PromptModal } from './PromptModal'

describe('PromptModal', () => {
  it('renders when isOpen is true', () => {
    render(<PromptModal isOpen={true} onClose={() => {}} />)

    expect(screen.getByText(/prompt/i)).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<PromptModal isOpen={false} onClose={() => {}} />)

    expect(screen.queryByText(/prompt/i)).not.toBeInTheDocument()
  })

  it('calls onClose when X button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnClose = vi.fn()
    render(<PromptModal isOpen={true} onClose={mockOnClose} />)

    await user.click(screen.getByRole('button', { name: /close/i }))

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const mockOnClose = vi.fn()
    render(<PromptModal isOpen={true} onClose={mockOnClose} />)

    await user.click(screen.getByTestId('modal-backdrop'))

    expect(mockOnClose).toHaveBeenCalled()
  })
})
```

#### GREEN - Implementar

**src/components/PromptModal.tsx:**
```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PROMPT_CONTENT } from '../utils/constants'

interface PromptModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PromptModal({ isOpen, onClose }: PromptModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-testid="modal-backdrop"
        className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>El Prompt</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
            {PROMPT_CONTENT}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

```bash
npm run verify
git add .
git commit -m "feat: implement PromptModal easter egg with TDD"
git push
```

---

## Ejemplos de Uso de shadcn/ui

### Ejemplo 1: StatsCard con Card y Skeleton

```typescript
// Uso de Card para estadísticas con skeleton loading
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Loading state con Skeleton
<Card>
  <CardContent className="p-4">
    <Skeleton className="h-8 w-16 mb-2" />
    <Skeleton className="h-4 w-24" />
  </CardContent>
</Card>

// Estado con datos
<Card>
  <CardContent className="p-4 text-center">
    <span className="text-2xl">📊</span>
    <div className="text-3xl font-bold text-primary">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </CardContent>
</Card>
```

### Ejemplo 2: CoverageCard con Progress

```typescript
// Uso de Progress para barras de cobertura
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

<Card>
  <CardHeader>
    <CardTitle>Test Coverage</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {metrics.map((metric) => (
        <div key={metric.key}>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-muted-foreground">{metric.label}</span>
            <span className={`text-sm font-bold ${getColorClass(metric.pct)}`}>
              {metric.pct}%
            </span>
          </div>
          <Progress
            value={metric.pct}
            className="h-2"
            indicatorClassName={getProgressColor(metric.pct)}
          />
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

### Ejemplo 3: PromptModal con Dialog

```typescript
// Uso de Dialog para modales
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="max-w-4xl max-h-[90vh]">
    <DialogHeader>
      <DialogTitle>El Prompt</DialogTitle>
      <DialogDescription>
        Este es el prompt usado para generar el dashboard
      </DialogDescription>
    </DialogHeader>
    <div className="overflow-auto">
      <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
        {content}
      </pre>
    </div>
  </DialogContent>
</Dialog>
```

### Mapeo de clases legacy a shadcn/ui

| Legacy               | shadcn/ui               |
| -------------------- | ----------------------- |
| `text-white/60`      | `text-muted-foreground` |
| `text-accent`        | `text-primary`          |
| `text-danger`        | `text-destructive`      |
| `bg-white/10`        | `bg-secondary`          |
| `border-white/10`    | `border-border`         |
| `.card` class        | `<Card>` component      |
| `animate-pulse divs` | `<Skeleton>` component  |

---

## FASE 6: Polish y Conexión

### Hooks

**src/hooks/useGitHubUser.ts:**
```typescript
// Retorna: { user, isLoading, error }
// user: GitHubUser | null
```

**src/hooks/useGitHubRepos.ts:**
```typescript
// Retorna: { repos, topRepos, totalStars, languages, isLoading, error }
// topRepos: top 3 por stars
// languages: array de { name, percentage, color }
```

**src/hooks/useGitHubEvents.ts:**
```typescript
// Retorna: { events, commitsToday, contributions, isLoading, error }
// contributions: 365 días de ContributionDay[]
// Si hay token: usa GraphQL para contributions reales
// Sin token: genera mock data realista como fallback
```

**src/hooks/useLiveRepo.ts:**
```typescript
// Fetches repo info and commits from GitHub API:
// - GET /repos/{owner}/{repo} → `created_at` for repo creation date
// - GET /repos/{owner}/{repo}/commits → last commit date and stats
// Calculates: elapsedTime = lastCommitDate - repoCreatedAt
// Formats time as "MM:SS" or "HH:MM:SS"
//
// Retorna: {
//   data: {
//     exists: boolean,
//     repoCreatedAt: string,
//     lastCommitAt: string,
//     elapsedTime: string,  // "29:41" formatted
//     totalAdditions: number,
//     fileCount: number,
//     lastCommit: { message: string, date: string },
//     commitCount: number
//   },
//   isLoading: boolean,
//   refetch: () => void
// }
// Polling cada 30 segundos
```

### API Utils (src/utils/api.ts)

```typescript
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string | undefined

// Headers con token opcional
const headers: HeadersInit = {
  'Accept': 'application/vnd.github.v3+json',
}
if (GITHUB_TOKEN) {
  headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`
}

// Exportar tipos con 'export type' para verbatimModuleSyntax
export type GitHubUser = { ... }
export type GitHubRepo = { ... }
export type GitHubEvent = { ... }
export interface ContributionDay { date: string; count: number }

// Función GraphQL para contributions
export async function fetchContributions(username: string): Promise<ContributionDay[]>
```

### TypeScript: Imports de Tipos

IMPORTANTE: El proyecto usa `verbatimModuleSyntax: true`. Importar tipos así:
```typescript
import { api, type GitHubUser } from '../utils/api'
```

### Conectar componentes y agregar animaciones

```bash
npm run verify
git add .
git commit -m "feat: connect all components to GitHub API"
git push

# Agregar animaciones
npm run verify
git add .
git commit -m "style: add Framer Motion animations"
git push

# Polish responsive
npm run verify
git add .
git commit -m "style: polish responsive design"
git push
```

---

## FASE 7: Buffer y Demo Final

```bash
# Verificación final
npm run verify

# IMPORTANTE: Asegurar que la carpeta coverage/ esté en el repositorio
# 1. Verificar que coverage/ NO esté en .gitignore
if grep -q "^coverage" .gitignore; then
  echo "REMOVIENDO coverage/ de .gitignore..."
  sed -i '' '/^coverage/d' .gitignore
fi

# 2. Agregar coverage/ explícitamente si existe
if [ -d "coverage" ]; then
  git add coverage/
  echo "Carpeta coverage/ agregada al staging"
fi

# Último commit si hay fixes (incluyendo coverage)
git add .
git commit -m "fix: final polish and bug fixes"
git push

# Abrir dashboard
npm run dev
```

---

## FASE 8: Deploy a Producción

### 8.1 Linkear proyecto con Vercel

```bash
vercel link -y
```

### 8.2 Configurar variables de entorno

Leer el archivo `.env` del proyecto y añadir cada variable a Vercel:

```bash
# Para cada KEY=VALUE en .env, ejecutar:
vercel env add KEY production < <(echo "VALUE")
```

Ejemplo: si `.env` contiene `VITE_GITHUB_TOKEN=ghp_xxxxx`, ejecutar:
```bash
echo "ghp_xxxxx" | vercel env add VITE_GITHUB_TOKEN production
```

### 8.3 Deploy a producción

```bash
vercel --prod --yes
```

### 8.4 Mostrar URL

Copiar la URL del output y mostrarla al usuario. El dashboard está ahora accesible públicamente.

---

## FASE 9: Métricas Finales y Actualización de Slides

Esta fase se ejecuta DESPUÉS de que el proyecto esté completamente desplegado y funcionando. Su objetivo es recopilar las métricas reales del proyecto construido y actualizar las slides de la presentación con datos concretos.

### 9.1 Contar líneas de código reales

Contar las líneas de código del proyecto excluyendo dependencias y archivos generados:

```bash
# Contar líneas en archivos .vue, .ts, .js, .css
# Excluir: node_modules, dist, coverage, .nuxt, etc.
find . -type f \( -name "*.vue" -o -name "*.ts" -o -name "*.js" -o -name "*.css" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/dist/*" \
  ! -path "*/.nuxt/*" \
  ! -path "*/coverage/*" \
  ! -path "*/.output/*" \
  -exec wc -l {} + | tail -1
```

### 9.2 Contar componentes Vue

Contar el número de componentes Vue creados:

```bash
# Contar archivos .vue (excluyendo node_modules)
find . -name "*.vue" ! -path "*/node_modules/*" | wc -l
```

### 9.3 Identificar features funcionales

Revisar el proyecto y listar las features principales implementadas:
- Dashboard principal con stats
- Gráfico de contribuciones
- Sección "EN VIVO" con métricas del repo
- Card de cobertura de tests
- Gráfico de lenguajes
- Feed de actividad
- Repos destacados
- Modal con el prompt (easter egg)
- Animaciones con Framer Motion
- Tema oscuro
- Responsive design
- Confetti en avatar

### 9.4 Actualizar archivo de slides

Modificar el archivo `/Users/boudydegeer/Projects/charla-alicante-frontend-vue/slides.md` en la sección "# Demo en vivo" (aproximadamente líneas 489-537).

Buscar y reemplazar los valores placeholder:
- `~X` líneas de código → número real de líneas
- `X` componentes → número real de componentes Vue
- `X` features funcionales → número real de features

La sección actual tiene este formato:
```markdown
<div class="text-center">
  <span class="block text-6xl font-bold text-teal-400">~X</span>
  <span class="text-gray-400 text-lg">líneas de código</span>
</div>

<div class="text-center">
  <span class="block text-6xl font-bold text-teal-400">X</span>
  <span class="text-gray-400 text-lg">componentes</span>
</div>

<div class="text-center">
  <span class="block text-6xl font-bold text-teal-400">X</span>
  <span class="text-gray-400 text-lg">features funcionales</span>
</div>
```

Actualizar con los valores reales obtenidos en los pasos anteriores.

### 9.5 Obtener URL pública de Vercel

Obtener la URL del despliegue de producción:

```bash
# Obtener la URL del último deployment de producción
vercel ls --prod 2>/dev/null | grep -E "https://" | head -1 | awk '{print $1}'
```

Alternativamente, la URL estará en el output del comando `vercel --prod --yes` de la Fase 8.3.

### 9.6 Agregar link de Vercel en las slides

Modificar el archivo `/Users/boudydegeer/Projects/charla-alicante-frontend-vue/slides.md` para agregar el link del dashboard desplegado.

Buscar la sección "# Demo en vivo" (aproximadamente línea 480) y agregar el link de Vercel justo después del título:

```markdown
# Demo en vivo {.text-teal-400}

<p class="text-gray-400 text-lg mt-4">
  <a href="https://TU-URL-VERCEL.vercel.app" target="_blank" class="text-teal-400 hover:underline">
    Ver dashboard en vivo
  </a>
</p>
```

Reemplazar `TU-URL-VERCEL.vercel.app` con la URL real obtenida en el paso 9.5.

### 9.7 Verificar actualización

Confirmar que el archivo slides.md tiene los valores correctos y que las slides se renderizan correctamente.

---

## Layout del Dashboard

### 1. Layout Structure

**Desktop Layout (ASCII diagram):**

```
┌─────────────────────────────────────────────────────────────────┐
│                           HEADER                                │
│         Avatar | Nombre | Bio | ⭐ Stars | 👥 Followers         │
└─────────────────────────────────────────────────────────────────┘

┌───────────────┬───────────────┬───────────────┬───────────────┐
│  Commits Año  │  Stars Total  │    Repos      │  Commits Hoy  │
│     1,247     │      892      │      47       │       12      │
└───────────────┴───────────────┴───────────────┴───────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    CONTRIBUTION GRAPH (365 días)                │
│  ░░▓▓░░▓░░░▓▓▓░░░░▓▓░░▓▓▓▓░░░▓░░▓▓░░░▓▓▓░░░░▓▓░░▓▓▓▓░░░▓░░    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────┬───────────────────────────────┐
│         🔴 EN VIVO              │         🧪 COVERAGE           │
│  Tiempo: 12:34  |  +847 líneas  │  Statements: 87%  ████████░░  │
│  Archivos: 12   |  Commits: 8   │  Branches:   72%  ███████░░░  │
│  Último: "feat: add Header..."  │  Functions:  91%  █████████░  │
│                                 │  Lines:      85%  ████████░░  │
└─────────────────────────────────┴───────────────────────────────┘

┌───────────────────────────────────┬─────────────────────────────┐
│         📊 LENGUAJES              │        📜 ACTIVIDAD         │
│                                   │                             │
│  TypeScript ████████████████ 45%  │  📤 pushed to main    5m    │
│  JavaScript ███████████      30%  │  ⭐ starred repo     12m    │
│  Python     ██████           15%  │  🔀 opened PR         1h    │
│  Go         ███               8%  │  🍴 forked repo       2h    │
│  Other      █                 2%  │  📤 pushed to main    3h    │
└───────────────────────────────────┴─────────────────────────────┘

┌─────────────────────┬─────────────────────┬─────────────────────┐
│    ⭐ claude-code   │   ⭐ dotfiles       │   ⭐ api-utils      │
│                     │                     │                     │
│  CLI tool for...    │  My personal...     │  Collection of...   │
│                     │                     │                     │
│  ⭐ 234   🍴 12     │  ⭐ 156   🍴 8      │  ⭐ 89    🍴 5      │
│  ● TypeScript       │  ● Shell            │  ● Python           │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

### 2. Row Structure Table

| Fila | Contenido            | Grid Desktop       | Grid Tablet | Grid Mobile |
| ---- | -------------------- | ------------------ | ----------- | ----------- |
| 1    | Header               | full width         | full width  | full width  |
| 2    | StatsCards           | 4 columnas         | 2 columnas  | 1 columna   |
| 3    | ContributionGraph    | full width         | full width  | full width  |
| 4    | LiveRepo + Coverage  | 2 columnas (50/50) | 2 columnas  | 1 columna   |
| 5    | Languages + Activity | 2 columnas (50/50) | 2 columnas  | 1 columna   |
| 6    | FeaturedRepos        | 3 columnas         | 2 columnas  | 1 columna   |

### 3. Breakpoints

```
Mobile:  < 640px   (sm)
Tablet:  640px - 1023px (md)
Desktop: ≥ 1024px (lg)
```

### 4. App.tsx Layout Code

```tsx
function App() {
  // ... hooks here

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Row 1: Header */}
        <Header user={user} isLoading={userLoading} />

        {/* Row 2: Stats Cards - 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCards
            commitsThisYear={commitsThisYear}
            totalStars={totalStars}
            repoCount={repos.length}
            commitsToday={commitsToday}
            isLoading={statsLoading}
          />
        </div>

        {/* Row 3: Contribution Graph - full width */}
        <ContributionGraph contributions={contributions} isLoading={contribLoading} />

        {/* Row 4: Live Repo + Coverage - 1 col mobile, 2 col tablet+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LiveRepoSection data={liveData} isLoading={liveLoading} onClick={openModal} />
          <CoverageCard coverage={coverage} isLoading={coverageLoading} />
        </div>

        {/* Row 5: Languages + Activity - 1 col mobile, 2 col tablet+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LanguagesChart languages={languages} isLoading={langLoading} />
          <ActivityFeed events={events} isLoading={eventsLoading} />
        </div>

        {/* Row 6: Featured Repos - 1 col mobile, 2 col tablet, 3 col desktop */}
        <FeaturedRepos repos={topRepos} isLoading={reposLoading} />
      </div>

      {/* Modal */}
      <PromptModal isOpen={modalOpen} onClose={closeModal} />
    </div>
  )
}
```

### 5. Tailwind Responsive Classes Summary

| Pattern          | Meaning                              |
| ---------------- | ------------------------------------ |
| `grid-cols-1`    | 1 column (mobile default)            |
| `sm:grid-cols-2` | 2 columns at ≥640px                  |
| `md:grid-cols-2` | 2 columns at ≥768px                  |
| `lg:grid-cols-3` | 3 columns at ≥1024px                 |
| `lg:grid-cols-4` | 4 columns at ≥1024px                 |
| `gap-4`          | 1rem gap between items               |
| `space-y-6`      | 1.5rem vertical spacing between rows |

---

## Orden de Commits (TDD)

1. `chore: init vite + react + typescript project`
2. `chore: setup tailwind, vitest and testing infrastructure`
3. `feat: implement Header component with TDD`
4. `feat: implement StatsCards component with TDD`
5. `feat: implement ContributionGraph component with TDD`
6. `feat: implement LiveRepoSection component with TDD`
7. `feat: implement CoverageCard component with TDD`
8. `feat: implement LanguagesChart component with TDD`
9. `feat: implement ActivityFeed component with TDD`
10. `feat: implement FeaturedRepos component with TDD`
11. `feat: implement PromptModal easter egg with TDD`
12. `feat: connect all components to GitHub API`
13. `style: add Framer Motion animations`
14. `style: polish responsive design`
15. `fix: final polish and bug fixes`
16. `vercel --prod --yes` → Deploy a producción

### Workflow de Commit con Coverage

Después de cada ciclo TDD, el workflow incluye coverage:
```bash
npm run verify  # Genera coverage automáticamente en ./coverage/

# IMPORTANTE: Asegurarse de que coverage/ se suba al repositorio
# Verificar que coverage/ NO esté en .gitignore
grep -q "^coverage" .gitignore && sed -i '' '/^coverage/d' .gitignore || true

# Agregar la carpeta coverage completa al commit
git add -A
git add coverage/  # Agregar toda la carpeta coverage con sus archivos
git commit -m "feat: implement X with TDD"
git push
```

**Nota:** La carpeta `coverage/` contiene:
- `coverage-summary.json`: Resumen de métricas (usado por el dashboard)
- Otros archivos de reporte que pueden ser útiles para debugging

---

## Fallbacks y Error Handling

- Loading: skeleton con animate-pulse en cada componente
- Sin token GraphQL: mock data para contribution graph
- API error: mostrar último dato conocido o mock data
- Repo no existe: "Esperando primer commit..."
- NUNCA mostrar errores técnicos al usuario
- Todos los componentes tienen prop isLoading

---

## Resultado Final

El dashboard debe:
- Cargar sin errores en localhost:5173
- Mostrar datos reales de boudydegeer
- Contribution graph de 365 días ocupando todo el ancho
- **LanguagesChart con top 5 lenguajes (Recharts bar chart)**
- **ActivityFeed con últimos 8 eventos y tiempo relativo**
- **FeaturedRepos con top 3 repos clickeables**
- Actualizar sección "en vivo" cada 30s
- **Coverage card mostrando test coverage real (actualiza cada 30s)**
- Confetti al click en avatar
- Modal con prompt al click en "EN VIVO"
- Responsive: funcionar en mobile, tablet y desktop
- Animaciones suaves y coordinadas
- **Todos los tests pasando**
- **Coverage visible con barras de progreso coloreadas (verde/amarillo/rojo)**
- Dashboard desplegado en Vercel con URL pública
- Accesible desde cualquier dispositivo en la sala
