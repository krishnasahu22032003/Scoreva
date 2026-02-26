import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { z } from "zod";


export const AdminSignUp = async (req: Request, res: Response) => {

const signupSchema = z.object({
  username: z.string().min(3).max(50).trim(),
  email: z.string().email().min(5).max(255).trim().toLowerCase(),
  password: z.string()
    .min(8)
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: parsed.error.flatten(),
    });
  }

  const { username, email, password } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "ADMIN", // 🔥 Hardcoded role
      },
    });

    return res.status(201).json({
      success: true,
      message: "Admin signup successful",
      data: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });

  } catch (error) {
    console.error("Admin signup error:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};