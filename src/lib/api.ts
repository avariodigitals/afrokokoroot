import fs from 'fs/promises';
import path from 'path';
import { get, put } from '@vercel/blob';
import { Event, Program, TeamMember, ContactInfo, DonationSettings, ImpactMetric, BlogPost, Lead, GalleryItem, PageContent, AdminUser, SeoSettings, MarketingSettings, SiteSettings, SearchConsoleSettings } from './types';
import dbData from './db.json';
import { siteConfig } from './site-config';

const DB_PATH = path.join(process.cwd(), 'src/lib/db.json');
const DB_BLOB_PATH = 'cms/db.json';
const canUseBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export const DEFAULT_DONATION_SETTINGS: DonationSettings = {
  donationsEnabled: false,
  paypalClientId: '',
  paypalMerchantId: '',
  currencyCode: 'USD',
  monthlyPlanIds: {
    '5': '',
    '10': '',
    '15': '',
    '20': '',
    '25': '',
    '50': '',
    '100': '',
    '250': '',
    '500': '',
  },
};

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  publicSiteUrl: siteConfig.url,
  defaultTitle: siteConfig.name,
  defaultDescription: siteConfig.description,
  defaultKeywords: siteConfig.keywords,
  googleSiteVerification: '',
  bingSiteVerification: '',
  indexingEnabled: true,
};

export const DEFAULT_MARKETING_SETTINGS: MarketingSettings = {
  googleAnalyticsId: '',
  microsoftClarityId: '',
  metaPixelId: '',
};

export const DEFAULT_SEARCH_CONSOLE_SETTINGS: SearchConsoleSettings = {
  enabled: false,
  siteUrl: siteConfig.url,
  serviceAccountJson: '',
  lastSubmittedSitemapUrl: '',
  lastSubmittedAt: '',
  accessibleSites: [],
  lastConnectionCheckedAt: '',
  lastConnectionStatus: '',
  lastConnectionMessage: '',
  lastConnectionPermissionLevel: '',
  submissionHistory: [],
  lastInspection: undefined,
};

export function getStorageStatus() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    environment: process.env.NODE_ENV || 'development',
    usesBlobStorage: canUseBlobStorage,
    hasPersistentStorage: canUseBlobStorage,
    warning: isProduction && !canUseBlobStorage
      ? 'Persistent storage is not configured. Uploads and CMS edits will not persist on Vercel until BLOB_READ_WRITE_TOKEN is available.'
      : null,
  };
}

export interface DatabaseSchema {
  events: Event[];
  programs: Program[];
  team: TeamMember[];
  pageContents: PageContent[];
  contactInfo: ContactInfo;
  donationSettings: DonationSettings;
  seoSettings: SeoSettings;
  marketingSettings: MarketingSettings;
  searchConsoleSettings: SearchConsoleSettings;
  impactMetrics: ImpactMetric[];
  blogPosts: BlogPost[];
  leads: Lead[];
  gallery: GalleryItem[];
  users: AdminUser[];
}

async function readBlobDatabase(): Promise<DatabaseSchema | null> {
  try {
    const blob = await get(DB_BLOB_PATH, { access: 'public' });

    if (!blob?.stream) {
      return null;
    }

    const text = await new Response(blob.stream).text();
    return JSON.parse(text) as DatabaseSchema;
  } catch (error) {
    console.warn('Error reading database from Vercel Blob, falling back to local data:', error);
    return null;
  }
}

async function writeBlobDatabase(newData: DatabaseSchema) {
  await put(DB_BLOB_PATH, JSON.stringify(newData, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 60,
  });

  return { success: true };
}

export async function getData(): Promise<DatabaseSchema> {
  if (canUseBlobStorage) {
    const blobData = await readBlobDatabase();

    if (blobData) {
      return blobData;
    }
  }

  // In development, read from file system to allow real-time updates
  if (process.env.NODE_ENV === 'development') {
    try {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      return JSON.parse(data) as DatabaseSchema;
    } catch (error) {
      console.warn("Error reading database from file system, falling back to bundled data:", error);
    }
  }
  
  // In production without external storage, fall back to the bundled read-only data.
  return dbData as unknown as DatabaseSchema;
}

export async function updateData(newData: DatabaseSchema) {
  if (canUseBlobStorage) {
    try {
      return await writeBlobDatabase(newData);
    } catch (error) {
      console.error('Error writing database to Vercel Blob:', error);
      throw new Error('Failed to persist data to Vercel Blob.');
    }
  }

  try {
    await fs.writeFile(DB_PATH, JSON.stringify(newData, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error("Error writing database:", error);
    throw new Error('Failed to write database. Configure BLOB_READ_WRITE_TOKEN for persistent Vercel storage.');
  }
}

// Helper functions for specific collections
export async function getEvents(): Promise<Event[]> {
  const data = await getData();
  return data.events || [];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await getData();
  return data.blogPosts || [];
}

export async function getPrograms(): Promise<Program[]> {
  const data = await getData();
  return data.programs || [];
}

export async function getTeam(): Promise<TeamMember[]> {
  const data = await getData();
  return data.team || [];
}

export async function getContactInfo(): Promise<ContactInfo> {
  const data = await getData();
  return data.contactInfo || {
    address: '',
    email: '',
    phone: '',
    socials: {}
  };
}

export async function getDonationSettings(): Promise<DonationSettings> {
  const data = await getData();
  return {
    ...DEFAULT_DONATION_SETTINGS,
    ...data.donationSettings,
  };
}

export async function getSeoSettings(): Promise<SeoSettings> {
  const data = await getData();
  return {
    ...DEFAULT_SEO_SETTINGS,
    ...data.seoSettings,
    publicSiteUrl: (data.seoSettings?.publicSiteUrl || DEFAULT_SEO_SETTINGS.publicSiteUrl).replace(/\/+$/, ''),
    defaultKeywords: data.seoSettings?.defaultKeywords?.length
      ? data.seoSettings.defaultKeywords
      : DEFAULT_SEO_SETTINGS.defaultKeywords,
  };
}

export async function getPublicSiteUrl(): Promise<string> {
  const seoSettings = await getSeoSettings();
  return seoSettings.publicSiteUrl || siteConfig.url;
}

export async function getMarketingSettings(): Promise<MarketingSettings> {
  const data = await getData();
  return {
    ...DEFAULT_MARKETING_SETTINGS,
    ...data.marketingSettings,
  };
}

export async function getSearchConsoleSettings(): Promise<SearchConsoleSettings> {
  const data = await getData();
  return {
    ...DEFAULT_SEARCH_CONSOLE_SETTINGS,
    ...data.searchConsoleSettings,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const [contactInfo, donationSettings, seoSettings, marketingSettings, searchConsoleSettings] = await Promise.all([
    getContactInfo(),
    getDonationSettings(),
    getSeoSettings(),
    getMarketingSettings(),
    getSearchConsoleSettings(),
  ]);

  return {
    contactInfo,
    donationSettings,
    seoSettings,
    marketingSettings,
    searchConsoleSettings,
  };
}

export async function getImpactMetrics(): Promise<ImpactMetric[]> {
  const data = await getData();
  return data.impactMetrics || [];
}

export async function getLeads(): Promise<Lead[]> {
  const data = await getData();
  return data.leads || [];
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const data = await getData();
  return data.gallery || [];
}

export async function getPages(): Promise<PageContent[]> {
  const data = await getData();
  return data.pageContents || [];
}

export async function getPageContent(slug: string): Promise<PageContent | null> {
  const data = await getData();
  const pages = data.pageContents || [];
  return pages.find((page) => page.slug === slug) || null;
}
