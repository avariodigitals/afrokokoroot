'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { inspectSearchConsoleUrlAction, saveSiteSettings, submitSearchConsoleSitemapAction, testSearchConsoleConnectionAction } from '@/lib/actions';
import { SearchConsoleInspectionResult, SearchConsoleProperty, SearchConsoleSubmissionEntry, SiteSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "../ui/label";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, Loader2, RefreshCw, Save, Search, ShieldCheck } from "lucide-react";
import { toast } from 'sonner';
import { siteConfig } from '@/lib/site-config';

interface SettingsFormProps {
  initialData: SiteSettings;
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestingSearchConsole, startSearchConsoleTest] = useTransition();
  const [isSubmittingSitemap, startSitemapSubmission] = useTransition();
  const [isInspectingUrl, startInspection] = useTransition();
  const [searchConsoleStatus, setSearchConsoleStatus] = useState<string | null>(
    initialData.searchConsoleSettings?.lastConnectionMessage || null
  );
  const [accessibleSites, setAccessibleSites] = useState<SearchConsoleProperty[]>(
    initialData.searchConsoleSettings?.accessibleSites || []
  );
  const [submissionHistory, setSubmissionHistory] = useState<SearchConsoleSubmissionEntry[]>(
    initialData.searchConsoleSettings?.submissionHistory || []
  );
  const [inspectionUrl, setInspectionUrl] = useState('');
  const [inspectionResult, setInspectionResult] = useState<SearchConsoleInspectionResult | undefined>(
    initialData.searchConsoleSettings?.lastInspection
  );
  const monthlyPlanIds = initialData.donationSettings?.monthlyPlanIds || {};
  const [formData, setFormData] = useState({
    address: initialData.contactInfo?.address || '',
    email: initialData.contactInfo?.email || '',
    phone: initialData.contactInfo?.phone || '',
    facebook: initialData.contactInfo?.socials?.facebook || '',
    instagram: initialData.contactInfo?.socials?.instagram || '',
    twitter: initialData.contactInfo?.socials?.twitter || '',
    linkedin: initialData.contactInfo?.socials?.linkedin || '',
    threads: initialData.contactInfo?.socials?.threads || '',
    donationsEnabled: initialData.donationSettings?.donationsEnabled || false,
    paypalClientId: initialData.donationSettings?.paypalClientId || '',
    paypalMerchantId: initialData.donationSettings?.paypalMerchantId || '',
    currencyCode: initialData.donationSettings?.currencyCode || 'USD',
    monthlyPlan5: monthlyPlanIds['5'] || '',
    monthlyPlan10: monthlyPlanIds['10'] || '',
    monthlyPlan15: monthlyPlanIds['15'] || '',
    monthlyPlan20: monthlyPlanIds['20'] || '',
    monthlyPlan25: monthlyPlanIds['25'] || '',
    monthlyPlan50: monthlyPlanIds['50'] || '',
    monthlyPlan100: monthlyPlanIds['100'] || '',
    monthlyPlan250: monthlyPlanIds['250'] || '',
    monthlyPlan500: monthlyPlanIds['500'] || '',
    defaultTitle: initialData.seoSettings?.defaultTitle || '',
    defaultDescription: initialData.seoSettings?.defaultDescription || '',
    defaultKeywords: initialData.seoSettings?.defaultKeywords?.join(', ') || '',
    googleSiteVerification: initialData.seoSettings?.googleSiteVerification || '',
    bingSiteVerification: initialData.seoSettings?.bingSiteVerification || '',
    indexingEnabled: initialData.seoSettings?.indexingEnabled ?? true,
    googleAnalyticsId: initialData.marketingSettings?.googleAnalyticsId || '',
    microsoftClarityId: initialData.marketingSettings?.microsoftClarityId || '',
    metaPixelId: initialData.marketingSettings?.metaPixelId || '',
    searchConsoleEnabled: initialData.searchConsoleSettings?.enabled || false,
    searchConsoleSiteUrl: initialData.searchConsoleSettings?.siteUrl || siteConfig.url,
    searchConsoleServiceAccountJson: initialData.searchConsoleSettings?.serviceAccountJson || '',
    searchConsoleLastSubmittedSitemapUrl: initialData.searchConsoleSettings?.lastSubmittedSitemapUrl || '',
    searchConsoleLastSubmittedAt: initialData.searchConsoleSettings?.lastSubmittedAt || '',
    searchConsoleLastConnectionCheckedAt: initialData.searchConsoleSettings?.lastConnectionCheckedAt || '',
    searchConsoleLastConnectionStatus: initialData.searchConsoleSettings?.lastConnectionStatus || '',
    searchConsoleLastConnectionMessage: initialData.searchConsoleSettings?.lastConnectionMessage || '',
    searchConsoleLastConnectionPermissionLevel: initialData.searchConsoleSettings?.lastConnectionPermissionLevel || '',
  });
  const missingPayPalClientId = formData.donationsEnabled && !formData.paypalClientId.trim();
  const sitemapUrl = `${siteConfig.url}/sitemap.xml`;

  const buildSearchConsolePayload = () => ({
    enabled: formData.searchConsoleEnabled,
    siteUrl: formData.searchConsoleSiteUrl.trim(),
    serviceAccountJson: formData.searchConsoleServiceAccountJson,
    lastSubmittedSitemapUrl: formData.searchConsoleLastSubmittedSitemapUrl,
    lastSubmittedAt: formData.searchConsoleLastSubmittedAt,
    accessibleSites,
    lastConnectionCheckedAt: formData.searchConsoleLastConnectionCheckedAt,
    lastConnectionStatus: formData.searchConsoleLastConnectionStatus,
    lastConnectionMessage: formData.searchConsoleLastConnectionMessage,
    lastConnectionPermissionLevel: formData.searchConsoleLastConnectionPermissionLevel,
    submissionHistory,
    lastInspection: inspectionResult,
  });

  const connectionToneClass = formData.searchConsoleLastConnectionStatus === 'success'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
    : formData.searchConsoleLastConnectionStatus === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-800'
      : 'border-slate-200 bg-slate-50 text-slate-700';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = {
        contactInfo: {
          address: formData.address,
          email: formData.email,
          phone: formData.phone,
          socials: {
            facebook: formData.facebook,
            instagram: formData.instagram,
            twitter: formData.twitter,
            linkedin: formData.linkedin,
            threads: formData.threads,
          }
        },
        donationSettings: {
          donationsEnabled: formData.donationsEnabled,
          paypalClientId: formData.paypalClientId.trim(),
          paypalMerchantId: formData.paypalMerchantId.trim(),
          currencyCode: formData.currencyCode.trim().toUpperCase() || 'USD',
          monthlyPlanIds: {
            '5': formData.monthlyPlan5.trim(),
            '10': formData.monthlyPlan10.trim(),
            '15': formData.monthlyPlan15.trim(),
            '20': formData.monthlyPlan20.trim(),
            '25': formData.monthlyPlan25.trim(),
            '50': formData.monthlyPlan50.trim(),
            '100': formData.monthlyPlan100.trim(),
            '250': formData.monthlyPlan250.trim(),
            '500': formData.monthlyPlan500.trim(),
          }
        },
        seoSettings: {
          defaultTitle: formData.defaultTitle.trim(),
          defaultDescription: formData.defaultDescription.trim(),
          defaultKeywords: formData.defaultKeywords
            .split(',')
            .map((keyword) => keyword.trim())
            .filter(Boolean),
          googleSiteVerification: formData.googleSiteVerification.trim(),
          bingSiteVerification: formData.bingSiteVerification.trim(),
          indexingEnabled: formData.indexingEnabled,
        },
        marketingSettings: {
          googleAnalyticsId: formData.googleAnalyticsId.trim(),
          microsoftClarityId: formData.microsoftClarityId.trim(),
          metaPixelId: formData.metaPixelId.trim(),
        },
        searchConsoleSettings: {
          enabled: formData.searchConsoleEnabled,
          siteUrl: formData.searchConsoleSiteUrl.trim(),
          serviceAccountJson: formData.searchConsoleServiceAccountJson.trim(),
          lastSubmittedSitemapUrl: formData.searchConsoleLastSubmittedSitemapUrl,
          lastSubmittedAt: formData.searchConsoleLastSubmittedAt,
          accessibleSites,
          lastConnectionCheckedAt: formData.searchConsoleLastConnectionCheckedAt,
          lastConnectionStatus: formData.searchConsoleLastConnectionStatus,
          lastConnectionMessage: formData.searchConsoleLastConnectionMessage,
          lastConnectionPermissionLevel: formData.searchConsoleLastConnectionPermissionLevel,
          submissionHistory,
          lastInspection: inspectionResult,
        }
      };

      await saveSiteSettings(submissionData);
      toast.success('Settings updated');
      router.refresh();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestSearchConsole = () => {
    startSearchConsoleTest(async () => {
      try {
        const response = await testSearchConsoleConnectionAction(buildSearchConsolePayload());
        setSearchConsoleStatus(response.message ?? null);
        setAccessibleSites(response.result.accessibleSites || []);
        setFormData((prev) => ({
          ...prev,
          searchConsoleLastConnectionCheckedAt: response.result.checkedAt,
          searchConsoleLastConnectionStatus: response.success ? 'success' : 'warning',
          searchConsoleLastConnectionMessage: response.message ?? '',
          searchConsoleLastConnectionPermissionLevel: response.result.permissionLevel || '',
        }));

        if (response.success) {
          toast.success(response.message);
          return;
        }

        toast.error(response.message);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Search Console connection failed';
        setSearchConsoleStatus(message);
        toast.error(message);
      }
    });
  };

  const handleSubmitSitemap = () => {
    startSitemapSubmission(async () => {
      try {
        const response = await submitSearchConsoleSitemapAction(buildSearchConsolePayload());
        setSearchConsoleStatus(response.message ?? null);
        setSubmissionHistory((prev) => [
          {
            siteUrl: response.result.siteUrl,
            sitemapUrl: response.result.sitemapUrl,
            submittedAt: response.result.submittedAt,
            message: response.message,
          },
          ...prev.slice(0, 9),
        ]);
        setFormData((prev) => ({
          ...prev,
          searchConsoleLastSubmittedSitemapUrl: response.result.sitemapUrl,
          searchConsoleLastSubmittedAt: response.result.submittedAt,
        }));
        toast.success(response.message);
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Sitemap submission failed';
        setSearchConsoleStatus(message);
        toast.error(message);
      }
    });
  };

  const handleInspectUrl = () => {
    startInspection(async () => {
      try {
        const response = await inspectSearchConsoleUrlAction(buildSearchConsolePayload(), inspectionUrl);
        setInspectionResult(response.result);
        setSearchConsoleStatus(response.message ?? null);
        toast.success(response.message);
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'URL inspection failed';
        setSearchConsoleStatus(message);
        toast.error(message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 border-b pb-2">General Contact Info</h3>
        
        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter physical address"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="info@example.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Social Media Links</h3>
        
        <div className="grid gap-2">
          <Label htmlFor="facebook">Facebook URL</Label>
          <Input
            id="facebook"
            name="facebook"
            type="url"
            value={formData.facebook}
            onChange={handleChange}
            placeholder="https://facebook.com/..."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="instagram">Instagram URL</Label>
          <Input
            id="instagram"
            name="instagram"
            type="url"
            value={formData.instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="twitter">Twitter / X URL</Label>
          <Input
            id="twitter"
            name="twitter"
            type="url"
            value={formData.twitter}
            onChange={handleChange}
            placeholder="https://twitter.com/..."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input
            id="linkedin"
            name="linkedin"
            type="url"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/..."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="threads">Threads URL</Label>
          <Input
            id="threads"
            name="threads"
            type="url"
            value={formData.threads}
            onChange={handleChange}
            placeholder="https://threads.net/..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Donation Checkout</h3>

        <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
          <div className="space-y-1">
            <Label htmlFor="donationsEnabled">Enable donation checkout</Label>
            <p className="text-sm text-slate-500">Turns the live PayPal donation button on for the public donate page.</p>
          </div>
          <Switch
            id="donationsEnabled"
            checked={formData.donationsEnabled}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, donationsEnabled: checked }))}
          />
        </div>

        {missingPayPalClientId && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Donations are enabled, but checkout will stay unavailable until you add a PayPal Client ID below.
          </p>
        )}

        <div className="grid gap-2">
          <Label htmlFor="paypalClientId">PayPal Client ID</Label>
          <Input
            id="paypalClientId"
            name="paypalClientId"
            value={formData.paypalClientId}
            onChange={handleChange}
            placeholder="AQx..."
          />
          <p className="text-sm text-slate-500">Required for the PayPal Smart Button. A PayPal merchant or user ID by itself will not activate checkout.</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="paypalMerchantId">PayPal Merchant or User ID</Label>
          <Input
            id="paypalMerchantId"
            name="paypalMerchantId"
            value={formData.paypalMerchantId}
            onChange={handleChange}
            placeholder="Optional reference"
          />
        </div>

        <div className="grid gap-2 max-w-xs">
          <Label htmlFor="currencyCode">Currency Code</Label>
          <Input
            id="currencyCode"
            name="currencyCode"
            value={formData.currencyCode}
            onChange={handleChange}
            placeholder="USD"
            maxLength={3}
          />
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 p-4">
          <div>
            <Label className="text-base">Monthly PayPal Plan IDs</Label>
            <p className="text-sm text-slate-500">Create one PayPal subscription plan for each monthly amount you want to offer, then paste the matching plan ID here.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="monthlyPlan5">$5 monthly plan ID</Label>
              <Input id="monthlyPlan5" name="monthlyPlan5" value={formData.monthlyPlan5} onChange={handleChange} placeholder="P-..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="monthlyPlan10">$10 monthly plan ID</Label>
              <Input id="monthlyPlan10" name="monthlyPlan10" value={formData.monthlyPlan10} onChange={handleChange} placeholder="P-..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="monthlyPlan15">$15 monthly plan ID</Label>
              <Input id="monthlyPlan15" name="monthlyPlan15" value={formData.monthlyPlan15} onChange={handleChange} placeholder="P-..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="monthlyPlan20">$20 monthly plan ID</Label>
              <Input id="monthlyPlan20" name="monthlyPlan20" value={formData.monthlyPlan20} onChange={handleChange} placeholder="P-..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="monthlyPlan25">$25 monthly plan ID</Label>
              <Input id="monthlyPlan25" name="monthlyPlan25" value={formData.monthlyPlan25} onChange={handleChange} placeholder="P-..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="monthlyPlan50">$50 monthly plan ID</Label>
              <Input id="monthlyPlan50" name="monthlyPlan50" value={formData.monthlyPlan50} onChange={handleChange} placeholder="P-..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="monthlyPlan100">$100 monthly plan ID</Label>
              <Input id="monthlyPlan100" name="monthlyPlan100" value={formData.monthlyPlan100} onChange={handleChange} placeholder="P-..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="monthlyPlan250">$250 monthly plan ID</Label>
              <Input id="monthlyPlan250" name="monthlyPlan250" value={formData.monthlyPlan250} onChange={handleChange} placeholder="P-..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="monthlyPlan500">$500 monthly plan ID</Label>
              <Input id="monthlyPlan500" name="monthlyPlan500" value={formData.monthlyPlan500} onChange={handleChange} placeholder="P-..." />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 border-b pb-2">SEO & Search Console</h3>

        <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
          <div className="space-y-1">
            <Label htmlFor="indexingEnabled">Allow search engine indexing</Label>
            <p className="text-sm text-slate-500">Controls whether the public site advertises itself for indexing in metadata and robots.txt.</p>
          </div>
          <Switch
            id="indexingEnabled"
            checked={formData.indexingEnabled}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, indexingEnabled: checked }))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="defaultTitle">Default SEO Title</Label>
          <Input
            id="defaultTitle"
            name="defaultTitle"
            value={formData.defaultTitle}
            onChange={handleChange}
            placeholder="Afrokokoroot Foundation"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="defaultDescription">Default SEO Description</Label>
          <Textarea
            id="defaultDescription"
            name="defaultDescription"
            value={formData.defaultDescription}
            onChange={handleChange}
            placeholder="Describe your organization for search and social previews"
            rows={3}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="defaultKeywords">Default Keywords</Label>
          <Textarea
            id="defaultKeywords"
            name="defaultKeywords"
            value={formData.defaultKeywords}
            onChange={handleChange}
            placeholder="nonprofit, cultural education, community empowerment"
            rows={3}
          />
          <p className="text-sm text-slate-500">Separate keywords with commas.</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="sitemapUrl">Sitemap URL</Label>
          <Input id="sitemapUrl" value={sitemapUrl} readOnly />
          <p className="text-sm text-slate-500">No API is required for sitemap generation. Submit this URL in Google Search Console after verifying the site.</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="googleSiteVerification">Google Search Console Verification Code</Label>
          <Input
            id="googleSiteVerification"
            name="googleSiteVerification"
            value={formData.googleSiteVerification}
            onChange={handleChange}
            placeholder="google-site-verification=... or token"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bingSiteVerification">Bing / Microsoft Verification Code</Label>
          <Input
            id="bingSiteVerification"
            name="bingSiteVerification"
            value={formData.bingSiteVerification}
            onChange={handleChange}
            placeholder="msvalidate.01 token"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Search Console API</h3>

        <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
          <div className="space-y-1">
            <Label htmlFor="searchConsoleEnabled">Enable Search Console API</Label>
            <p className="text-sm text-slate-500">Uses a Google service account to connect this admin directly to Search Console.</p>
          </div>
          <Switch
            id="searchConsoleEnabled"
            checked={formData.searchConsoleEnabled}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, searchConsoleEnabled: checked }))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="searchConsoleSiteUrl">Search Console Property URL</Label>
          <Input
            id="searchConsoleSiteUrl"
            name="searchConsoleSiteUrl"
            value={formData.searchConsoleSiteUrl}
            onChange={handleChange}
            placeholder="https://afrokokoroot.org/ or sc-domain:afrokokoroot.org"
          />
          <p className="text-sm text-slate-500">Use the exact property identifier from Search Console. URL-prefix properties must match exactly.</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="searchConsoleServiceAccountJson">Google Service Account JSON</Label>
          <Textarea
            id="searchConsoleServiceAccountJson"
            name="searchConsoleServiceAccountJson"
            value={formData.searchConsoleServiceAccountJson}
            onChange={handleChange}
            placeholder='{"type":"service_account", ...}'
            rows={8}
          />
          <p className="text-sm text-slate-500">Store the full JSON key here, then add that service account email as an owner or full user in Search Console.</p>
        </div>

        <div className={`rounded-lg border px-4 py-3 text-sm ${connectionToneClass}`}>
          {formData.searchConsoleLastConnectionMessage || 'No Search Console connection test has been run yet.'}
          {formData.searchConsoleLastConnectionCheckedAt && (
            <div className="mt-2 text-xs opacity-80">
              Last checked: {new Date(formData.searchConsoleLastConnectionCheckedAt).toLocaleString()}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 p-4 space-y-3">
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={handleTestSearchConsole} disabled={isTestingSearchConsole || isSubmitting || isSubmittingSitemap}>
              {isTestingSearchConsole ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Test Search Console Connection
            </Button>
            <Button type="button" variant="outline" onClick={handleSubmitSitemap} disabled={isSubmittingSitemap || isSubmitting || isTestingSearchConsole}>
              {isSubmittingSitemap ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Submit Sitemap to Google
            </Button>
          </div>

          {searchConsoleStatus && (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {searchConsoleStatus}
            </p>
          )}

          {formData.searchConsoleLastSubmittedAt && (
            <p className="text-sm text-slate-500">
              Last sitemap submission: {formData.searchConsoleLastSubmittedSitemapUrl || sitemapUrl} on {new Date(formData.searchConsoleLastSubmittedAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 p-4 space-y-3">
          <div>
            <Label className="text-base">Accessible Search Console Properties</Label>
            <p className="text-sm text-slate-500">These are the properties returned by the current service account.</p>
          </div>

          {accessibleSites.length > 0 ? (
            <div className="space-y-2">
              {accessibleSites.map((site) => (
                <div key={site.siteUrl} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <div className="font-medium text-slate-900">{site.siteUrl}</div>
                  <div className="text-xs text-slate-500">Permission: {site.permissionLevel || 'unknown'}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Run a connection test to load accessible properties.</p>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 p-4 space-y-3">
          <div>
            <Label className="text-base">Sitemap Submission History</Label>
            <p className="text-sm text-slate-500">Recent Search Console submissions are kept here.</p>
          </div>

          {submissionHistory.length > 0 ? (
            <div className="space-y-2">
              {submissionHistory.map((entry) => (
                <div key={`${entry.submittedAt}-${entry.sitemapUrl}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <div className="font-medium text-slate-900">{entry.sitemapUrl}</div>
                  <div className="text-xs text-slate-500">Property: {entry.siteUrl}</div>
                  <div className="text-xs text-slate-500">Submitted: {new Date(entry.submittedAt).toLocaleString()}</div>
                  {entry.message && <div className="text-xs text-slate-500">{entry.message}</div>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No sitemap submissions recorded yet.</p>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 p-4 space-y-4">
          <div>
            <Label className="text-base">URL Inspection</Label>
            <p className="text-sm text-slate-500">Inspect an individual page with the Search Console URL Inspection API.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <div className="grid gap-2">
              <Label htmlFor="inspectionUrl">Inspection URL</Label>
              <Input
                id="inspectionUrl"
                value={inspectionUrl}
                onChange={(event) => setInspectionUrl(event.target.value)}
                placeholder={`${siteConfig.url}/about`}
              />
            </div>
            <Button type="button" variant="outline" onClick={handleInspectUrl} disabled={isInspectingUrl || isSubmitting || isSubmittingSitemap || isTestingSearchConsole}>
              {isInspectingUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Inspect URL
            </Button>
          </div>

          {inspectionResult ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <ShieldCheck className="h-4 w-4" />
                {inspectionResult.inspectedUrl}
              </div>
              <div>Inspected: {new Date(inspectionResult.inspectedAt).toLocaleString()}</div>
              <div>Verdict: {inspectionResult.verdict || 'n/a'}</div>
              <div>Coverage: {inspectionResult.coverageState || 'n/a'}</div>
              <div>Crawling: {inspectionResult.crawlingState || 'n/a'}</div>
              <div>Indexing: {inspectionResult.indexingState || 'n/a'}</div>
              <div>Page Fetch: {inspectionResult.pageFetchState || 'n/a'}</div>
              <div>Robots.txt: {inspectionResult.robotsTxtState || 'n/a'}</div>
              <div>Google Canonical: {inspectionResult.googleCanonical || 'n/a'}</div>
              <div>User Canonical: {inspectionResult.userCanonical || 'n/a'}</div>
              <div>Last Crawl: {inspectionResult.lastCrawlTime ? new Date(inspectionResult.lastCrawlTime).toLocaleString() : 'n/a'}</div>
              <div>Rich Results Detected: {inspectionResult.richResultsDetected ? 'Yes' : 'No'}</div>
              {inspectionResult.referringUrls && inspectionResult.referringUrls.length > 0 && (
                <div>
                  Referring URLs: {inspectionResult.referringUrls.join(', ')}
                </div>
              )}
              {inspectionResult.details && <div>Details: {inspectionResult.details}</div>}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No URL inspection has been run yet.</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Analytics & Tracking</h3>

        <div className="grid gap-2">
          <Label htmlFor="googleAnalyticsId">Google Analytics Measurement ID</Label>
          <Input
            id="googleAnalyticsId"
            name="googleAnalyticsId"
            value={formData.googleAnalyticsId}
            onChange={handleChange}
            placeholder="G-XXXXXXXXXX"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="microsoftClarityId">Microsoft Clarity Project ID</Label>
          <Input
            id="microsoftClarityId"
            name="microsoftClarityId"
            value={formData.microsoftClarityId}
            onChange={handleChange}
            placeholder="abcdefghij"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="metaPixelId">Meta Pixel ID</Label>
          <Input
            id="metaPixelId"
            name="metaPixelId"
            value={formData.metaPixelId}
            onChange={handleChange}
            placeholder="123456789012345"
          />
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-900 hover:bg-indigo-800">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
