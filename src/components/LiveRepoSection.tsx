import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface LiveRepoData {
  exists: boolean
  repoCreatedAt: string | null
  lastCommitAt: string | null
  elapsedTime: string
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
      onClick={onOpenModal}
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
        <CardContent className="pt-0">
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
                  <div className="text-sm text-muted-foreground">Lineas +</div>
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
                  Ultimo: {data.lastCommit.message}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
