import { Metadata } from "next"
import { getDonationSettings } from "@/lib/api"
import { siteConfig } from "@/lib/site-config"
import DonateClient from "./DonateClient"

export const metadata: Metadata = {
  title: "Donate",
  description: "Support the Afrokokoroot Foundation. Your donation empowers youth and bridges communities through cultural education.",
  openGraph: {
    title: "Donate | Afrokokoroot Foundation",
    description: "Support the Afrokokoroot Foundation. Your donation empowers youth and bridges communities through cultural education.",
    url: `${siteConfig.url}/donate`,
  },
}

export default async function DonatePage() {
  const donationSettings = await getDonationSettings()

  return <DonateClient donationSettings={donationSettings} />
}
