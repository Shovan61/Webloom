import { z } from "zod";

export const AgencySchema = z.object({
  name: z.string().min(2, "Agency name must be atleast two charecters"),
  companyEmail: z.email("Invalid email address"),
  companyPhone: z.string().min(7, "Phone must be at least 18"),
  whiteLabel: z.boolean(),
  address: z.string().min(1, "At least 1 charecter"),
  city: z.string().min(1, "At least 1 charecter"),
  zipCode: z.string().min(1, "At least 1 charecter"),
  state: z.string().min(1, "At least 1 charecter"),
  country: z.string().min(1, "At least 1 charecter"),
  agencyLogo: z.string().min(1, "At least 1 charecter"),
});

// Infer the TypeScript type
type AgencyFormValues = z.infer<typeof AgencySchema>;