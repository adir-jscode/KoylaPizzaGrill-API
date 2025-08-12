import z from "zod";

export const resetPasswordZodSchema = z.object({
  newPassword: z.string({ message: "New password is required" }),
  oldPassword: z.string({ message: "Old password is required" }),
});
export const loginZodSchema = z.object({
  username: z.string({ message: "Username is required" }),
  password: z.string({ message: "Password is required" }),
});
