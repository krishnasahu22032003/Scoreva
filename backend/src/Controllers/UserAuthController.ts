import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import z from "zod";
import bcrypt from "bcrypt";

export const UserSignup = async (req: Request, res: Response) => {

    const inputSchema = z.object({
        username: z.string().min(3).max(50).transform((v) => v.trim()),
        email: z.string().email().min(5).max(255).transform((v) => v.trim()),
        password: z.string()
            .min(8).max(128)
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                "Password must include uppercase, lowercase, number, and special character"
            )
            .transform((v) => v.trim().toLocaleLowerCase()),
    });

    const parsedData = inputSchema.safeParse(req.body);

    if (!parsedData.success) {

        return res.status(400).json({
            success: false,
            message: "Input Validation Error"
        })
    };

    const { username, email, password } = parsedData.data;

    try {

        const checkUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (checkUser) {

            return res.status(409).json({
                success: false,
                message: "This Email Already exists please try with different email"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        })

        if (!newUser) {
            return res.status(400).json({
                success: false,
                message: "User is not created"
            })
        }
        return res.status(201).json({
            success: true,
            message: "Signup successful",
            data: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username
            }
        })
    } catch (error) {
        console.log((error as Error).message, "Internal Server Error")
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }

}