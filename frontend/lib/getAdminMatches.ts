import axios, { AxiosError } from "axios";
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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface GetMyMatchesResponse {
  success: boolean;
  data: AdminMatch[];
  pagination: Pagination;
}

export interface GetAdminMatchesQuery {
  page?: number;
  limit?: number;
}

export interface GetAdminMatchesResult {
  matches: AdminMatch[];
  pagination: Pagination;
}

export async function getAdminMatches(
  query: GetAdminMatchesQuery = {}
): Promise<GetAdminMatchesResult> {
  try {
    const res = await axios.get<GetMyMatchesResponse>(
      ENV.ADMIN_GET_MATCH as string,
      {
        params: {
          page: query.page ?? 0,
          limit: query.limit ?? 6,
        },
        withCredentials: true,
      }
    );

    if (!res.data.success) {
      throw new Error("Failed to fetch matches");
    }

    return {
      matches: res.data.data,
      pagination: res.data.pagination,
    };
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;

    if (err.response) {
      throw new Error(
        err.response.data?.message || "Failed to fetch admin matches"
      );
    }

    throw new Error("Network error while fetching admin matches");
  }
}