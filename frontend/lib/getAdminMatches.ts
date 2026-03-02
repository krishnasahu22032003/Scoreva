import axios from "axios";
import { ENV } from "./ENV";

export type MatchStatus = "UPCOMING" | "LIVE" | "ENDED";

export interface AdminMatch {
  id: number;
  creatorId: number;
  sport: string;
  firstTeam: string;
  secondTeam: string;
  status: MatchStatus;
  startTime: string;
  endTime: string;
  firstTeamScore: number;
  secondTeamScore: number;
  createdAt: string;
}

interface GetMyMatchesResponse {
  success: boolean;
  data: AdminMatch[];
}

export async function getAdminMatches(): Promise<AdminMatch[]> {
  try {
    const res = await axios.get<GetMyMatchesResponse>(
      ENV.ADMIN_GET_MATCH as string,
      {
        withCredentials: true,
      }
    );

    if (!res.data.success) {
      throw new Error("Failed to fetch matches");
    }

    return res.data.data;
  } catch (error) {
    console.error("Error fetching admin matches:", error);
    throw error;
  }
}