"use client"

import { useState } from "react"
import { HandHeart, Store, Share2, Ticket } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { VolunteerModal } from "@/components/events/VolunteerModal"
import { VendorModal } from "@/components/events/VendorModal"
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
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false)
  const [isVendorOpen, setIsVendorOpen] = useState(false)
  const [isTicketOpen, setIsTicketOpen] = useState(false)

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            className="w-full h-12 text-lg font-bold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all bg-lime-500 hover:bg-lime-600 text-green-900"
            size="lg"
            onClick={() => setIsVolunteerOpen(true)}
          >
            <HandHeart className="mr-2 h-5 w-5" />
            Register as a Volunteer
          </Button>
          <Button
            className="w-full h-12 text-lg font-bold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all bg-white hover:bg-lime-50 text-green-900"
            size="lg"
            onClick={() => setIsVendorOpen(true)}
          >
            <Store className="mr-2 h-5 w-5" />
            Become a Vendor
          </Button>
        </div>
        <Button
          className="w-full h-12 text-lg font-bold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all bg-green-600 hover:bg-green-700 text-white"
          size="lg"
          onClick={() => setIsTicketOpen(true)}
        >
          <Ticket className="mr-2 h-5 w-5" />
          Get Ticket / RSVP
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

      <VolunteerModal
        isOpen={isVolunteerOpen}
        onClose={() => setIsVolunteerOpen(false)}
        eventTitle={event.title}
      />
      <VendorModal
        isOpen={isVendorOpen}
        onClose={() => setIsVendorOpen(false)}
        eventTitle={event.title}
      />
      <TicketPurchaseModal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        event={event}
      />
    </>
  )
}
