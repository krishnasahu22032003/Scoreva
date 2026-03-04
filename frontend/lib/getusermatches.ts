import axios from "axios";
import { ENV } from "./ENV";

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  status: string;
  createdAt: string;
}

interface GetMatchesResponse {
  data: Match[];
}

interface Query {
  page?: number;
  limit?: number;
}

export async function GetMatches(query: Query = {}): Promise<Match[]> {
  try {
    const response = await axios.get<GetMatchesResponse>(
      ENV.USER_MATCH as string,
      {
        params: {
          page: query.page ?? 0,
          limit: query.limit ?? 50,
        },
        withCredentials: true,
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    throw error;
  }
}