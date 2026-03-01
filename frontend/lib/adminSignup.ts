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

export async function AdminSignup(
    data: SignupPayload
): Promise<SignupResponse> {
    try {
        const response = await axios.post<SignupResponse>(
            ENV.ADMIN_SIGNUP as string,
            data,
            { withCredentials: true }
        );
        console.log(response.data)
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