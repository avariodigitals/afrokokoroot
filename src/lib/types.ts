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
  artists?: Artist[];
  sponsors?: Sponsor[];
  partners?: Sponsor[];
}

export interface Artist {
  name: string;
  image?: string;
  stage?: string;
}

export interface Sponsor {
  name: string;
  image?: string;
}

export interface Program {
  slug: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  overviewSecondary?: string;
  offerItems?: string[];
  getInvolvedTitle?: string;
  getInvolvedText?: string;
  getInvolvedPrimaryLabel?: string;
  getInvolvedPrimaryHref?: string;
  getInvolvedSecondaryLabel?: string;
  getInvolvedSecondaryHref?: string;
  supportTitle?: string;
  supportText?: string;
  supportButtonLabel?: string;
  supportButtonHref?: string;
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

export interface DonationSettings {
  donationsEnabled: boolean;
  paypalClientId: string;
  paypalMerchantId?: string;
  currencyCode: string;
  monthlyPlanIds?: Record<string, string>;
}

export interface SiteSettings {
  contactInfo: ContactInfo;
  donationSettings: DonationSettings;
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

export interface Lead {
  id: string;
  email: string;
  date: string;
  status: 'active' | 'unsubscribed';
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  date: string;
}

export type AdminPermission =
  | 'dashboard'
  | 'events'
  | 'blog'
  | 'pages'
  | 'programs'
  | 'team'
  | 'gallery'
  | 'impact'
  | 'leads'
  | 'settings'
  | 'users';

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  permissions: AdminPermission[];
  isActive: boolean;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type AdminUserProfile = Omit<AdminUser, 'passwordHash'>;

export interface AdminUserInput {
  id?: string;
  name: string;
  username: string;
  password?: string;
  permissions: AdminPermission[];
  isActive: boolean;
  isOwner: boolean;
}

export interface PageContent {
  slug: string;
  title: string;
  description?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  content?: Record<string, any>;
}
