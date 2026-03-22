import { z } from "zod";

export const createRegisterSchema = (t) =>
  z
    .object({
      email: z
        .string()
        .min(1, t("email_is_required"))
        .email(t("invalid_email_format")),
      password: z
        .string()
        .min(1, t("password_is_required"))
        .min(8, t("password_min_8")),
      confirmPassword: z
        .string()
        .min(1, t("confirm_password_required"))
        .min(8, t("password_min_8")),
      fullName: z
        .string()
        .min(1, t("fullname_is_required"))
        .min(2, t("fullname_min_2"))
        .max(50, t("fullname_max_50"))
        .regex(/^[a-zA-Z\s]+$/, t("fullname_letters_only")),
      phone: z
        .string()
        .optional()
        .or(z.literal(""))
        .refine(
          (value) => {
            if (!value) return true;
            const phoneRegex = /^[0-9]{10}$/;
            return phoneRegex.test(value);
          },
          { message: t("phone_10_digits") },
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwords_not_match"),
      path: ["confirmPassword"],
    });

// Fallback for backward compatibility
export const registerSchema = createRegisterSchema((key) => key);
