import { getImpactMetrics, getPageContent } from "@/lib/api"
import { Hero } from "@/components/sections/Hero"
import { Mission } from "@/components/sections/Mission"
import { Impact } from "@/components/sections/Impact"
import { ProgramsPreview } from "@/components/sections/ProgramsPreview"
import { EventsPreview } from "@/components/sections/EventsPreview"
import { Newsletter } from "@/components/sections/Newsletter"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const stats = await getImpactMetrics()
  const page = await getPageContent('home')
  const content = page?.content || {}

  return (
    <div className="flex flex-col min-h-screen">
      <Hero
        badgeText={content?.badgeText || 'Official 501(c)(3) Nonprofit Organization'}
        title={page?.heroTitle}
        subtitle={page?.heroSubtitle}
        heroImage={page?.heroImage}
      />
      <Mission
        headline={content?.headline || 'More Than a Foundation. A Global Movement.'}
        body={content?.body || 'Afrokokoroot Foundation empowers underserved children and families through accessible music education, cultural immersion, and nature-based learning that foster creativity, connection, and wholistic well-being.'}
        bullets={content?.bullets || ['Cultural Preservation', 'Youth Empowerment', 'Community Outreach']}
        videoSrc={content?.missionVideoSrc}
        poster={content?.missionPoster}
        yearsLabel={content?.yearsLabel}
        yearsDescription={content?.yearsDescription}
      />
      <Impact
        stats={stats}
        headline={content?.impactHeadline || 'Our Impact in Numbers'}
        description={content?.impactDescription || 'Every number represents a life touched, a rhythm shared, and a community strengthened.'}
      />
      <ProgramsPreview
        headline={content?.programsHeadline || 'Our Programs'}
        description={content?.programsDescription || 'From classrooms to communities, we bring transformative experiences to life through education and cultural exchange.'}
      />
      <EventsPreview
        headline={content?.eventsHeadline || 'Upcoming Events'}
        description={content?.eventsDescription || 'Join the movement. Experience the culture. Be part of the community.'}
      />
      <Newsletter
        headline={content?.newsletterHeadline || 'Stay Connected'}
        description={content?.newsletterDescription || 'Stay updated on our latest programs, events, and impact stories. Be part of the change.'}
        privacyText={content?.newsletterPrivacyText || 'We respect your privacy. Unsubscribe at any time.'}
      />
    </div>
  )
}
