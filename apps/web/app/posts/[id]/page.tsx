import { notFound } from "next/navigation"
import { Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { AuthorBio } from "@workspace/ui/components/author-bio"
import { TagBadge } from "@workspace/ui/components/tag-badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { getPost, getPosts } from "@/lib/data"
import { Separator } from "@workspace/ui/components/separator"
import { calculateReadTime, formatDate } from "@workspace/ui/lib/utils"

export default function PostPage({ params }: any) {
  const post = getPost(params.id)
  const allPosts = getPosts()

  if (!post) {
    notFound()
  }

  const readTime = calculateReadTime(post.content)

  // Get related posts (excluding current post)
  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        {/* Back Button */}
        <div className="mb-6 md:mb-8">
          <Button variant="ghost" asChild className="p-0 h-auto">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to reflections</span>
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 md:mb-6 leading-tight text-foreground">
            {post.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed">{post.subtitle}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>

          {/* Author and Meta Info */}
          <div className="space-y-4 mb-6 md:mb-8">
            <AuthorBio name={post.author.name} bio={post.author.bio} avatar={post.author.avatar} size="md" />

            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
              <span>{formatDate(post.publishedAt)}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>

          <Separator />
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-li:text-foreground prose-blockquote:border-l-foreground prose-blockquote:text-muted-foreground prose-a:text-foreground prose-a:underline">
          {post.content.split("\n\n").map((paragraph, index) => {
            // Handle headings
            if (paragraph.startsWith("## ")) {
              return (
                <h2
                  key={index}
                  className="text-2xl md:text-3xl font-semibold mt-8 md:mt-12 mb-4 md:mb-6 text-foreground"
                >
                  {paragraph.replace("## ", "")}
                </h2>
              )
            }

            if (paragraph.startsWith("### ")) {
              return (
                <h3
                  key={index}
                  className="text-xl md:text-2xl font-semibold mt-6 md:mt-10 mb-3 md:mb-4 text-foreground"
                >
                  {paragraph.replace("### ", "")}
                </h3>
              )
            }

            // Handle lists
            if (paragraph.includes("\n- ") || paragraph.includes("\n1. ")) {
              const items = paragraph.split("\n").filter((line) => line.trim())
              const isOrdered = items?.[0]?.match(/^\d+\./)

              if (isOrdered) {
                return (
                  <ol
                    key={index}
                    className="list-decimal list-inside space-y-2 md:space-y-3 my-4 md:my-6 text-foreground"
                  >
                    {items.map((item, itemIndex) => (
                      <li key={itemIndex} className="leading-relaxed">
                        {item.replace(/^\d+\.\s*/, "")}
                      </li>
                    ))}
                  </ol>
                )
              } else {
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 md:space-y-3 my-4 md:my-6 text-foreground">
                    {items.map((item, itemIndex) => (
                      <li key={itemIndex} className="leading-relaxed">
                        {item.replace(/^-\s*/, "")}
                      </li>
                    ))}
                  </ul>
                )
              }
            }

            // Handle inline code
            const processInlineCode = (text: string) => {
              return text.split(/(`[^`]+`)/).map((part, partIndex) => {
                if (part.startsWith("`") && part.endsWith("`")) {
                  return (
                    <code key={partIndex} className="bg-muted px-1.5 py-0.5 rounded text-sm">
                      {part.slice(1, -1)}
                    </code>
                  )
                }
                return part
              })
            }

            // Regular paragraphs
            if (paragraph.trim()) {
              return (
                <p key={index} className="mb-4 md:mb-6 leading-relaxed text-base md:text-lg">
                  {processInlineCode(paragraph)}
                </p>
              )
            }

            return null
          })}
        </article>

        {/* Article Footer */}
        <footer className="mt-12 md:mt-16 pt-8 border-t space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <AuthorBio name={post.author.name} bio={post.author.bio} avatar={post.author.avatar} size="lg" />

            <Button asChild variant="outline" className="bg-background hover:bg-muted border-border">
              <Link href="/">More Reflections</Link>
            </Button>
          </div>

          {/* Related Reflections */}
          {relatedPosts.length > 0 && (
            <div className="space-y-6">
              <Separator />
              <div>
                <h3 className="text-xl md:text-2xl font-semibold mb-6">Related Reflections</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Card key={relatedPost.id} className="hover:bg-muted transition-colors border border-border">
                      <CardContent className="p-4 md:p-6">
                        <Link href={`/posts/${relatedPost.id}`} className="block space-y-2">
                          <h4 className="font-medium text-foreground hover:text-foreground transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.subtitle}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatDate(relatedPost.publishedAt)}</span>
                            <span>•</span>
                            <span>{calculateReadTime(relatedPost.content)} min read</span>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </footer>
      </main>
    </div>
  )
}
