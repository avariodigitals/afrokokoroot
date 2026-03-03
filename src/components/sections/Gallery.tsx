import Image from "next/image";
import { Play } from "lucide-react";

// Placeholder data - to be replaced with real links provided by user
const galleryItems = [
  {
    id: 1,
    type: "video",
    src: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/IMG_8380.mov/ik-video.mp4?updatedAt=1772547046669",
    alt: "Community Celebration",
    className: "col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 sm:row-span-2",
  },
  {
    id: 2,
    type: "image",
    src: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/IMG_8381.jpeg?updatedAt=1772546824025",
    alt: "Cultural Performance",
    className: "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1",
  },
  {
    id: 3,
    type: "image",
    src: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/IMG_8154.jpeg?updatedAt=1772546596730",
    alt: "Youth Engagement",
    className: "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1",
  },
  {
    id: 4,
    type: "image",
    src: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/IMG_8151.jpeg?updatedAt=1772546608755",
    alt: "Community Gathering",
    className: "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1",
  },
  {
    id: 5,
    type: "image",
    src: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/IMG_8153.jpeg?updatedAt=1772546625982",
    alt: "Shared Moments",
    className: "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1",
  },
  {
    id: 6,
    type: "video",
    src: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/IMG_3716.mov/ik-video.mp4?updatedAt=1772546686857",
    alt: "Live Music Session",
    className: "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 sm:row-span-2",
  },
  {
    id: 7,
    type: "image",
    src: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/WhatsApp%20Image%202026-02-16%20at%2020.49.58%20(22).jpeg?updatedAt=1772546638377",
    alt: "Foundation Event",
    className: "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1",
  },
];

export function Gallery({ hideTitle = false }: { hideTitle?: boolean }) {
  return (
    <section className="py-24 bg-lime-50 overflow-hidden">
      <div className="container px-4 md:px-6">
        {!hideTitle && (
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-green-900">
              Capturing the <span className="text-green-600">Spirit</span>
            </h2>
            <p className="text-lg text-green-800">
              Moments of joy, rhythm, and connection from our recent events and community gatherings.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className={`relative group overflow-hidden rounded-2xl bg-lime-200 shadow-md hover:shadow-xl transition-all duration-500 ${item.className}`}
            >
              {item.type === "video" ? (
                <div className="relative w-full h-full">
                  <video
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    muted
                    loop
                    playsInline
                    autoPlay
                  >
                    <source src={item.src} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-green-600 ml-1" fill="currentColor" />
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
