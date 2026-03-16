export const siteConfig = {
  name: "Afrokokoroot Foundation",
  description: "Empowering communities through education, art, and cultural exchange. A 501(c)(3) nonprofit organization.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://afrokokoroot-foundation.vercel.app",
  ogImage: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Afrokoko%20Foundation%20Logo%20HZR.png",
  links: {
    twitter: "https://twitter.com/afrokokoroot",
    facebook: "https://facebook.com/afrokokoroot",
    instagram: "https://instagram.com/afrokokoroot",
  },
  keywords: [
    "Nonprofit",
    "Cultural Education",
    "Cultural Exchange",
    "Community Empowerment",
    "Afrokokoroot",
    "Arts",
    "Culture",
    "Africa",
    "Heritage",
    "Dance",
  ],
};

export type SiteConfig = typeof siteConfig;
