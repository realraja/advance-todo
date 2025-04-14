import { successResponse } from "@/middleware/response";
import { cookies } from "next/headers";



export const GET = async (req) => {
    const cookieStore = await cookies(); // gets all cookies
  const token = cookieStore.get('token'); // replace with your actual cookie key

  return successResponse("token get succesfull",{ token: token?.value });
}