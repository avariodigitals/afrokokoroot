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
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="container px-4 md:px-6 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl mb-6 text-stone-900">
            Our <span className="text-orange-600">Gallery</span>
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed">
            A visual journey through our mission to preserve African heritage and empower communities through music and art.
          </p>
        </div>
      </div>
      
      <Gallery hideTitle={true} />
    </div>
  );
}
