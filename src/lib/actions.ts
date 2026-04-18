'use server';

import { DEFAULT_DONATION_SETTINGS, getData, updateData } from './api';
import { revalidatePath } from 'next/cache';
import { Event, BlogPost, Program, TeamMember, ImpactMetric, ContactInfo, Lead, GalleryItem, PageContent, AdminUserInput, SiteSettings } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { assertAdminPermission, deleteAdminUserAccount, saveAdminUserAccount } from '@/lib/admin-auth';

export async function saveEvent(eventData: Event) {
  await assertAdminPermission('events');
  const data = await getData();
  const events: Event[] = data.events || [];
  
  const existingIndex = events.findIndex((e: Event) => e.slug === eventData.slug);
  
  // Create a deep copy to avoid mutation issues if any
  const newEventData = { ...eventData };

  if (existingIndex >= 0) {
    events[existingIndex] = newEventData;
  } else {
    events.push(newEventData);
  }
  
  data.events = events;
  await updateData(data);
  revalidatePath('/events');
  revalidatePath(`/events/${newEventData.slug}`);
  revalidatePath('/admin/events');
  revalidatePath('/');
  return { success: true };
}

export async function deleteEvent(slug: string) {
  await assertAdminPermission('events');
  const data = await getData();
  const events: Event[] = data.events || [];
  
  data.events = events.filter((e: Event) => e.slug !== slug);
  
  await updateData(data);
  revalidatePath('/events');
  revalidatePath('/admin/events');
  revalidatePath('/');
  return { success: true };
}

export async function saveBlogPost(postData: BlogPost, originalSlug?: string) {
  await assertAdminPermission('blog');
  const data = await getData();
  const posts: BlogPost[] = data.blogPosts || [];

  const lookupSlug = originalSlug || postData.slug;
  const existingIndex = posts.findIndex((p: BlogPost) => p.slug === lookupSlug);
  
  if (existingIndex >= 0) {
    posts[existingIndex] = postData;
  } else {
    posts.push(postData);
  }
  
  data.blogPosts = posts;
  await updateData(data);
  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  revalidatePath('/admin');
  revalidatePath(`/blog/${postData.slug}`);

  if (originalSlug && originalSlug !== postData.slug) {
    revalidatePath(`/blog/${originalSlug}`);
  }

  revalidatePath('/');
  return { success: true };
}

export async function deleteBlogPost(slug: string) {
  await assertAdminPermission('blog');
  const data = await getData();
  const posts: BlogPost[] = data.blogPosts || [];
  
  data.blogPosts = posts.filter((p: BlogPost) => p.slug !== slug);
  
  await updateData(data);
  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  revalidatePath('/admin');
  revalidatePath(`/blog/${slug}`);
  revalidatePath('/');
  return { success: true };
}

// Programs
export async function saveProgram(programData: Program) {
  await assertAdminPermission('programs');
  const data = await getData();
  const programs: Program[] = data.programs || [];
  
  const existingIndex = programs.findIndex((p: Program) => p.slug === programData.slug);
  
  if (existingIndex >= 0) {
    programs[existingIndex] = programData;
  } else {
    programs.push(programData);
  }
  
  data.programs = programs;
  await updateData(data);
  revalidatePath('/programs');
  revalidatePath('/admin/programs');
  revalidatePath('/admin');
  revalidatePath(`/programs/${programData.slug}`);
  revalidatePath('/');
  return { success: true };
}

export async function deleteProgram(slug: string) {
  await assertAdminPermission('programs');
  const data = await getData();
  const programs: Program[] = data.programs || [];
  
  data.programs = programs.filter((p: Program) => p.slug !== slug);
  
  await updateData(data);
  revalidatePath('/programs');
  revalidatePath('/admin/programs');
  revalidatePath('/admin');
  revalidatePath(`/programs/${slug}`);
  revalidatePath('/');
  return { success: true };
}

// Team
export async function saveTeamMember(memberData: TeamMember) {
  await assertAdminPermission('team');
  const data = await getData();
  const team: TeamMember[] = data.team || [];
  
  // Ensure slug exists
  if (!memberData.slug) {
    memberData.slug = memberData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  
  const existingIndex = team.findIndex((m: TeamMember) => m.slug === memberData.slug);
  
  if (existingIndex >= 0) {
    team[existingIndex] = memberData;
  } else {
    team.push(memberData);
  }
  
  data.team = team;
  await updateData(data);
  revalidatePath('/about');
  revalidatePath('/');
  return { success: true };
}

export async function deleteTeamMember(slug: string) {
  await assertAdminPermission('team');
  const data = await getData();
  const team: TeamMember[] = data.team || [];
  
  data.team = team.filter((m: TeamMember) => m.slug !== slug);
  
  await updateData(data);
  revalidatePath('/about');
  revalidatePath('/');
  return { success: true };
}

// Contact Info
export async function saveContactInfo(infoData: ContactInfo) {
  await assertAdminPermission('settings');
  const data = await getData();
  data.contactInfo = {
    ...data.contactInfo,
    ...infoData,
    socials: {
      ...(data.contactInfo?.socials || {}),
      ...(infoData.socials || {}),
    },
  };
  
  await updateData(data);
  revalidatePath('/');
  return { success: true };
}

export async function saveSiteSettings(settingsData: SiteSettings) {
  await assertAdminPermission('settings');
  const data = await getData();

  data.contactInfo = {
    ...data.contactInfo,
    ...settingsData.contactInfo,
    socials: {
      ...(data.contactInfo?.socials || {}),
      ...(settingsData.contactInfo.socials || {}),
    },
  };

  data.donationSettings = {
    ...DEFAULT_DONATION_SETTINGS,
    ...(data.donationSettings || {}),
    ...(settingsData.donationSettings || {}),
  };

  await updateData(data);
  revalidatePath('/');
  revalidatePath('/contact');
  revalidatePath('/privacy');
  revalidatePath('/terms');
  revalidatePath('/donate');
  revalidatePath('/admin/settings');
  return { success: true };
}

// Page content
export async function savePageContent(pageData: PageContent) {
  await assertAdminPermission('pages');
  const data = await getData();
  const pages: PageContent[] = data.pageContents || [];
  const existingIndex = pages.findIndex((page) => page.slug === pageData.slug);

  if (existingIndex >= 0) {
    pages[existingIndex] = pageData;
  } else {
    pages.push(pageData);
  }

  data.pageContents = pages;
  await updateData(data);
  revalidatePath('/about');
  revalidatePath('/admin/pages');
  revalidatePath('/');
  return { success: true };
}

// Impact Metrics
export async function saveImpactMetrics(metricsData: ImpactMetric[]) {
  await assertAdminPermission('impact');
  const data = await getData();
  data.impactMetrics = metricsData;
  
  await updateData(data);
  revalidatePath('/');
  return { success: true };
}

// Leads
export async function saveLead(email: string) {
  const data = await getData();
  const leads: Lead[] = data.leads || [];
  
  // Check if email already exists
  if (leads.some(l => l.email === email)) {
    return { success: false, error: "Email already subscribed" };
  }
  
  const newLead: Lead = {
    id: uuidv4(),
    email,
    date: new Date().toISOString(),
    status: 'active'
  };
  
  leads.push(newLead);
  data.leads = leads;
  
  await updateData(data);
  revalidatePath('/admin/leads');
  return { success: true };
}

// Gallery
export async function saveGalleryItem(item: GalleryItem) {
  await assertAdminPermission('gallery');
  const data = await getData();
  const gallery: GalleryItem[] = data.gallery || [];
  
  if (item.id) {
    const existingIndex = gallery.findIndex((g: GalleryItem) => g.id === item.id);
    if (existingIndex >= 0) {
      gallery[existingIndex] = item;
    } else {
      gallery.push(item);
    }
  } else {
    item.id = uuidv4();
    gallery.push(item);
  }
  
  data.gallery = gallery;
  await updateData(data);
  revalidatePath('/gallery');
  revalidatePath('/');
  revalidatePath('/admin/gallery');
  return { success: true };
}

export async function deleteGalleryItem(id: string) {
  await assertAdminPermission('gallery');
  const data = await getData();
  const gallery: GalleryItem[] = data.gallery || [];
  
  data.gallery = gallery.filter((g: GalleryItem) => g.id !== id);
  
  await updateData(data);
  revalidatePath('/gallery');
  revalidatePath('/');
  revalidatePath('/admin/gallery');
  return { success: true };
}

export async function saveAdminUser(userData: AdminUserInput) {
  const user = await saveAdminUserAccount(userData);
  revalidatePath('/admin/users');
  revalidatePath('/admin');
  return { success: true, user };
}

export async function deleteAdminUser(userId: string) {
  await deleteAdminUserAccount(userId);
  revalidatePath('/admin/users');
  revalidatePath('/admin');
  return { success: true };
}
