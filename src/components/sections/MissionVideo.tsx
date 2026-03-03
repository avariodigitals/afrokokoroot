"use client"

import { useEffect, useRef } from "react"

interface MissionVideoProps {
  src: string
  poster: string
  limit?: number // Time in seconds to loop
}

export function MissionVideo({ src, poster, limit = 10 }: MissionVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !limit) return

    const handleTimeUpdate = () => {
      if (video.currentTime >= limit) {
        video.currentTime = 0
        video.play().catch(() => {
          // Ignore play errors
        })
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    return () => video.removeEventListener("timeupdate", handleTimeUpdate)
  }, [limit])

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      className="object-cover w-full h-full"
    />
  )
}
