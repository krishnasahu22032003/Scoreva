import type { Request, Response } from "express";
import { matchIdParamSchema } from "../validation/matches.js";
import { createCommentarySchema, listCommentaryQuerySchema } from "../validation/commentary.js";
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
        const { limit = MAX_LIMIT } = queryResult.data;

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
};


export const Commentary = async(req:Request,res:Response)=>{

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }


const paramsResult = matchIdParamSchema.safeParse(req.params);

    if (!paramsResult.success) {
        return res.status(400).json({ error: 'Invalid match ID.', details: paramsResult.error.issues });
    }

    const bodyResult = createCommentarySchema.safeParse(req.body);

    if (!bodyResult.success) {
        return res.status(400).json({ error: 'Invalid commentary payload.', details: bodyResult.error.issues });
    }

    try {

    const matchId = paramsResult.data.id;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: {
        id: true,
        creatorId: true,
        status: true,
      },
    });

    if (!match) {
      return res.status(404).json({ error: "Match not found." });
    }

    if (match.creatorId !== req.user.id) {
      return res.status(403).json({
        error: "You can only post commentary to your own matches."
      });
    }

    if (match.status !== "LIVE") {
      return res.status(400).json({
        error: "Commentary can only be added when match is LIVE."
      });
    }

const { minute, sequence, period, eventType, actor, team, tags, metadata,message } = bodyResult.data;

const result = await prisma.commentary.create({
  data: {
    minute: minute ?? null,
    sequence: sequence ?? null,
    period: period ?? null,
    eventType: eventType ?? null,
    actor: actor ?? null,
    team: team ?? null,
    tags: tags ?? [],
 message,
    ...(metadata !== undefined && { metadata }),
    match: {
      connect: { id: paramsResult.data.id },
    },
  },
});


        if(res.app.locals.broadcastCommentary) {
            res.app.locals.broadcastCommentary(result.matchId, result);
        }

        res.status(201).json({ data: result });
    } catch (error) {
        console.error('Failed to create commentary:', error);
        res.status(500).json({ error: 'Failed to create commentary.' });
    }
}