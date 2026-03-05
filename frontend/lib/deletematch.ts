import axios, { AxiosError } from "axios";
import { ENV } from "./ENV";

interface DeleteMatchResponse {
  success: boolean;
  message: string;
  id?: number;
}

export async function DeleteMatch(matchId: number): Promise<DeleteMatchResponse> {
  try {
    const response = await axios.delete<DeleteMatchResponse>(
      `${ENV.DELETE_MATCH}/${matchId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;

    if (err.response) {
      throw new Error(err.response.data?.message || "Failed to delete match");
    }

    throw new Error("Network error while deleting match");
  }
}