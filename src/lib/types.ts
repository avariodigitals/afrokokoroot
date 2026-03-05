export interface Event {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  price: string;
  description: string;
  highlights: string[];
  image?: string;
  ticketPrice?: number; // Numeric price for PayPal
}

export interface Program {
  slug: string;
  title: string;
  description: string;
  content: string;
  image?: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface Socials {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  threads?: string;
}

export interface ContactInfo {
  address: string;
  email: string;
  phone: string;
  socials: Socials;
}

export interface ImpactMetric {
  label: string;
  value: string;
  description: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image?: string;
  content?: string;
}
