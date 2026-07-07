"use server";

import nodemailer from "nodemailer";
import { z } from "zod";

const TARGET_EMAIL = "worldpeace@afrokokorootfoundation.org";
const CC_EMAIL = "info@afrokokorootfoundation.org";

const baseSchema = z.object({
  type: z.enum(["volunteer", "vendor"]),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
  emergencyPhone: z.string().optional(),
  terms: z.literal("true"),
  waiver: z.literal("true"),
});

const volunteerSchema = baseSchema.extend({
  positions: z.string().min(1, "At least one volunteer position is required"),
  experience: z.string().optional(),
});

const vendorSchema = baseSchema.extend({
  brandName: z.string().min(1, "Brand name is required"),
  brandSector: z.string().min(1, "Brand sector is required"),
  brandSummary: z.string().min(1, "Brand summary is required"),
  whyVendor: z.string().min(1, "Why be a vendor is required"),
  specialRequest: z.string().optional(),
});

type VolunteerData = z.infer<typeof volunteerSchema>;
type VendorData = z.infer<typeof vendorSchema>;
type ApplicationData = VolunteerData | VendorData;

export async function submitApplication(formData: FormData) {
  try {
    const type = formData.get("type") as "volunteer" | "vendor";
    const file = formData.get("cv") as File | null;

    const base = {
      type,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      emergencyContact: formData.get("emergencyContact") as string,
      emergencyPhone: (formData.get("emergencyPhone") as string) || undefined,
      terms: formData.get("terms") as "true" | null,
      waiver: formData.get("waiver") as "true" | null,
    };

    let data: ApplicationData;
    if (type === "volunteer") {
      data = volunteerSchema.parse({
        ...base,
        positions: formData.get("positions") as string,
        experience: (formData.get("experience") as string) || undefined,
      });
    } else if (type === "vendor") {
      data = vendorSchema.parse({
        ...base,
        brandName: formData.get("brandName") as string,
        brandSector: formData.get("brandSector") as string,
        brandSummary: formData.get("brandSummary") as string,
        whyVendor: formData.get("whyVendor") as string,
        specialRequest: (formData.get("specialRequest") as string) || undefined,
      });
    } else {
      throw new Error("Invalid application type");
    }

    const attachments: nodemailer.SendMailOptions["attachments"] = [];
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      attachments.push({
        filename: file.name,
        content: Buffer.from(bytes),
        contentType: file.type || "application/octet-stream",
      });
    }

    const { text, html } = buildEmailBody(data, file);

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user;

    if (!host || !user || !pass || !from) {
      console.log("SMTP not configured. Simulating application email:", {
        data,
        body: text,
      });
      return { success: true, simulated: true };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: `"Afrokokoroot Foundation" <${from}>`,
      to: TARGET_EMAIL,
      cc: CC_EMAIL,
      replyTo: data.email,
      subject: `${data.type === "volunteer" ? "Volunteer" : "Vendor"} Application - ${data.name}`,
      text,
      html,
      attachments,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Please fill in all required fields." };
    }

    console.error("Application submission error:", error);
    return {
      success: false,
      error: "Failed to send application. Please try again.",
    };
  }
}

function buildEmailBody(
  data: ApplicationData,
  file: File | null
): { text: string; html: string } {
  const isVolunteer = data.type === "volunteer";

  const commonLines = [
    `Application Type: ${isVolunteer ? "Volunteer" : "Vendor"}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Emergency Contact: ${data.emergencyContact}`,
    data.emergencyPhone ? `Emergency Phone: ${data.emergencyPhone}` : "",
    "",
    isVolunteer
      ? `Volunteer Positions: ${(data as VolunteerData).positions}`
      : `Brand Name: ${(data as VendorData).brandName}`,
    isVolunteer
      ? `Past Experience: ${(data as VolunteerData).experience || "Not provided"}`
      : `Brand Sector: ${(data as VendorData).brandSector}`,
    isVolunteer
      ? ""
      : `About the Brand: ${(data as VendorData).brandSummary}`,
    isVolunteer
      ? ""
      : `Why be a Vendor: ${(data as VendorData).whyVendor}`,
    isVolunteer
      ? ""
      : `Special Request: ${(data as VendorData).specialRequest || "None"}`,
    "",
    `CV / Resume: ${file ? file.name : "Not provided"}`,
    "",
    "Acknowledgments:",
    "- Agreed to the festival terms and conditions: Yes",
    "- Will sign the liability waiver form: Yes",
  ];

  const text = commonLines.filter(Boolean).join("\n");

  const html = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="color: #14532d;">${isVolunteer ? "Volunteer" : "Vendor"} Application</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Emergency Contact:</strong> ${data.emergencyContact}</p>
      ${data.emergencyPhone ? `<p><strong>Emergency Phone:</strong> ${data.emergencyPhone}</p>` : ""}
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
      ${
        isVolunteer
          ? `<p><strong>Volunteer Positions:</strong> ${(data as VolunteerData).positions}</p>
             <p><strong>Past Experience:</strong> ${(data as VolunteerData).experience || "Not provided"}</p>`
          : `<p><strong>Brand Name:</strong> ${(data as VendorData).brandName}</p>
             <p><strong>Brand Sector:</strong> ${(data as VendorData).brandSector}</p>
             <p><strong>About the Brand:</strong> ${(data as VendorData).brandSummary}</p>
             <p><strong>Why be a Vendor:</strong> ${(data as VendorData).whyVendor}</p>
             <p><strong>Special Request:</strong> ${(data as VendorData).specialRequest || "None"}</p>`
      }
      <p><strong>CV / Resume:</strong> ${file ? file.name : "Not provided"}</p>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
      <p><strong>Acknowledgments:</strong></p>
      <ul>
        <li>Agreed to the festival terms and conditions</li>
        <li>Will sign the liability waiver form</li>
      </ul>
    </div>
  `;

  return { text, html };
}
