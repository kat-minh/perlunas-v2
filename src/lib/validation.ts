import { z } from "zod";

/** Arrival-card lead form — shared by client (RHF) and server (API route). */
export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập tên của bạn")
    .max(80, "Tên quá dài"),
  phone: z
    .string()
    .trim()
    .regex(
      /^(0|\+84)(\s?\d){8,11}$/,
      "Số điện thoại không hợp lệ (VD: 0901 234 567)",
    ),
  destination: z.string().trim().min(1, "Hãy cho biết bạn muốn đi đâu"),
  // Optional — the immersive single-field form may omit these; the richer
  // enquiry / private-tour form still sends them.
  travelDate: z.string().trim().optional(),
  month: z.string().trim().optional(),
  year: z.string().trim().optional(),
  days: z.string().trim().optional(),
  groupSize: z.string().trim().optional(),
  budget: z.string().trim().optional(),
  email: z.string().trim().email("Email không hợp lệ").optional().or(z.literal("")),
  service: z.string().trim().optional(),
  source: z.string().trim().optional(),
  newsletter: z.string().trim().optional(),
  message: z.string().trim().max(1000).optional(),
  channel: z.enum(["zalo", "messenger", "call"]),
  // Honeypot — must stay empty. Bots tend to fill every field.
  company: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
