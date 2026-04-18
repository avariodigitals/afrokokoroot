import { Metadata } from "next"
import { getDonationSettings, getPublicSiteUrl } from "@/lib/api"
import DonateClient from "./DonateClient"

export async function generateMetadata(): Promise<Metadata> {
  const publicSiteUrl = await getPublicSiteUrl()

  return {
    title: "Donate",
    description: "Support the Afrokokoroot Foundation. Your donation empowers youth and bridges communities through cultural education.",
    openGraph: {
      title: "Donate | Afrokokoroot Foundation",
      description: "Support the Afrokokoroot Foundation. Your donation empowers youth and bridges communities through cultural education.",
      url: `${publicSiteUrl}/donate`,
    },
  }
}

export default async function DonatePage() {
  const donationSettings = await getDonationSettings()

  return <DonateClient donationSettings={donationSettings} />
}
