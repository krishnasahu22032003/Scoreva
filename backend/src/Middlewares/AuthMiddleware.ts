import type { Request, Response, NextFunction } from "express";
import secret from "../config/config.js";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";


interface JwtPayload {
    userId: number;
    role:"USER" | "ADMIN"

}

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token not present "
        })
    }

    try {

        const decoded = jwt.verify(token, secret) as JwtPayload;
        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token",
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            }, select: {
                id: true,
                email: true,
                username: true,
                role:true
            }
        })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        req.user = { id: user.id , role:user.role};


        next();
    } catch (e) {
        console.error("Error in auth middleware:", (e as Error).message);
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }



}
