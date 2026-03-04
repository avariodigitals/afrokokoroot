"use client"

import { useState } from "react"
import { Ticket, Share2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { TicketPurchaseModal } from "@/components/events/TicketPurchaseModal"

interface EventActionsProps {
  event: {
    title: string
    date: string
    time: string
    location: string
    ticketPrice?: number
    slug: string
  }
}

export function EventActions({ event }: EventActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out ${event.title} at ${event.location}!`,
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  return (
    <>
      <div className="pt-2 space-y-3">
        <Button 
          className="w-full h-12 text-lg font-bold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all bg-green-600 hover:bg-green-700 text-white" 
          size="lg"
          onClick={() => setIsModalOpen(true)}
        >
          <Ticket className="mr-2 h-5 w-5" />
          Get Tickets / RSVP
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-12 text-lg font-bold border-2 hover:bg-lime-50 border-lime-200 text-green-700"
          onClick={handleShare}
        >
          <Share2 className="mr-2 h-5 w-5" />
          Share Event
        </Button>
      </div>

      <TicketPurchaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        event={event} 
      />
    </>
  )
}
