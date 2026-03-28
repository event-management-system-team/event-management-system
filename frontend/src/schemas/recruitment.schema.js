import { z } from "zod";

const positionSchema = z.object({
  name: z.string().trim().min(1, "Position name is required"),
  vacancy: z.coerce.number().min(1, "At least 1 vacancy required"),
  description: z.string().optional(),
  requirements: z.array(z.string()).optional(),
});

export const step1Schema = z.object({
  positions: z
    .array(positionSchema)
    .min(1, "At least one position is required")
    .refine(
      (arr) => arr.every((p) => p.name.trim().length > 0),
      { message: "All positions must have a name" }
    ),
  eventId: z.string().min(1, "Please select an event"),
});

export const step2Schema = z.object({
  deadline: z.date().nullable().optional(),
  benefits: z.array(z.string()).optional(),
});

export const validateStep1 = (form) => {
  const result = step1Schema.safeParse(form);
  if (result.success) return {};

  const errs = {};
  result.error.issues.forEach((e) => {
    // e.path might be like ['positions', 0, 'name'] or ['eventId']
    const key = e.path.join(".");
    errs[key] = e.message;
  });
  return errs;
};

export const validateStep2 = (form) => {
  const result = step2Schema.safeParse(form);
  if (result.success) return {};
  return Object.fromEntries(
    result.error.issues.map((e) => [e.path[0], e.message]),
  );
};
