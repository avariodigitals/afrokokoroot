import Image from "next/image";
import { Play } from "lucide-react";

// Placeholder data - to be replaced with real links provided by user
const galleryItems = [
  {
    id: 1,
    type: "image",
    src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000&auto=format&fit=crop",
    alt: "Community drumming circle",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    type: "image",
    src: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000&auto=format&fit=crop",
    alt: "Traditional dance performance",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder video
    alt: "Festival highlights",
    className: "md:col-span-1 md:row-span-2",
  },
  {
    id: 4,
    type: "image",
    src: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1000&auto=format&fit=crop",
    alt: "Music workshop",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: 5,
    type: "image",
    src: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop",
    alt: "Cultural exhibition",
    className: "md:col-span-2 md:row-span-1",
  },
];

export function Gallery() {
  return (
    <section className="py-24 bg-stone-50 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-stone-900">
            Capturing the <span className="text-orange-600">Spirit</span>
          </h2>
          <p className="text-lg text-stone-600">
            Moments of joy, rhythm, and connection from our recent events and community gatherings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className={`relative group overflow-hidden rounded-2xl bg-stone-200 ${item.className}`}
            >
              {item.type === "video" ? (
                <div className="relative w-full h-full">
                  <video
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    muted
                    loop
                    playsInline
                    // autoPlay // Uncomment to autoplay
                  >
                    <source src={item.src} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-orange-600 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {item.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
