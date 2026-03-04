"use client"

import { useState } from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { X, Loader2, Ticket, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import emailjs from "@emailjs/browser"

// Replace these with your actual IDs
const PAYPAL_CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID" // User needs to provide this
const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID" // User needs to provide this
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID" // User needs to provide this
const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY" // User needs to provide this

interface TicketPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  event: {
    title: string
    date: string
    time: string
    location: string
    ticketPrice?: number
  }
}

export function TicketPurchaseModal({ isOpen, onClose, event }: TicketPurchaseModalProps) {
  const [step, setStep] = useState<"details" | "payment" | "success">("details")
  const [ticketCount, setTicketCount] = useState(1)
  const [attendeeInfo, setAttendeeInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const ticketPrice = event.ticketPrice || 0
  const totalAmount = ticketPrice * ticketCount
  const isFreeEvent = ticketPrice === 0

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFreeEvent) {
      handleFreeRegistration()
    } else {
      setStep("payment")
    }
  }

  const handleFreeRegistration = async () => {
    setIsProcessing(true)
    try {
      await sendConfirmationEmail("Free Registration")
      setStep("success")
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Failed to register. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayPalApprove = async (data: unknown, actions: any) => {
    setIsProcessing(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((actions as any).order) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const details = await (actions as any).order.capture()
        await sendConfirmationEmail(details.id)
        setStep("success")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const sendConfirmationEmail = async (transactionId: string) => {
    // In a real app, you would verify this on the server
    // Here we use EmailJS to send a notification to the admin
    
    const templateParams = {
      event_title: event.title,
      event_date: event.date,
      customer_name: attendeeInfo.name,
      customer_email: attendeeInfo.email,
      customer_phone: attendeeInfo.phone,
      ticket_count: ticketCount,
      total_amount: isFreeEvent ? "Free" : `$${totalAmount}`,
      transaction_id: transactionId,
      purchase_date: new Date().toLocaleString(),
    }

    // Only attempt to send if keys are configured (fallback for demo)
    if (EMAILJS_SERVICE_ID !== "YOUR_EMAILJS_SERVICE_ID") {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )
    } else {
      console.log("EmailJS not configured. Simulating email send:", templateParams)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-lime-100 p-0 overflow-hidden">
        <div className="bg-green-900 p-6 text-white text-center relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 text-white/70 hover:text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <Ticket className="h-10 w-10 mx-auto mb-3 text-lime-400" />
          <DialogTitle className="text-xl font-bold">{event.title}</DialogTitle>
          <div className="flex justify-center gap-4 mt-2 text-sm text-lime-100/80">
            <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {event.date}</span>
            <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {event.time}</span>
          </div>
        </div>

        <div className="p-6">
          {step === "details" && (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ticketCount">Number of Tickets</Label>
                <div className="flex items-center gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  >
                    -
                  </Button>
                  <span className="text-xl font-bold w-8 text-center">{ticketCount}</span>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                  >
                    +
                  </Button>
                  <div className="ml-auto text-right">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-xl font-bold text-green-700">
                      {isFreeEvent ? "Free" : `$${totalAmount.toFixed(2)}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  required 
                  value={attendeeInfo.name}
                  onChange={(e) => setAttendeeInfo({...attendeeInfo, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={attendeeInfo.email}
                  onChange={(e) => setAttendeeInfo({...attendeeInfo, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  required 
                  value={attendeeInfo.phone}
                  onChange={(e) => setAttendeeInfo({...attendeeInfo, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isProcessing}>
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : (isFreeEvent ? "Register Now" : "Proceed to Payment")}
              </Button>
            </form>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="font-bold text-lg">Payment Details</h3>
                <p className="text-muted-foreground">Total to pay: <span className="text-green-700 font-bold">${totalAmount.toFixed(2)}</span></p>
              </div>

              <div className="min-h-[150px]">
                <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID }}>
                  <PayPalButtons 
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            description: `${event.title} - ${ticketCount} Ticket(s)`,
                            amount: {
                              value: totalAmount.toString(),
                              currency_code: "USD" // Adjust currency as needed
                            },
                          },
                        ],
                      })
                    }}
                    onApprove={handlePayPalApprove}
                    onError={(err) => {
                      console.error("PayPal Error:", err)
                      toast.error("There was an error processing your payment.")
                    }}
                  />
                </PayPalScriptProvider>
              </div>

              <Button variant="ghost" className="w-full" onClick={() => setStep("details")}>
                Back to Details
              </Button>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Ticket className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-900">You&apos;re All Set!</h3>
                <p className="text-muted-foreground">
                  We&apos;ve received your {isFreeEvent ? "registration" : "payment"}. A confirmation email has been sent to {attendeeInfo.email}.
                </p>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
