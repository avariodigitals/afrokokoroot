import { Metadata } from "next";
import Image from "next/image";
import { Gallery } from "@/components/sections/Gallery";
import { getGalleryItems, getPageContent, getPublicSiteUrl } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const publicSiteUrl = await getPublicSiteUrl();
  const page = await getPageContent('gallery');
  const metaTitle = page?.title || 'Gallery';
  const metaDescription =
    page?.description ||
    "Explore moments of joy, rhythm, and connection from Afrokokoroot Foundation events and community gatherings.";

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: `${metaTitle} | Afrokokoroot Foundation`,
      description: metaDescription,
      url: `${publicSiteUrl}/gallery`,
    },
  };
}

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();
  const page = await getPageContent('gallery');

  const heroTitle = page?.heroTitle || 'Our Gallery';
  const heroSubtitle =
    page?.heroSubtitle ||
    'A visual journey through our mission to preserve African heritage and empower communities through music and art.';
  const heroImage =
    page?.heroImage ||
    'https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/IMG_8151.jpeg?updatedAt=1772546608755';

  return (
    <div className="min-h-screen bg-lime-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Gallery Hero - Community Gathering"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-lime-900/90" />
        </div>
        <div className="relative container h-full flex flex-col items-center justify-center text-center px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 drop-shadow-lg">
            {heroTitle}
          </h1>
          <p className="text-lg md:text-2xl text-lime-50 max-w-2xl mx-auto font-medium drop-shadow-md">
            {heroSubtitle}
          </p>
        </div>
      </div>
      
      <div className="py-12 md:py-20">
        <Gallery hideTitle={true} initialItems={galleryItems} />
      </div>
    </div>
  );
}
