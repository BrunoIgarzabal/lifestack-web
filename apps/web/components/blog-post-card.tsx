import Link from "next/link"
import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { AuthorBio } from "@workspace/ui/components/author-bio"
import { TagBadge } from "@workspace/ui/components/tag-badge"
import { formatDate, calculateReadTime } from "@workspace/ui/lib/utils"

interface BlogPost {
  id: string
  title: string
  subtitle: string
  content: string
  author: {
    name: string
    bio: string
    avatar?: string
  }
  publishedAt: Date
  tags: string[]
}

interface BlogPostCardProps {
  post: BlogPost
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const readTime = calculateReadTime(post.content)

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <Link href={`/posts/${post.id}`} className="block group-hover:text-primary transition-colors">
            <h2 className="text-xl font-semibold leading-tight line-clamp-2">{post.title}</h2>
          </Link>
          <p className="text-muted-foreground line-clamp-2">{post.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <AuthorBio name={post.author.name} bio={post.author.bio} avatar={post.author.avatar} size="sm" />

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{formatDate(post.publishedAt)}</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readTime} min read</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
