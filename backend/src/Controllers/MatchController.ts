import { type Request, type Response } from "express";
import { createMatchSchema } from "../validation/matches.js";
import { prisma } from "../lib/prisma.js";
import { getMatchStatus } from "../utils/match-status.js";


export const CreateMatch = async (req:Request,res:Response)=>{

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
    startTime:new Date(Parsed.data.startTime),
    endTime:new Date(Parsed.data.endTime),
    firstTeamScore: Parsed.data.firstTeamScore ?? 0 ,
    secondTeamScore:Parsed.data.secondTeamScore ?? 0 ,
    status :getMatchStatus(Parsed.data.startTime , Parsed.data.endTime),
    }
   

})

res.status(201).json({data:event});

}catch(error){
    console.log((error as Error).message);
    return res.status(500).json({
        success:false,
        message:"Internal Server Error",
        details:JSON.stringify(error)
    });

}

}