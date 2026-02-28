import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d+$/, "Code must only contain digits"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])/,
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
      ),

    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
