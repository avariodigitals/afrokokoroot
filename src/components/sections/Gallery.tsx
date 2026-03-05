"use client"

import Image from "next/image"
import { GalleryItem } from "@/lib/types"

interface GalleryProps {
  hideTitle?: boolean
  initialItems?: GalleryItem[]
}

interface ExtendedGalleryItem extends GalleryItem {
  type?: string;
  className?: string;
}

export function Gallery({ hideTitle = false, initialItems = [] }: GalleryProps) {
  const combinedItems: ExtendedGalleryItem[] = [
    ...initialItems
  ];

  if (combinedItems.length === 0) {
    // If no dynamic items, use static ones but simplified to images only for responsiveness
    combinedItems.push(
      {
        id: "1",
        title: "Community Celebration",
        image: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/IMG_8381.jpeg?updatedAt=1772546824025",
        category: "Event",
        date: new Date().toISOString(),
        className: "col-span-1 row-span-1 md:col-span-2 md:row-span-2"
      },
      {
        id: "2",
        title: "Cultural Performance",
        image: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/IMG_8154.jpeg?updatedAt=1772546596730",
        category: "Event",
        date: new Date().toISOString(),
        className: "col-span-1 row-span-1"
      },
      {
        id: "3",
        title: "Youth Engagement",
        image: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/IMG_8151.jpeg?updatedAt=1772546608755",
        category: "Event",
        date: new Date().toISOString(),
        className: "col-span-1 row-span-1"
      },
      {
        id: "4",
        title: "Community Gathering",
        image: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/IMG_8153.jpeg?updatedAt=1772546625982",
        category: "Event",
        date: new Date().toISOString(),
        className: "col-span-1 row-span-1"
      },
      {
        id: "5",
        title: "Shared Moments",
        image: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/WhatsApp%20Image%202026-02-16%20at%2020.49.58%20(22).jpeg?updatedAt=1772546638377",
        category: "Event",
        date: new Date().toISOString(),
        className: "col-span-1 row-span-1"
      }
    )
  }

  return (
    <section className="py-16 md:py-24 bg-lime-50 overflow-hidden" id="gallery">
      <div className="container px-4 md:px-6">
        {!hideTitle && (
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-green-900">
              Capturing the <span className="text-green-600">Spirit</span>
            </h2>
            <p className="text-lg text-green-800">
              Moments of joy, rhythm, and connection from our recent events and community gatherings.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
          {combinedItems.map((item) => {
            // Determine grid span based on index or type if not specified
            const className = item.className || "col-span-1 row-span-1";
            
            return (
              <div
                key={item.id}
                className={`relative group overflow-hidden rounded-2xl bg-lime-200 shadow-md hover:shadow-xl transition-all duration-500 ${className}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <span className="text-white font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 block">
                      {item.title}
                    </span>
                    <span className="text-white/80 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 block">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
