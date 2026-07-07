"use client";

import { useState } from "react";
import {
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitApplication } from "@/lib/application-actions";

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
}

const initialForm = {
  name: "",
  email: "",
  phone: "",
  emergencyContact: "",
  emergencyPhone: "",
  brandName: "",
  brandSector: "",
  brandSummary: "",
  whyVendor: "",
  specialRequest: "",
  terms: false,
  waiver: false,
};

export function VendorModal({ isOpen, onClose, eventTitle }: VendorModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return (
          formData.name &&
          formData.email &&
          formData.phone &&
          formData.emergencyContact
        );
      case 2:
        return (
          formData.brandName &&
          formData.brandSector &&
          formData.brandSummary &&
          formData.whyVendor
        );
      case 3:
        return true;
      case 4:
        return formData.terms && formData.waiver;
      default:
        return false;
    }
  };

  const reset = () => {
    setStep(1);
    setFormData(initialForm);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed()) {
      toast.error("Please accept the terms and liability waiver.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("type", "vendor");
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("emergencyContact", formData.emergencyContact);
      data.append("emergencyPhone", formData.emergencyPhone);
      data.append("brandName", formData.brandName);
      data.append("brandSector", formData.brandSector);
      data.append("brandSummary", formData.brandSummary);
      data.append("whyVendor", formData.whyVendor);
      data.append("specialRequest", formData.specialRequest);
      data.append("terms", formData.terms ? "true" : "false");
      data.append("waiver", formData.waiver ? "true" : "false");

      const result = await submitApplication(data);
      if (result.success) {
        toast.success(
          result.simulated
            ? "Application recorded (SMTP not configured)."
            : "Application submitted! We'll be in touch soon."
        );
        handleClose();
      } else {
        toast.error(result.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = ["Contact", "Brand", "Requests", "Acknowledge"];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl p-0 overflow-hidden max-h-[90vh] flex flex-col bg-white border-lime-100">
        <div className="bg-green-900 p-6 text-white relative shrink-0">
          <div className="absolute top-4 right-4">
            <button
              onClick={handleClose}
              className="rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center">
            <Store className="h-8 w-8 mx-auto mb-3 text-lime-400" />
            <DialogTitle className="text-xl font-bold">{eventTitle}</DialogTitle>
            <DialogDescription className="text-lime-100/80 text-sm">
              Become a Vendor
            </DialogDescription>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
              <span>
                Step {step} of {stepLabels.length}
              </span>
              <span>{stepLabels[step - 1]}</span>
            </div>
            <div className="h-2 bg-lime-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all duration-300"
                style={{ width: `${(step / stepLabels.length) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={step === stepLabels.length ? handleSubmit : handleNext}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor-name">Full Name *</Label>
                  <Input
                    id="vendor-name"
                    required
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor-email">Email Address *</Label>
                  <Input
                    id="vendor-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor-phone">Phone Number *</Label>
                  <Input
                    id="vendor-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor-emergency-name">Emergency Contact *</Label>
                    <Input
                      id="vendor-emergency-name"
                      required
                      value={formData.emergencyContact}
                      onChange={(e) =>
                        updateField("emergencyContact", e.target.value)
                      }
                      placeholder="Contact name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendor-emergency-phone">Emergency Phone</Label>
                    <Input
                      id="vendor-emergency-phone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) =>
                        updateField("emergencyPhone", e.target.value)
                      }
                      placeholder="Contact phone"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-800">
                  <strong>Note:</strong> Any food vendor that will bring
                  vehicles, gas, or equipment requiring permits should not
                  apply.
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name *</Label>
                  <Input
                    id="brand-name"
                    required
                    value={formData.brandName}
                    onChange={(e) => updateField("brandName", e.target.value)}
                    placeholder="Your brand name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand-sector">Brand Sector *</Label>
                  <Input
                    id="brand-sector"
                    required
                    value={formData.brandSector}
                    onChange={(e) => updateField("brandSector", e.target.value)}
                    placeholder="e.g. Food, Crafts, Art, Clothing"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand-summary">About the Brand Summary *</Label>
                  <Textarea
                    id="brand-summary"
                    required
                    value={formData.brandSummary}
                    onChange={(e) => updateField("brandSummary", e.target.value)}
                    placeholder="Tell us about your brand and what you offer..."
                    className="min-h-[100px] resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="why-vendor">Why be a Vendor? *</Label>
                  <Textarea
                    id="why-vendor"
                    required
                    value={formData.whyVendor}
                    onChange={(e) => updateField("whyVendor", e.target.value)}
                    placeholder="Why do you want to be a vendor at this festival?"
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="special-request">Special Request (optional)</Label>
                  <Textarea
                    id="special-request"
                    value={formData.specialRequest}
                    onChange={(e) =>
                      updateField("specialRequest", e.target.value)
                    }
                    placeholder="Any special requests or requirements..."
                    className="min-h-[150px] resize-none"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Please acknowledge the following before submitting.
                </p>
                <label className="flex items-start gap-3 p-3 rounded-xl border border-lime-100 bg-lime-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                    checked={formData.terms}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, terms: e.target.checked }))
                    }
                  />
                  <span className="text-sm text-slate-700">
                    I agree to the festival terms and conditions.
                  </span>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-xl border border-lime-100 bg-lime-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                    checked={formData.waiver}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, waiver: e.target.checked }))
                    }
                  />
                  <span className="text-sm text-slate-700">
                    I understand that I will be required to sign a liability
                    waiver form.
                  </span>
                </label>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-12 border-lime-200 text-green-700 hover:bg-lime-50"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : step === stepLabels.length ? (
                  "Submit Application"
                ) : (
                  <>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
