import { Metadata } from "next";
import { Gallery } from "@/components/sections/Gallery";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Explore moments of joy, rhythm, and connection from Afrokokoroot Foundation events and community gatherings.",
  openGraph: {
    title: "Gallery | Afrokokoroot Foundation",
    description: "Explore moments of joy, rhythm, and connection from Afrokokoroot Foundation events and community gatherings.",
    url: `${siteConfig.url}/gallery`,
  },
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-lime-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/IMG_8151.jpeg?updatedAt=1772546608755"
            alt="Gallery Hero - Community Gathering"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-lime-900/90" />
        </div>
        <div className="relative container h-full flex flex-col items-center justify-center text-center px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 drop-shadow-lg">
            Our <span className="text-lime-400">Gallery</span>
          </h1>
          <p className="text-lg md:text-2xl text-lime-50 max-w-2xl mx-auto font-medium drop-shadow-md">
            A visual journey through our mission to preserve African heritage and empower communities through music and art.
          </p>
        </div>
      </div>
      
      <div className="py-12 md:py-20">
        <Gallery hideTitle={true} />
      </div>
    </div>
  );
}
