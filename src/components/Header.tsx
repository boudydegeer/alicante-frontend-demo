import confetti from 'canvas-confetti'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  followers: number
  public_repos: number
}

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
      <button
        data-testid="avatar-button"
        onClick={handleAvatarClick}
        className="cursor-pointer hover:scale-105 transition-transform"
      >
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.avatar_url} alt="avatar" />
          <AvatarFallback>{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </button>
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
