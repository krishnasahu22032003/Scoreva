import { type Request, type Response } from "express";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";
import { prisma } from "../lib/prisma.js";
import { getMatchStatus } from "../utils/match-status.js";


const MAX_LIMIT = 100 ;

export const CreateMatch = async (req:Request,res:Response)=>{

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }


const Parsed = createMatchSchema.safeParse(req.body);

if(!Parsed.success){
    return res.status(400).json({
        success:false,
        message:"Wrong schema",
        details:JSON.stringify(Parsed.error)
    })
};

try{

const event = await prisma.match.create({
    data:{
  ...Parsed.data,
  creatorId: req.user.id,
    startTime:new Date(Parsed.data.startTime),
    endTime:new Date(Parsed.data.endTime),
    firstTeamScore: Parsed.data.firstTeamScore ?? 0 ,
    secondTeamScore:Parsed.data.secondTeamScore ?? 0 ,
    status :getMatchStatus(Parsed.data.startTime , Parsed.data.endTime),
    }
   

})
if(res.app.locals.broadcastMatchCreated){
  res.app.locals.broadcastMatchCreated(event);
}
res.status(201).json({data:event});

}catch(error){
    console.log((error as Error).message);
    return res.status(500).json({
        success:false,
        message:"Internal Server Error",
        details:JSON.stringify(Parsed.error)
    });

}

}
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

    const data = await prisma.match.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: page * limit,
    });

    return res.json({ data });

  } catch (error) {

    console.log((error as Error).message);

    return res.status(500).json({
      success: false,
      message: "Failed to list matches",
      details: (error as Error).message,
    });
  }
};

export const GetMyMatches = async (req: Request, res: Response) => {
  try {
    // 🔐 Safety check (should already be handled by middleware)
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

    const matches = await prisma.match.findMany({
      where: {
        creatorId: req.user.id, // 🔥 Only this admin's matches
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: page * limit,
    });

    return res.status(200).json({
      success: true,
      data: matches,
    });

  } catch (error) {
    console.error("Failed to fetch admin matches:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};