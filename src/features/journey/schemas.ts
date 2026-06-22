import { z } from "zod";

/** Indian PAN: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F). */
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PINCODE_REGEX = /^[1-9]\d{5}$/;

function yearsAgo(years: number): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d;
}

const dateOfBirthAdult = z
  .string()
  .min(1, "Date of birth is required")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date")
  .refine((v) => new Date(v) <= yearsAgo(18), "You must be at least 18")
  .refine((v) => new Date(v) >= yearsAgo(100), "Enter a valid date of birth");

export const kycSchema = z.object({
  panNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(PAN_REGEX, "Enter a valid PAN (e.g. ABCDE1234F)"),
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name as on PAN")
    .max(80, "Name is too long"),
  dateOfBirth: dateOfBirthAdult,
});

export const personalSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  gender: z.enum(["male", "female", "other"], {
    message: "Select a gender",
  }),
  addressLine1: z.string().trim().min(3, "Address is required").max(120),
  addressLine2: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().min(2, "City is required").max(60),
  state: z.string().trim().min(2, "State is required").max(60),
  pincode: z.string().trim().regex(PINCODE_REGEX, "Enter a valid 6-digit PIN"),
});

export const nomineeSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the nominee’s name").max(80),
  relation: z.enum(["spouse", "child", "parent", "sibling", "other"], {
    message: "Select a relation",
  }),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date")
    .refine((v) => new Date(v) <= new Date(), "Date cannot be in the future"),
  sharePercentage: z.coerce
    .number({ message: "Enter a share %" })
    .int("Use a whole number")
    .min(1, "Share must be at least 1%")
    .max(100, "Share cannot exceed 100%"),
});

export type KycInput = z.infer<typeof kycSchema>;
export type PersonalInput = z.infer<typeof personalSchema>;
export type NomineeInput = z.infer<typeof nomineeSchema>;
