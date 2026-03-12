import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(1, "Confirm Password is required")
      .min(8, "Password must be at least 8 characters long"),
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters long")
      .max(50, "Full name must be at most 50 characters long")
      .regex(/^[a-zA-Z\s]+$/, "Full name must contain only letters and spaces"),
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
        { message: "Phone number must be a 10-digit number" },
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
