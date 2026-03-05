import axios, { AxiosError } from "axios";
import { ENV } from "./ENV";

export interface Match {
  id: number;
  sport: string;
  firstTeam: string;
  secondTeam: string;
  status: "UPCOMING" | "LIVE" | "ENDED";
  startTime: string;
  endTime: string;
  firstTeamScore: number;
  secondTeamScore: number;
  createdAt: string;
}

interface GetMatchesResponse {
  data: Match[];
}

export interface GetMatchesQuery {
  page?: number;
  limit?: number;
}

export async function GetMatches(
  query: GetMatchesQuery = {}
): Promise<Match[]> {
  try {
    const response = await axios.get<GetMatchesResponse>(
      ENV.USER_MATCH as string,
      {
        params: {
          page: query.page ?? 0,
          limit: query.limit ?? 6,
        },
        withCredentials: true,
      }
    );

    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;

    if (err.response) {
      throw new Error(
        err.response.data?.message || "Failed to fetch matches"
      );
    }

    throw new Error("Network error while fetching matches");
  }
}