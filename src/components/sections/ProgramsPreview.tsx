import { Program } from "@/lib/types";
import Link from "next/link";
import { ArrowRight, Music, Heart, BookOpen, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPrograms } from "@/lib/api"

const iconMap: Record<string, LucideIcon> = {
  academy: Music,
  wellness: Heart,
  education: BookOpen,
}

export async function ProgramsPreview() {
  const programs = await getPrograms()

  return (
    <section className="py-24 bg-lime-50 relative overflow-hidden rounded-b-[3rem] shadow-xl">

      {/* Decorative Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 via-lime-400 to-green-600" />

      {/* Musical Flow Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-lime-100/50 via-transparent to-transparent opacity-70" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-lime-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-green-200/30 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-lime-600">Our Programs</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              From classrooms to stages, we bring transformative arts experiences to life through rhythm and movement.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden md:inline-flex group text-green-700 hover:text-green-800 hover:bg-lime-100/50">
            <Link href="/programs">
              View All Programs <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.slice(0, 3).map((program: Program) => {
            const Icon = iconMap[program.slug] || Music
            return (
              <div key={program.title} className="group relative overflow-hidden rounded-3xl bg-white border border-lime-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col p-8">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 to-lime-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="mb-6 inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-lime-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-sm">
                  <Icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{program.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8 line-clamp-3">
                  {program.description}
                </p>
                
                <Link href={`/programs/${program.slug}`} className="absolute inset-0 focus:outline-none z-10">
                  <span className="sr-only">View {program.title}</span>
                </Link>
                
                <div className="mt-auto flex items-center text-sm font-bold text-primary/80 group-hover:text-primary transition-colors">
                  Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 md:hidden text-center">
          <Button asChild variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/5">
            <Link href="/programs">View All Programs</Link>
          </Button>
        </div>
      </div>

      {/* Wave Divider to Events Section (Light Indigo) */}
    </section>

  )
}
