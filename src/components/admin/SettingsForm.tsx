'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSiteSettings } from '@/lib/actions';
import { SiteSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "../ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2 } from "lucide-react";
import { toast } from 'sonner';

interface SettingsFormProps {
  initialData: SiteSettings;
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    monthlyPlan25: monthlyPlanIds['25'] || '',
    monthlyPlan50: monthlyPlanIds['50'] || '',
    monthlyPlan100: monthlyPlanIds['100'] || '',
    monthlyPlan250: monthlyPlanIds['250'] || '',
    monthlyPlan500: monthlyPlanIds['500'] || '',
  });

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
            '25': formData.monthlyPlan25.trim(),
            '50': formData.monthlyPlan50.trim(),
            '100': formData.monthlyPlan100.trim(),
            '250': formData.monthlyPlan250.trim(),
            '500': formData.monthlyPlan500.trim(),
          }
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
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="monthlyPlan500">$500 monthly plan ID</Label>
              <Input id="monthlyPlan500" name="monthlyPlan500" value={formData.monthlyPlan500} onChange={handleChange} placeholder="P-..." />
            </div>
          </div>
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
