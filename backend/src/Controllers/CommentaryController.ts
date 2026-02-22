import type { Request, Response } from "express";
import { matchIdParamSchema } from "../validation/matches.js";
import { listCommentaryQuerySchema } from "../validation/commentary.js";
import { prisma } from "../lib/prisma.js";

const MAX_LIMIT = 100;

export const GetCommentary = async (req: Request, res: Response) => {

    const paramsResult = matchIdParamSchema.safeParse(req.params);

    if (!paramsResult.success) {
        return res.status(400).json({ error: 'Invalid match ID.', details: paramsResult.error.issues });
    }

    const queryResult = listCommentaryQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters.', details: queryResult.error.issues });
    }

    try {
        const { id: matchId } = paramsResult.data;
        const { limit = 10 } = queryResult.data;

        const safeLimit = Math.min(limit, MAX_LIMIT);


        const results = await prisma.commentary.findMany({
            where: {
                matchId: matchId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: safeLimit,
        });
         res.status(200).json({ data: results });
    } catch (error) {
 console.error('Failed to fetch commentary:', error);
        res.status(500).json({ error: 'Failed to fetch commentary.' });
    }
}