"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, Heart, ShieldCheck, Lock, CreditCard, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const donationAmounts = [25, 50, 100, 250, 500]

export default function DonateClient() {
  const [frequency, setFrequency] = React.useState<"one-time" | "monthly">("one-time")
  const [amount, setAmount] = React.useState<number | "custom">(50)
  const [customAmount, setCustomAmount] = React.useState("")

  return (
    <div className="min-h-screen bg-lime-50 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-green-900 text-white overflow-hidden rounded-b-[3rem] shadow-xl">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
            alt="Community support and donation"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-lime-900/80 to-emerald-950/90" />
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lime-500/20 rounded-full blur-3xl animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/4 delay-1000" />

        <div className="container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-1.5 text-sm font-medium text-lime-200 backdrop-blur-md shadow-lg mb-4">
             <Heart className="h-4 w-4 mr-2 text-lime-400 fill-current animate-pulse" />
             Support Our Mission
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight drop-shadow-lg">
            Fuel the <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-300">Rhythm</span> of Change
          </h1>
          <p className="text-xl md:text-2xl text-lime-100 font-medium max-w-2xl mx-auto leading-relaxed opacity-90">
            Your tax-deductible donation empowers youth, supports artists, and bridges communities through the power of Afrobeat.
          </p>
        </div>
      </section>

      <div className="container -mt-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-lime-100 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-lime-500 via-green-500 to-emerald-500" />
            
            <div className="p-8 md:p-10 space-y-8">
              {/* Frequency Toggle */}
              <div className="flex bg-lime-50 p-1.5 rounded-xl">
                <button
                  onClick={() => setFrequency("one-time")}
                  className={cn(
                    "flex-1 py-4 text-base font-bold rounded-lg transition-all duration-300",
                    frequency === "one-time"
                      ? "bg-white text-green-900 shadow-md transform scale-[1.02]"
                      : "text-green-600 hover:text-green-800 hover:bg-white/50"
                  )}
                >
                  One-Time Gift
                </button>
                <button
                  onClick={() => setFrequency("monthly")}
                  className={cn(
                    "flex-1 py-4 text-base font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2",
                    frequency === "monthly"
                      ? "bg-white text-green-900 shadow-md transform scale-[1.02]"
                      : "text-green-600 hover:text-green-800 hover:bg-white/50"
                  )}
                >
                  <Heart className={cn("h-4 w-4 transition-colors", frequency === "monthly" ? "text-lime-500 fill-current" : "text-green-400")} />
                  Monthly Impact
                </button>
              </div>

              {/* Amount Selection */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <h3 className="text-xl font-bold text-green-900">Select Amount</h3>
                   {frequency === "monthly" && <span className="text-sm font-medium text-lime-600 animate-pulse">Most Popular Choice!</span>}
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {donationAmounts.map((val) => (
                    <button
                      key={val}
                      onClick={() => {
                        setAmount(val)
                        setCustomAmount("")
                      }}
                      className={cn(
                        "py-4 rounded-xl border-2 text-xl font-black transition-all duration-200",
                        amount === val
                          ? "border-lime-500 bg-lime-50 text-green-700 shadow-inner transform scale-[0.98]"
                          : "border-lime-100 bg-white text-green-600 hover:border-lime-300 hover:shadow-md hover:-translate-y-1"
                      )}
                    >
                      ${val}
                    </button>
                  ))}
                  <div className="relative col-span-1">
                    <span className={cn("absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl pointer-events-none transition-colors", amount === "custom" ? "text-green-700" : "text-green-300")}>$</span>
                    <input
                      type="number"
                      placeholder="Other"
                      value={customAmount}
                      onChange={(e) => {
                        setAmount("custom")
                        setCustomAmount(e.target.value)
                      }}
                      className={cn(
                        "w-full h-full pl-8 pr-4 rounded-xl border-2 text-xl font-black transition-all focus:outline-none focus:ring-0 placeholder:text-green-200",
                        amount === "custom"
                          ? "border-lime-500 bg-lime-50 text-green-700 shadow-inner"
                          : "border-lime-100 bg-white text-green-900 hover:border-lime-300 hover:shadow-md"
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Impact Statement based on amount */}
              <div className="bg-lime-50/80 p-6 rounded-2xl border border-lime-100 flex gap-4 items-start shadow-sm">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 mb-1">Your Impact</h4>
                  <p className="text-green-800/80 leading-relaxed">
                    Your donation of <span className="font-black text-green-900">${amount === "custom" ? (customAmount || "0") : amount}</span> helps provide instruments, sheet music, and mentorship for young musicians in our community.
                  </p>
                </div>
              </div>

              {/* Payment Button Placeholder */}
              <div className="pt-2 space-y-4">
                <Button size="lg" className="w-full text-xl h-16 rounded-2xl font-bold bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all">
                  {frequency === "monthly" ? "Start Monthly Donation" : "Donate Now"} <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-green-500">
                  <Lock className="h-3 w-3" />
                  <span>Secure 256-bit SSL Encrypted Payment</span>
                </div>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="bg-lime-50/50 p-6 border-t border-lime-100 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Icons representing payment methods */}
              <CreditCard className="h-8 w-8 text-green-900" />
              <div className="h-8 flex items-center font-bold text-green-900 tracking-tighter italic">VISA</div>
              <div className="h-8 flex items-center font-bold text-green-900">Mastercard</div>
              <div className="h-8 flex items-center font-bold text-green-900">AMEX</div>
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-8 pt-8 lg:pt-0">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-lime-100 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-lime-200 transition-colors" />
              
              <h3 className="text-2xl font-black text-green-900 flex items-center gap-3 relative z-10">
                <ShieldCheck className="h-8 w-8 text-green-500" />
                Why Donate?
              </h3>
              <ul className="space-y-5 relative z-10">
                <li className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-lime-100 flex items-center justify-center shrink-0 mt-0.5 text-green-600 font-bold">1</div>
                  <div>
                    <strong className="block text-green-900 mb-1">Tax Deductible</strong>
                    <span className="text-green-700/80 text-sm leading-relaxed">We are a 501(c)(3) nonprofit organization. Your gift is tax-deductible.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-lime-100 flex items-center justify-center shrink-0 mt-0.5 text-green-600 font-bold">2</div>
                  <div>
                    <strong className="block text-green-900 mb-1">Direct Impact</strong>
                    <span className="text-green-700/80 text-sm leading-relaxed">85% of every dollar goes directly to our music and education programs.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-lime-100 flex items-center justify-center shrink-0 mt-0.5 text-green-600 font-bold">3</div>
                  <div>
                    <strong className="block text-green-900 mb-1">Transparency</strong>
                    <span className="text-green-700/80 text-sm leading-relaxed">We value your trust and provide clear financial reporting annually.</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-900 to-lime-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-lime-500/20 rounded-full blur-2xl" />
              
              <h3 className="font-bold text-xl mb-4 relative z-10">Other Ways to Give</h3>
              <ul className="space-y-3 text-lime-100 text-sm font-medium relative z-10">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-lime-400" /> Corporate Matching</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-lime-400" /> Stock Donations</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-lime-400" /> Legacy Giving</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-lime-400" /> In-Kind Equipment</li>
              </ul>
              <Button variant="link" className="px-0 mt-6 h-auto text-lime-300 hover:text-lime-200 font-bold relative z-10" asChild>
                <Link href="/contact">Contact us for details <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
