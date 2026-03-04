import axios from "axios";
import { ENV } from "./ENV";

export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

export async function GetUserDetails(): Promise<User> {
  try {
    const response = await axios.get<User>(
      ENV.USER_DETAIL as string,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    throw error;
  }
}