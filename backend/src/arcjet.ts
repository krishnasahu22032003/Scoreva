import arcjet, { tokenBucket } from "@arcjet/node";
import { shield , detectBot} from "@arcjet/node";
import { ENV } from "./lib/env.js";
import type { NextFunction, Request, Response } from "express";


const apiKey = ENV.ARCJET_KEY ;
const arcjet_Mode = ENV.ARCJET_MODE === "DRY_RUN" ? "DRY_RUN" : "LIVE" ;

if(!apiKey) throw new Error('ARCJET_KEY environment variable is missing.');

export const httpArcjet = apiKey ?
    arcjet({
        key: apiKey,
        rules: [
            shield({ mode: arcjet_Mode }),//safe the backend from attacks like sql by searching the incoming request
            detectBot({ mode: arcjet_Mode, allow: ['CATEGORY:SEARCH_ENGINE', "CATEGORY:PREVIEW" ,'CATEGORY:GOOGLE']}),//protects against bots
            tokenBucket({ mode: arcjet_Mode, interval:10, refillRate: 5 , capacity:10 })// rate limit the incoming request so that we can prevent against attacks like ddos
        ],
    }) : null;

export const wsArcjet = apiKey ?
    arcjet({
        key: apiKey,
        rules: [
            shield({ mode: arcjet_Mode }),
            detectBot({ mode: arcjet_Mode, allow: ['CATEGORY:SEARCH_ENGINE', "CATEGORY:PREVIEW" ]}),
            tokenBucket({ mode: arcjet_Mode, interval: 2, capacity: 10 , refillRate:5 })
        ],
    }) : null;
export function securityMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {

    if (req.method === "OPTIONS") {
      return next();
    }

    if (!httpArcjet) return next();

    try {
      const decision = await httpArcjet.protect(req, { requested: 1 });

      if (decision.isDenied()) {
        if (decision.reason?.isRateLimit()) {
          return res.status(429).json({ error: "Too many requests." });
        }

        return res.status(403).json({ error: "Forbidden." });
      }

    } catch (e) {
      console.error("Arcjet middleware error:", e);
      return res.status(503).json({ error: "Service Unavailable" });
    }

    next();
  };
}