"use client";

import { useState, useRef } from "react";
import {
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  HandHeart,
  FileText,
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

const VOLUNTEER_POSITIONS = [
  "Stage Setup & Breakdown",
  "Registration & Check-in",
  "Hospitality & Guest Services",
  "Food & Beverage Support",
  "Vendor Support",
  "Cleanup & Waste Management",
  "Security & Crowd Support",
  "Transportation & Parking",
  "Medical / First Aid Support",
  "Social Media / Photography",
];

interface VolunteerModalProps {
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
  positions: [] as string[],
  experience: "",
  terms: false,
  waiver: false,
};

export function VolunteerModal({ isOpen, onClose, eventTitle }: VolunteerModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePosition = (position: string) => {
    setFormData((prev) => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter((p) => p !== position)
        : [...prev.positions, position],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setFileName(selected ? selected.name : "");
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
        return formData.positions.length > 0;
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
    setFile(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed()) {
      toast.error(
        step === 2
          ? "Please select at least one volunteer position."
          : "Please fill in all required fields."
      );
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
      data.append("type", "volunteer");
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("emergencyContact", formData.emergencyContact);
      data.append("emergencyPhone", formData.emergencyPhone);
      data.append("positions", formData.positions.join(", "));
      data.append("experience", formData.experience);
      data.append("terms", formData.terms ? "true" : "false");
      data.append("waiver", formData.waiver ? "true" : "false");
      if (file) data.append("cv", file);

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

  const stepLabels = ["Contact", "Position", "Experience", "Acknowledge"];

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
            <HandHeart className="h-8 w-8 mx-auto mb-3 text-lime-400" />
            <DialogTitle className="text-xl font-bold">{eventTitle}</DialogTitle>
            <DialogDescription className="text-lime-100/80 text-sm">
              Register as a Volunteer
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
                  <Label htmlFor="vol-name">Full Name *</Label>
                  <Input
                    id="vol-name"
                    required
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vol-email">Email Address *</Label>
                  <Input
                    id="vol-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vol-phone">Phone Number *</Label>
                  <Input
                    id="vol-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vol-emergency-name">Emergency Contact *</Label>
                    <Input
                      id="vol-emergency-name"
                      required
                      value={formData.emergencyContact}
                      onChange={(e) =>
                        updateField("emergencyContact", e.target.value)
                      }
                      placeholder="Contact name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vol-emergency-phone">Emergency Phone</Label>
                    <Input
                      id="vol-emergency-phone"
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
                <p className="text-sm text-slate-600">
                  Please pick important positions for a festival.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {VOLUNTEER_POSITIONS.map((position) => (
                    <label
                      key={position}
                      className="flex items-start gap-3 p-3 rounded-xl border border-lime-100 bg-lime-50/50 cursor-pointer hover:border-lime-300 transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                        checked={formData.positions.includes(position)}
                        onChange={() => togglePosition(position)}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {position}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vol-experience">Past Experience (optional)</Label>
                  <Textarea
                    id="vol-experience"
                    value={formData.experience}
                    onChange={(e) => updateField("experience", e.target.value)}
                    placeholder="Tell us about your previous volunteering or relevant experience..."
                    className="min-h-[120px] resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CV / Resume (optional)</Label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-12 border-dashed border-lime-200 text-green-700 hover:bg-lime-50"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {fileName || "Upload CV / Resume"}
                  </Button>
                  {fileName && (
                    <p className="text-xs text-slate-500">
                      Selected: {fileName}
                    </p>
                  )}
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
