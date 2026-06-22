import { describe, expect, it } from "vitest";
import { kycSchema, nomineeSchema, personalSchema } from "./schemas";

describe("kyc validation", () => {
  it("accepts a valid PAN and normalises it to uppercase", () => {
    const result = kycSchema.safeParse({
      panNumber: "abcde1234f",
      fullName: "Aarav Sharma",
      dateOfBirth: "1990-05-10",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.panNumber).toBe("ABCDE1234F");
  });

  it("rejects a malformed PAN", () => {
    const result = kycSchema.safeParse({
      panNumber: "12345ABCDE",
      fullName: "Aarav Sharma",
      dateOfBirth: "1990-05-10",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an applicant under 18", () => {
    const recent = new Date();
    recent.setFullYear(recent.getFullYear() - 10);
    const result = kycSchema.safeParse({
      panNumber: "ABCDE1234F",
      fullName: "Young Person",
      dateOfBirth: recent.toISOString().slice(0, 10),
    });
    expect(result.success).toBe(false);
  });
});

describe("personal validation", () => {
  it("rejects an invalid email", () => {
    const result = personalSchema.safeParse({
      fullName: "A B",
      email: "not-an-email",
      gender: "male",
      addressLine1: "1 Street",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-6-digit pincode", () => {
    const result = personalSchema.safeParse({
      fullName: "A B",
      email: "a@b.com",
      gender: "female",
      addressLine1: "1 Street",
      city: "Pune",
      state: "Maharashtra",
      pincode: "4110",
    });
    expect(result.success).toBe(false);
  });
});

describe("nominee validation", () => {
  it("rejects a share above 100", () => {
    const result = nomineeSchema.safeParse({
      fullName: "Nom",
      relation: "spouse",
      dateOfBirth: "1992-01-01",
      sharePercentage: 120,
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid nominee", () => {
    const result = nomineeSchema.safeParse({
      fullName: "Nom",
      relation: "child",
      dateOfBirth: "2010-01-01",
      sharePercentage: 100,
    });
    expect(result.success).toBe(true);
  });
});
