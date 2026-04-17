'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { savePageContent } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PageContent } from '@/lib/types'

interface PageFormProps {
  initialData: PageContent
}

type ContentMap = Record<string, any>

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-lime-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-green-900">{title}</h2>
        {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-800">{label}</label>
      {children}
    </div>
  )
}

function splitLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function PageForm({ initialData }: PageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    slug: initialData.slug,
    title: initialData.title || '',
    description: initialData.description || '',
    heroTitle: initialData.heroTitle || '',
    heroSubtitle: initialData.heroSubtitle || '',
    heroImage: initialData.heroImage || '',
    content: (initialData.content || {}) as ContentMap,
  })

  const setBasicField = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const setContentField = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [name]: value,
      },
    }))
  }

  const setContentArrayItem = (arrayKey: string, index: number, field: string, value: string) => {
    const currentArray = Array.isArray(formData.content[arrayKey]) ? [...formData.content[arrayKey]] : []
    const currentItem = currentArray[index] || {}
    currentArray[index] = { ...currentItem, [field]: value }
    setContentField(arrayKey, currentArray)
  }

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>, target: string, isHero = false) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingField(target)
    try {
      const uploadData = new FormData()
      uploadData.append('file', file)
      uploadData.append('category', 'pages')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      if (isHero) {
        setBasicField('heroImage', data.path)
      } else {
        setContentField(target, data.path)
      }

      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploadingField(null)
    }
  }

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>, target: string, isHero = false) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingField(target)
    try {
      const uploadData = new FormData()
      uploadData.append('file', file)
      uploadData.append('category', 'pages')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      if (isHero) {
        setBasicField('heroImage', data.path)
      } else {
        setContentField(target, data.path)
      }

      toast.success('File uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload file')
    } finally {
      setUploadingField(null)
    }
  }

  const renderImageField = (label: string, target: string, value?: string, isHero = false) => (
    <Field label={label}>
      <div className="space-y-4">
        <Input type="file" accept="image/*" onChange={(event) => uploadImage(event, target, isHero)} disabled={uploadingField === target} className="cursor-pointer" />
        {uploadingField === target ? <p className="text-sm text-slate-500">Uploading image…</p> : null}
        {value ? (
          <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <Image src={value} alt={label} fill className="object-cover" />
          </div>
        ) : null}
      </div>
    </Field>
  )

  const renderFileField = (label: string, target: string, value?: string, accept = '*/*') => (
    <Field label={label}>
      <div className="space-y-4">
        <Input type="file" accept={accept} onChange={(event) => uploadFile(event, target)} disabled={uploadingField === target} className="cursor-pointer" />
        {uploadingField === target ? <p className="text-sm text-slate-500">Uploading file…</p> : null}
        {value ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 break-all">
            {value}
          </div>
        ) : null}
      </div>
    </Field>
  )

  const renderHomeFields = () => (
    <>
      <Section title="Mission Section" description="Edit the content shown in the homepage mission block.">
        <Field label="Hero Badge Text">
          <Input value={formData.content.badgeText || 'Official 501(c)(3) Nonprofit Organization'} onChange={(event) => setContentField('badgeText', event.target.value)} />
        </Field>
        <Field label="Mission Headline">
          <Input value={formData.content.headline || 'More Than a Foundation. A Global Movement.'} onChange={(event) => setContentField('headline', event.target.value)} />
        </Field>
        <Field label="Mission Description">
          <Textarea value={formData.content.body || 'Afrokokoroot Foundation empowers underserved children and families through accessible music education, cultural immersion, and nature-based learning that foster creativity, connection, and wholistic well-being.'} onChange={(event) => setContentField('body', event.target.value)} rows={4} />
        </Field>
        <Field label="Mission Bullet Points">
          <Textarea value={Array.isArray(formData.content.bullets) ? formData.content.bullets.join('\n') : 'Cultural Preservation\nYouth Empowerment\nCommunity Outreach'} onChange={(event) => setContentField('bullets', splitLines(event.target.value))} rows={4} />
        </Field>
        {renderFileField('Mission Video Upload', 'missionVideoSrc', formData.content.missionVideoSrc, 'video/*')}
        {renderImageField('Mission Video Poster Image', 'missionPoster', formData.content.missionPoster)}
        <Field label="Floating Stat Title">
          <Input value={formData.content.yearsLabel || '10+ Years'} onChange={(event) => setContentField('yearsLabel', event.target.value)} />
        </Field>
        <Field label="Floating Stat Description">
          <Input value={formData.content.yearsDescription || 'Of uniting communities through shared experiences.'} onChange={(event) => setContentField('yearsDescription', event.target.value)} />
        </Field>
      </Section>

      <Section title="Homepage Preview Sections" description="These control the visible copy for the impact, programs, events, and newsletter sections on the homepage.">
        <Field label="Impact Headline">
          <Input value={formData.content.impactHeadline || 'Our Impact in Numbers'} onChange={(event) => setContentField('impactHeadline', event.target.value)} />
        </Field>
        <Field label="Impact Description">
          <Textarea value={formData.content.impactDescription || 'Every number represents a life touched, a rhythm shared, and a community strengthened.'} onChange={(event) => setContentField('impactDescription', event.target.value)} rows={3} />
        </Field>
        <Field label="Programs Headline">
          <Input value={formData.content.programsHeadline || 'Our Programs'} onChange={(event) => setContentField('programsHeadline', event.target.value)} />
        </Field>
        <Field label="Programs Description">
          <Textarea value={formData.content.programsDescription || 'From classrooms to communities, we bring transformative experiences to life through education and cultural exchange.'} onChange={(event) => setContentField('programsDescription', event.target.value)} rows={3} />
        </Field>
        <Field label="Events Headline">
          <Input value={formData.content.eventsHeadline || 'Upcoming Events'} onChange={(event) => setContentField('eventsHeadline', event.target.value)} />
        </Field>
        <Field label="Events Description">
          <Textarea value={formData.content.eventsDescription || 'Join the movement. Experience the culture. Be part of the community.'} onChange={(event) => setContentField('eventsDescription', event.target.value)} rows={3} />
        </Field>
        <Field label="Newsletter Headline">
          <Input value={formData.content.newsletterHeadline || 'Stay Connected'} onChange={(event) => setContentField('newsletterHeadline', event.target.value)} />
        </Field>
        <Field label="Newsletter Description">
          <Textarea value={formData.content.newsletterDescription || 'Stay updated on our latest programs, events, and impact stories. Be part of the change.'} onChange={(event) => setContentField('newsletterDescription', event.target.value)} rows={3} />
        </Field>
        <Field label="Newsletter Privacy Text">
          <Input value={formData.content.newsletterPrivacyText || 'We respect your privacy. Unsubscribe at any time.'} onChange={(event) => setContentField('newsletterPrivacyText', event.target.value)} />
        </Field>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Program cards, event cards, and impact numbers are still edited from their dedicated admin sections so page editing does not duplicate the same data in two places.
        </div>
      </Section>
    </>
  )

  const renderGetInvolvedFields = () => (
    <>
      <Section title="Volunteer Section">
        <Field label="Volunteer Title">
          <Input value={formData.content.volunteerTitle || 'Volunteer With Us'} onChange={(event) => setContentField('volunteerTitle', event.target.value)} />
        </Field>
        <Field label="Volunteer Description">
          <Textarea value={formData.content.volunteerDescription || 'Our events and programs rely on the dedication of volunteers. From setting up stages to checking in guests, your help makes our work possible.'} onChange={(event) => setContentField('volunteerDescription', event.target.value)} rows={4} />
        </Field>
        <Field label="Volunteer Bullet Points">
          <Textarea value={Array.isArray(formData.content.volunteerBullets) ? formData.content.volunteerBullets.join('\n') : 'Event Staff & Logistics\nTeaching Assistants (Music/Art)\nAdministrative Support'} onChange={(event) => setContentField('volunteerBullets', splitLines(event.target.value))} rows={4} />
        </Field>
        {renderImageField('Volunteer Image', 'volunteerImage', formData.content.volunteerImage)}
      </Section>

      <Section title="Partner Section">
        <Field label="Partner Title">
          <Input value={formData.content.partnerTitle || 'Partner With Us'} onChange={(event) => setContentField('partnerTitle', event.target.value)} />
        </Field>
        <Field label="Partner Description">
          <Textarea value={formData.content.partnerDescription || 'We collaborate with schools, businesses, and other nonprofits to expand our reach. Let\'s create something impactful together.'} onChange={(event) => setContentField('partnerDescription', event.target.value)} rows={4} />
        </Field>
        <Field label="Partner Bullet Points">
          <Textarea value={Array.isArray(formData.content.partnerBullets) ? formData.content.partnerBullets.join('\n') : 'School Residencies & Workshops\nCorporate Sponsorships\nCross-Promotional Events'} onChange={(event) => setContentField('partnerBullets', splitLines(event.target.value))} rows={4} />
        </Field>
        {renderImageField('Partner Image', 'partnerImage', formData.content.partnerImage)}
      </Section>

      <Section title="Donate Call To Action">
        <Field label="Donate Headline">
          <Input value={formData.content.donateHeadline || 'Make a Financial Contribution'} onChange={(event) => setContentField('donateHeadline', event.target.value)} />
        </Field>
        <Field label="Donate Description">
          <Textarea value={formData.content.donateDescription || 'Can\'t volunteer? Your donation is the most direct way to support our mission. Every dollar goes towards instruments, education, and community events.'} onChange={(event) => setContentField('donateDescription', event.target.value)} rows={4} />
        </Field>
        <Field label="Donate Button Label">
          <Input value={formData.content.donateButtonLabel || 'Donate Now'} onChange={(event) => setContentField('donateButtonLabel', event.target.value)} />
        </Field>
      </Section>

      <Section title="Newsletter Section">
        <Field label="Newsletter Headline">
          <Input value={formData.content.newsletterHeadline || 'Stay in the Loop'} onChange={(event) => setContentField('newsletterHeadline', event.target.value)} />
        </Field>
        <Field label="Newsletter Description">
          <Textarea value={formData.content.newsletterDescription || 'Sign up for our newsletter to receive updates on upcoming events, program success stories, and volunteer opportunities.'} onChange={(event) => setContentField('newsletterDescription', event.target.value)} rows={4} />
        </Field>
        <Field label="Newsletter Privacy Text">
          <Input value={formData.content.newsletterPrivacyText || 'We respect your privacy. Unsubscribe at any time.'} onChange={(event) => setContentField('newsletterPrivacyText', event.target.value)} />
        </Field>
      </Section>
    </>
  )

  const renderContactFields = () => (
    <Section title="Contact Sections">
      <Field label="Info Section Heading">
        <Input value={formData.content.infoHeadline || 'Contact Information'} onChange={(event) => setContentField('infoHeadline', event.target.value)} />
      </Field>
      <Field label="Intro Text">
        <Textarea value={formData.content.contactIntro || 'Reach out using the details below or send us a message to connect with our team.'} onChange={(event) => setContentField('contactIntro', event.target.value)} rows={3} />
      </Field>
      <Field label="Email Heading">
        <Input value={formData.content.emailHeading || 'Email Us'} onChange={(event) => setContentField('emailHeading', event.target.value)} />
      </Field>
      <Field label="Email Description">
        <Input value={formData.content.emailDescription || 'For general inquiries and partnerships'} onChange={(event) => setContentField('emailDescription', event.target.value)} />
      </Field>
      <Field label="Phone Heading">
        <Input value={formData.content.phoneHeading || 'Call Us'} onChange={(event) => setContentField('phoneHeading', event.target.value)} />
      </Field>
      <Field label="Phone Description">
        <Input value={formData.content.phoneDescription || 'Mon-Fri from 9am to 5pm CST'} onChange={(event) => setContentField('phoneDescription', event.target.value)} />
      </Field>
      <Field label="Address Heading">
        <Input value={formData.content.addressHeading || 'Visit Us'} onChange={(event) => setContentField('addressHeading', event.target.value)} />
      </Field>
      <Field label="Appointment Note">
        <Input value={formData.content.appointmentNote || '*By appointment only'} onChange={(event) => setContentField('appointmentNote', event.target.value)} />
      </Field>
      <Field label="Form Heading">
        <Input value={formData.content.formHeadline || 'Send a Message'} onChange={(event) => setContentField('formHeadline', event.target.value)} />
      </Field>
    </Section>
  )

  const renderProgramsFields = () => (
    <>
      <Section title="Programs Intro">
        <Field label="Intro Eyebrow">
          <Input value={formData.content.programListHeadline || 'Featured Programs'} onChange={(event) => setContentField('programListHeadline', event.target.value)} />
        </Field>
        <Field label="Intro Headline">
          <Textarea value={formData.content.programIntro || 'Our programs connect culture, learning and health through creative workshops, mentorship, and community support.'} onChange={(event) => setContentField('programIntro', event.target.value)} rows={3} />
        </Field>
      </Section>

      <Section title="Bottom Call To Action">
        <Field label="CTA Headline">
          <Input value={formData.content.ctaHeadline || 'Partner With Us'} onChange={(event) => setContentField('ctaHeadline', event.target.value)} />
        </Field>
        <Field label="CTA Description">
          <Textarea value={formData.content.ctaDescription || 'Interested in bringing one of our programs to your school, community center, or organization? We\'d love to collaborate to spread the rhythm.'} onChange={(event) => setContentField('ctaDescription', event.target.value)} rows={4} />
        </Field>
        <Field label="Primary Button Label">
          <Input value={formData.content.ctaPrimaryLabel || 'Contact Us'} onChange={(event) => setContentField('ctaPrimaryLabel', event.target.value)} />
        </Field>
        <Field label="Secondary Button Label">
          <Input value={formData.content.ctaSecondaryLabel || 'Support Our Work'} onChange={(event) => setContentField('ctaSecondaryLabel', event.target.value)} />
        </Field>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          The program cards and images on this page are pulled from the Programs admin so they stay in sync everywhere.
        </div>
      </Section>
    </>
  )

  const renderImpactFields = () => (
    <>
      <Section title="Impact Metrics Header">
        <Field label="Metrics Eyebrow">
          <Input value={formData.content.metricHeadline || 'Impact at a Glance'} onChange={(event) => setContentField('metricHeadline', event.target.value)} />
        </Field>
        <Field label="Metrics Heading">
          <Textarea value={formData.content.impactIntro || 'Our metrics capture meaningful progress in education, events, arts access, and community support.'} onChange={(event) => setContentField('impactIntro', event.target.value)} rows={3} />
        </Field>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          The metric cards themselves are managed from the Impact Metrics admin page.
        </div>
      </Section>

      <Section title="Stories Section">
        <Field label="Stories Heading">
          <Input value={formData.content.storiesHeadline || 'Voices of Change'} onChange={(event) => setContentField('storiesHeadline', event.target.value)} />
        </Field>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Story One Quote">
            <Textarea value={formData.content.storyOneQuote || 'Before attending the Afrokokoroot youth music workshop, I was shy and unsure of myself. Being surrounded by music and creative expression helped me find my confidence and connect with others through rhythm.'} onChange={(event) => setContentField('storyOneQuote', event.target.value)} rows={5} />
          </Field>
          <Field label="Story Two Quote">
            <Textarea value={formData.content.storyTwoQuote || 'The World Peace Music & Arts event opened my eyes to how powerful music and culture can be in bringing people together. Seeing people from different backgrounds celebrate together was unforgettable.'} onChange={(event) => setContentField('storyTwoQuote', event.target.value)} rows={5} />
          </Field>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Story One Author">
            <Input value={formData.content.storyOneAuthor || 'Michael, Age 16'} onChange={(event) => setContentField('storyOneAuthor', event.target.value)} />
          </Field>
          <Field label="Story Two Author">
            <Input value={formData.content.storyTwoAuthor || 'Sarah J.'} onChange={(event) => setContentField('storyTwoAuthor', event.target.value)} />
          </Field>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Story One Role">
            <Input value={formData.content.storyOneRole || 'Community Program Participant'} onChange={(event) => setContentField('storyOneRole', event.target.value)} />
          </Field>
          <Field label="Story Two Role">
            <Input value={formData.content.storyTwoRole || 'Event Attendee'} onChange={(event) => setContentField('storyTwoRole', event.target.value)} />
          </Field>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Story One Description">
            <Textarea value={formData.content.storyOneBody || 'Through our youth engagement programs, we provide opportunities for young people in Nashville to explore music, creativity, and cultural expression while building confidence and leadership.'} onChange={(event) => setContentField('storyOneBody', event.target.value)} rows={4} />
          </Field>
          <Field label="Story Two Description">
            <Textarea value={formData.content.storyTwoBody || 'Our events create spaces where diverse communities come together through music, art, and shared cultural experiences—building understanding and lasting connections.'} onChange={(event) => setContentField('storyTwoBody', event.target.value)} rows={4} />
          </Field>
        </div>
        {renderImageField('Story One Image', 'storyOneImage', formData.content.storyOneImage)}
        {renderImageField('Story Two Image', 'storyTwoImage', formData.content.storyTwoImage)}
      </Section>

      <Section title="Transparency Section">
        <Field label="Transparency Headline">
          <Input value={formData.content.transparencyHeadline || 'Radical Transparency'} onChange={(event) => setContentField('transparencyHeadline', event.target.value)} />
        </Field>
        <Field label="Transparency Description">
          <Textarea value={formData.content.transparencyDescription || 'We believe in full accountability. Every dollar donated helps us keep the rhythm alive. Review our annual impact reports to see exactly how your support is being used.'} onChange={(event) => setContentField('transparencyDescription', event.target.value)} rows={4} />
        </Field>
        <Field label="Report Button Label">
          <Input value={formData.content.reportButtonLabel || 'Download 2024 Report (PDF)'} onChange={(event) => setContentField('reportButtonLabel', event.target.value)} />
        </Field>
        <Field label="Tax Form Button Label">
          <Input value={formData.content.taxButtonLabel || 'View IRS 990 Form'} onChange={(event) => setContentField('taxButtonLabel', event.target.value)} />
        </Field>
      </Section>

      <Section title="Final Call To Action">
        <Field label="CTA Headline">
          <Input value={formData.content.ctaHeadline || 'Be Part of Our Story'} onChange={(event) => setContentField('ctaHeadline', event.target.value)} />
        </Field>
        <Field label="CTA Description">
          <Textarea value={formData.content.ctaDescription || 'Your contribution empowers us to reach more students, host more community events, and keep the culture alive.'} onChange={(event) => setContentField('ctaDescription', event.target.value)} rows={4} />
        </Field>
        <Field label="Primary Button Label">
          <Input value={formData.content.ctaPrimaryLabel || 'Make a Donation'} onChange={(event) => setContentField('ctaPrimaryLabel', event.target.value)} />
        </Field>
        <Field label="Secondary Button Label">
          <Input value={formData.content.ctaSecondaryLabel || 'Volunteer With Us'} onChange={(event) => setContentField('ctaSecondaryLabel', event.target.value)} />
        </Field>
      </Section>
    </>
  )

  const renderAboutFields = () => {
    const pillarItems = Array.isArray(formData.content.pillarItems) && formData.content.pillarItems.length > 0
      ? formData.content.pillarItems
      : [
          { icon: 'book', title: 'Cultural Education', description: 'Arts, storytelling, and cultural expression.' },
          { icon: 'leaf', title: 'Wellness & Nature', description: 'Outdoor recreation and land-based learning.' },
          { icon: 'heart', title: 'Food Security', description: 'Sustainable agriculture and nutrition.' },
          { icon: 'users', title: 'Community Peace', description: 'Cross-cultural engagement and unity.' },
        ]

    return (
      <>
        <Section title="Mission And Governance">
          <Field label="Mission Intro">
            <Textarea value={formData.content.missionIntro || 'Afrokokoroot Foundation is structured as a 501(c)(3) public charity. We are legally and operationally separate from commercial entities. Our mission is purely charitable and educational, focused on serving underserved communities.'} onChange={(event) => setContentField('missionIntro', event.target.value)} rows={4} />
          </Field>
          <Field label="Governance Text">
            <Textarea value={formData.content.governanceText || 'We maintain strict compliance and credibility through a diverse Board of Directors with a majority of independent members. Our governance includes robust policies for conflict of interest, financial oversight, and transparency.'} onChange={(event) => setContentField('governanceText', event.target.value)} rows={4} />
          </Field>
        </Section>

        <Section title="Core Pillars">
          {pillarItems.map((item: any, index: number) => (
            <div key={`${item.title}-${index}`} className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-3">
              <Field label={`Pillar ${index + 1} Icon`}>
                <Input value={item.icon || ''} onChange={(event) => setContentArrayItem('pillarItems', index, 'icon', event.target.value)} />
              </Field>
              <Field label={`Pillar ${index + 1} Title`}>
                <Input value={item.title || ''} onChange={(event) => setContentArrayItem('pillarItems', index, 'title', event.target.value)} />
              </Field>
              <Field label={`Pillar ${index + 1} Description`}>
                <Input value={item.description || ''} onChange={(event) => setContentArrayItem('pillarItems', index, 'description', event.target.value)} />
              </Field>
            </div>
          ))}
        </Section>

        <Section title="Leadership And Transparency">
          <Field label="Leadership Headline">
            <Input value={formData.content.leadershipHeadline || 'Board of Directors'} onChange={(event) => setContentField('leadershipHeadline', event.target.value)} />
          </Field>
          <Field label="Leadership Description">
            <Textarea value={formData.content.leadershipCopy || 'Our independent board ensures we stay true to our mission and serve the public interest.'} onChange={(event) => setContentField('leadershipCopy', event.target.value)} rows={3} />
          </Field>
          <Field label="Transparency Headline">
            <Input value={formData.content.transparencyHeadline || 'Financial Transparency'} onChange={(event) => setContentField('transparencyHeadline', event.target.value)} />
          </Field>
          <Field label="Transparency Description">
            <Textarea value={formData.content.transparencyCopy || 'We are committed to open and honest financial reporting. Our funds are used strictly for charitable purposes, with clear separation from any commercial activities.'} onChange={(event) => setContentField('transparencyCopy', event.target.value)} rows={4} />
          </Field>
        </Section>
      </>
    )
  }

  const renderPageSpecificFields = () => {
    switch (formData.slug) {
      case 'home':
        return renderHomeFields()
      case 'get-involved':
        return renderGetInvolvedFields()
      case 'contact':
        return renderContactFields()
      case 'programs':
        return renderProgramsFields()
      case 'impact':
        return renderImpactFields()
      case 'about':
        return renderAboutFields()
      default:
        return (
          <Section title="Advanced Content">
            <Field label="Raw JSON Content">
              <Textarea value={JSON.stringify(formData.content, null, 2)} onChange={(event) => {
                try {
                  setFormData((prev) => ({ ...prev, content: JSON.parse(event.target.value) }))
                } catch {
                  return
                }
              }} rows={16} className="font-mono text-sm" />
            </Field>
          </Section>
        )
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      await savePageContent({
        slug: formData.slug,
        title: formData.title,
        description: formData.description,
        heroTitle: formData.heroTitle,
        heroSubtitle: formData.heroSubtitle,
        heroImage: formData.heroImage,
        content: formData.content,
      })

      toast.success('Page content saved')
      router.push('/admin/pages')
      router.refresh()
    } catch (error) {
      console.error('Error saving page content:', error)
      toast.error('Failed to save page content')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section title="Page Basics" description="These fields control the page name, meta description, and hero block.">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Page Title">
            <Input value={formData.title} onChange={(event) => setBasicField('title', event.target.value)} required />
          </Field>
          <Field label="Meta Description">
            <Input value={formData.description} onChange={(event) => setBasicField('description', event.target.value)} />
          </Field>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Hero Title">
            <Input value={formData.heroTitle} onChange={(event) => setBasicField('heroTitle', event.target.value)} />
          </Field>
          <Field label="Hero Subtitle">
            <Textarea value={formData.heroSubtitle} onChange={(event) => setBasicField('heroSubtitle', event.target.value)} rows={3} />
          </Field>
        </div>

        {renderImageField('Hero Image', 'heroImage', formData.heroImage, true)}
      </Section>

      {renderPageSpecificFields()}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Page
        </Button>
      </div>
    </form>
  )
}
