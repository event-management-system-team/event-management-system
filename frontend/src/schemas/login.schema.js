import { z } from "zod";

export const createLoginSchema = (t) =>
  z.object({
    email: z
      .string()
      .min(1, t("email_is_required"))
      .email(t("invalid_email_format")),
    password: z
      .string()
      .min(1, t("password_is_required"))
      .min(8, t("password_min_8")),
  });

// Fallback for backward compatibility
export const loginSchema = createLoginSchema((key) => key);
