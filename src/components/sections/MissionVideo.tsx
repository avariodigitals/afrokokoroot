"use client"

import { useEffect, useRef, useState } from "react"

interface MissionVideoProps {
  src: string
  poster: string
  limit?: number // Time in seconds to loop
}

export function MissionVideo({ src, poster, limit = 10 }: MissionVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

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

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-slate-200 animate-pulse rounded-2xl" />
    )
  }

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
