import fs from 'fs/promises';
import path from 'path';
import { Event, Program, TeamMember, ContactInfo, ImpactMetric, BlogPost, Lead } from './types';
import dbData from './db.json';

const DB_PATH = path.join(process.cwd(), 'src/lib/db.json');

export interface DatabaseSchema {
  events: Event[];
  programs: Program[];
  team: TeamMember[];
  contactInfo: ContactInfo;
  impactMetrics: ImpactMetric[];
  blogPosts: BlogPost[];
  leads: Lead[];
}

export async function getData(): Promise<DatabaseSchema> {
  // In development, read from file system to allow real-time updates
  if (process.env.NODE_ENV === 'development') {
    try {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      return JSON.parse(data) as DatabaseSchema;
    } catch (error) {
      console.warn("Error reading database from file system, falling back to bundled data:", error);
    }
  }
  
  // In production (Netlify), use the bundled data (Read-Only)
  return dbData as unknown as DatabaseSchema;
}

export async function updateData(newData: DatabaseSchema) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(newData, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error("Error writing database:", error);
    return { success: false, error };
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

export async function getImpactMetrics(): Promise<ImpactMetric[]> {
  const data = await getData();
  return data.impactMetrics || [];
}

export async function getLeads(): Promise<Lead[]> {
  const data = await getData();
  return data.leads || [];
}
