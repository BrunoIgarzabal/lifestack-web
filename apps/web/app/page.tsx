"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { BlogPostCard } from "@/components/blog-post-card"
import { SearchInput } from "@workspace/ui/components/search-input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import { getPosts, searchPosts } from "@/lib/data"
import { Button } from "@workspace/ui/components/button"

const POSTS_PER_PAGE = 3

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const allPosts = getPosts()

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return allPosts
    }
    return searchPosts(searchQuery)
  }, [searchQuery, allPosts])

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 md:mb-6 text-foreground leading-tight">
              Welcome to LifeStack
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 md:mb-10">
              A place for personal reflections, deep thoughts, and stories about life, growth, and purpose. Here we
              explore the beautiful complexity of being human.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto mb-6">
              <SearchInput placeholder="Explore deep thoughts..." value={searchQuery} onChange={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Results Info */}
          {searchQuery && (
            <div className="mb-8">
              <p className="text-muted-foreground text-center">
                {filteredPosts.length === 0
                  ? `No reflections found for "${searchQuery}"`
                  : `Found ${filteredPosts.length} reflection${filteredPosts.length === 1 ? "" : "s"} for "${searchQuery}"`}
              </p>
            </div>
          )}

          {/* Blog Posts */}
          <div className="space-y-8 md:space-y-12 mb-12 md:mb-16">
            {paginatedPosts.length === 0 ? (
              <div className="text-center py-12 md:py-16">
                <p className="text-muted-foreground text-lg">
                  {searchQuery ? "No reflections match your search." : "No reflections available."}
                </p>
              </div>
            ) : (
              paginatedPosts.map((post) => <BlogPostCard key={post.id} post={post} />)
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e: any) => {
                      e.preventDefault()
                      if (currentPage > 1) handlePageChange(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e: any) => {
                        e.preventDefault()
                        handlePageChange(page)
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e: any) => {
                      e.preventDefault()
                      if (currentPage < totalPages) handlePageChange(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>
    </div>
  )
}
