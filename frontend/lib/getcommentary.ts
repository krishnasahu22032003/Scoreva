import axios, { AxiosError } from "axios";
import { ENV } from "./ENV";

export interface Commentary {
  id: number;
  matchId: number;
  minute: number | null;
  sequence: number | null;
  period: string | null;
  eventType: string | null;
  actor: string | null;
  team: string | null;
  message: string;
  metadata: Record<string, unknown> | null;
  tags: string[];
  createdAt: string;
}

interface GetCommentaryResponse {
  data: Commentary[];
}

export async function GetCommentary(
  matchId: number,
  limit?: number
): Promise<Commentary[]> {
  try {
    const response = await axios.get<GetCommentaryResponse>(
      `${ENV.GET_COMMENTARY}/${matchId}`,
      {
        params: {
          limit,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;

    if (err.response) {
      throw new Error(err.response.data.error || "Failed to fetch commentary");
    }

    throw new Error("Network error while fetching commentary");
  }
}