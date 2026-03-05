import { getGalleryItems } from "@/lib/api"
import { GalleryClientPage } from "./client-page"

export const dynamic = 'force-dynamic'

export default async function AdminGalleryPage() {
  const items = await getGalleryItems()
  
  return <GalleryClientPage initialItems={items} />
}
