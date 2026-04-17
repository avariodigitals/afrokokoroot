import { getGalleryItems } from "@/lib/api"
import { GalleryClientPage } from "./client-page"
import { requireAdminPagePermission } from "@/lib/admin-auth"

export const dynamic = 'force-dynamic'

export default async function AdminGalleryPage() {
  await requireAdminPagePermission('gallery')
  const items = await getGalleryItems()
  
  return <GalleryClientPage initialItems={items} />
}
