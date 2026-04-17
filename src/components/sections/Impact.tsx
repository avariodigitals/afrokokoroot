import { ImpactMetric } from "@/lib/types"
import { ImpactCounter } from "@/components/ui/ImpactCounter"
import DecorativeTitle from "@/components/ui/DecorativeTitle"

interface ImpactProps {
  stats: ImpactMetric[]
  headline?: string
  description?: string
}

export function Impact({
  stats,
  headline = "Our Impact in Numbers",
  description = "Every number represents a life touched, a rhythm shared, and a community strengthened."
}: ImpactProps) {

  return (
    <section className="py-24 md:py-32 bg-green-900 text-white relative overflow-hidden">
      {/* Background Gradient & Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-green-950" />
      <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10" />
      
      {/* Glowing Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-pulse delay-1000" />

      <div className="container relative z-10 text-center">
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl mb-6 text-white drop-shadow-md"><DecorativeTitle text={headline} /></h2>
        <p className="text-xl text-lime-100/90 max-w-2xl mx-auto mb-16 font-medium">
          {description}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat: ImpactMetric) => (
            <ImpactCounter key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
      
      {/* Wave Divider to Programs Section (Light Warm Color) */}
    </section>

  )
}
