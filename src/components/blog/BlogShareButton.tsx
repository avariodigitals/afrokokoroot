"use client"

import { Share2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface BlogShareButtonProps {
  title: string
  excerpt: string
}

export function BlogShareButton({ title, excerpt }: BlogShareButtonProps) {
  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url,
        })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard")
    } catch (error) {
      console.error("Error sharing blog post:", error)
      toast.error("Unable to share this story right now")
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="h-10 w-10 rounded-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-900 transition-colors"
      onClick={handleShare}
      aria-label="Share this story"
    >
      <Share2 className="h-4 w-4" />
    </Button>
  )
}