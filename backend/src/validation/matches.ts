import { z } from "zod";

export const MATCH_STATUS = {
  UPCOMING: "UPCOMING",
  LIVE: "LIVE",
  ENDED: "ENDED",
} as const;


export type MatchStatus =
  (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS];
  
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  page: z.coerce.number().min(0).optional(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createMatchSchema = z.object({
  sport: z.string().min(1),
  firstTeam: z.string().min(1),
  secondTeam: z.string().min(1),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  firstTeamScore: z.coerce.number().int().nonnegative().optional(),
  secondTeamScore: z.coerce.number().int().nonnegative().optional(),
}).superRefine((data, ctx) => {
  if (data.endTime <= data.startTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "endTime must be after startTime",
      path: ["endTime"],
    });
  }
});

export const updateScoreSchema = z.object({
  firstTeamScore: z.coerce.number().int().nonnegative(),
  secondTeamScore: z.coerce.number().int().nonnegative(),
});
