import { email, z } from "zod";

export const AgencySchema = z.object({
  name: z.string().min(2, "Agency name must be atleast two charecters"),
  companyEmail: z.email("Invalid email address"),
  companyPhone: z.string().min(7, "Phone must be at least 7"),
  whiteLabel: z.boolean(),
  address: z.string().min(1, "Address Required"),
  city: z.string().min(1, "City Required"),
  zipCode: z.string().min(1, "Zip Code Required"),
  state: z.string().min(1, "State Required"),
  country: z.string().min(1, "Country Required"),
  agencyLogo: z.string().min(1, "Agency Logo Required"),
});

export type AgencyFormValues = z.infer<typeof AgencySchema>;

export const SubAccountSchema = z.object({
  name: z.string().min(2, "Sub-account name must be atleast two charecters"),
  companyEmail: z.email("Invalid email address"),
  companyPhone: z.string().min(7, "Phone must be at least 7"),
  address: z.string().min(1, "Address Required"),
  city: z.string().min(1, "City Required"),
  zipCode: z.string().min(1, "Zip Code Required"),
  state: z.string().min(1, "State Required"),
  country: z.string().min(1, "Country Required"),
  subaccountLogo: z.string().min(1, "Subaccount` Logo Required"),
});

export type SubAccountFormValues = z.infer<typeof SubAccountSchema>;

export const UserDetailsSchema = z.object({
  name: z.string().min(1, "User name must be atleast two charecters"),
  email: z.email("Invalid email address"),
  avatarUrl: z.string(),
  role: z.enum([
    "AGENCY_OWNER",
    "AGENCY_ADMIN",
    "SUBACCOUNT_USER",
    "SUBACCOUNT_GUEST",
  ]),
});

export type UserDetailsFormValues = z.infer<typeof UserDetailsSchema>;

export const UserDataSchema = z.object({
  email: z.email("Invalid email address"),
  role: z.enum(["AGENCY_ADMIN", "SUBACCOUNT_USER", "SUBACCOUNT_GUEST"]),
});

export type UserDataValues = z.infer<typeof UserDataSchema>;
