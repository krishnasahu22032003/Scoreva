import { type Request, type Response } from "express";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";
import { prisma } from "../lib/prisma.js";
import { getMatchStatus, syncMatchStatus } from "../utils/match-status.js";

const MAX_LIMIT = 100;

export const CreateMatch = async (req: Request, res: Response) => {

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const parsed = createMatchSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid schema",
      details: parsed.error.flatten(),
    });
  }

  try {

    const startTime = new Date(parsed.data.startTime);
    const endTime = new Date(parsed.data.endTime);

    const event = await prisma.match.create({
      data: {
        sport: parsed.data.sport,
        firstTeam: parsed.data.firstTeam,
        secondTeam: parsed.data.secondTeam,
        creatorId: req.user.id,
        startTime,
        endTime,
        firstTeamScore: parsed.data.firstTeamScore ?? 0,
        secondTeamScore: parsed.data.secondTeamScore ?? 0,
        status: getMatchStatus(startTime, endTime),
      },
    });

    if (res.app.locals.broadcastMatchCreated) {
      res.app.locals.broadcastMatchCreated(event);
    }

    return res.status(201).json({
      success: true,
      data: event,
    });

  } catch (error) {

    console.error("CreateMatch error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      details: (error as Error).message,
    });

  }
};


export const GetMatchData = async (req: Request, res: Response) => {

  const parsed = listMatchesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid Query",
      details: parsed.error.flatten(),
    });
  }

  const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);
  const page = parsed.data.page ?? 0;

  try {

    const matches = await prisma.match.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: page * limit,
    });

    await Promise.all(
      matches.map((match) =>
        syncMatchStatus(match, async (status) => {
          await prisma.match.update({
            where: { id: match.id },
            data: { status },
          });
        })
      )
    );

    return res.status(200).json({
      success: true,
      data: matches,
    });

  } catch (error) {

    console.error("GetMatchData error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to list matches",
      details: (error as Error).message,
    });

  }
};


export const GetMyMatches = async (req: Request, res: Response) => {

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const parsed = listMatchesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      details: parsed.error.flatten(),
    });
  }

  const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);
  const page = parsed.data.page ?? 0;

  try {

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where: {
          creatorId: req.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: page * limit,
      }),

      prisma.match.count({
        where: {
          creatorId: req.user.id,
        },
      }),
    ]);

    await Promise.all(
      matches.map((match) =>
        syncMatchStatus(match, async (status) => {
          await prisma.match.update({
            where: { id: match.id },
            data: { status },
          });
        })
      )
    );

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: matches,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });

  } catch (error) {

    console.error("GetMyMatches error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details: (error as Error).message,
    });

  }
};

export const DeleteMatch = async (req: Request, res: Response) => {

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const matchId = Number(req.params.id);

  if (!Number.isInteger(matchId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid match id",
    });
  }

  try {

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: { id: true, creatorId: true }
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    if (match.creatorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own matches",
      });
    }

    await prisma.match.delete({
      where: { id: matchId }
    });

    return res.status(200).json({
      success: true,
      message: "Match deleted successfully",
    });

  } catch (error) {

    console.error("DeleteMatch error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details: (error as Error).message,
    });

  }
};