import axios from "axios";
import { ENV } from "./ENV";

interface SignOutResponse {
  success: boolean;
  message: string;
}

export async function userSignOut(): Promise<SignOutResponse> {
  try {
    const res = await axios.post<SignOutResponse>(
      ENV.USER_SIGNOUT as string,
      {},
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Failed to logout");
  }
}