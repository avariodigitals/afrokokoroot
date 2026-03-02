import { getImpactMetrics } from "@/lib/api"
import { Hero } from "@/components/sections/Hero"
import { Mission } from "@/components/sections/Mission"
import { Impact } from "@/components/sections/Impact"
import { ProgramsPreview } from "@/components/sections/ProgramsPreview"
import { EventsPreview } from "@/components/sections/EventsPreview"
import { Gallery } from "@/components/sections/Gallery"
import { Newsletter } from "@/components/sections/Newsletter"

export default async function Home() {
  const stats = await getImpactMetrics()

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Mission />
      <Impact stats={stats} />
      <ProgramsPreview />
      <EventsPreview />
      <Gallery />
      <Newsletter />
    </div>
  )
}
