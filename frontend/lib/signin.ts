import axios, { AxiosError } from "axios"
import { ENV } from "./ENV"

interface Data {

email:string,
password:string

}

interface SingInResponse {
success:boolean,
message:string,
data:{
id:number,
username:string,
email:string,
role: "USER" | "ADMIN";
};

}

export async function UserSignin(data:Data):Promise<SingInResponse>{

try{
const response = await axios.post<SingInResponse>(
            ENV.SIGNIN as string,
            data,
            { withCredentials: true }
        );
        console.log(response.data)
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const message =
                error.response?.data?.message || "Signin failed";
            throw new Error(message);
        }

        throw new Error("Something went wrong");
    }
}

