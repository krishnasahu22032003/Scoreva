import axios, { AxiosError } from "axios";
import { ENV } from "./ENV";

interface SignupPayload {
    username: string;
    email: string;
    password: string;
}

interface SignupResponse {
    message: string;
    user: {
        id: string;
        username: string;
        email: string;
        role: string
    };
}

export async function UserSignup(
    data: SignupPayload
): Promise<SignupResponse> {
    try {
        const response = await axios.post<SignupResponse>(
            ENV.USER_SIGNUP as string,
            data,
            { withCredentials: true }
        );

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const message =
                error.response?.data?.message || "Signup failed";
            throw new Error(message);
        }

        throw new Error("Something went wrong");
    }
}