import axios from "axios";
import { ENV } from "./ENV";

export interface CreateCommentaryPayload {
  minute?: number;
  sequence?: number;
  period?: string;
  eventType?: string;
  actor?: string;
  team?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  message: string;
}

export interface CommentaryResponse {
  id: number;
  matchId: number;
  minute: number | null;
  sequence: number | null;
  period: string | null;
  eventType: string | null;
  actor: string | null;
  team: string | null;
  message: string;
  metadata: unknown | null;
  tags: string[];
  createdAt: string;
}

interface PostCommentaryApiResponse {
  data: CommentaryResponse;
}

export async function postCommentary(
  matchId: number,
  payload: CreateCommentaryPayload
): Promise<CommentaryResponse> {
  try {
    const res = await axios.post<PostCommentaryApiResponse>(
      `${ENV.COMMENTARY}/${matchId}`,
      payload,
      {
        withCredentials: true,
      }
    );

    return res.data.data;
  } catch (error: any) {
    console.error("Failed to post commentary:", error?.response?.data || error);

    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    throw new Error("Failed to post commentary");
  }
}