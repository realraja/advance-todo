import connectDB from "@/DB/ConnectDB";
import { verifyToken } from "@/lib/jwt";
import {
  errorResponse,
  failedResponse,
  successResponse,
} from "@/middleware/response";
import User from "@/models/user";
import { cookies } from "next/headers";

export const GET = async (req, context) => {
  const params = await context.params;
  const check = params.check; // "app" or "web"
  if (!check) return failedResponse("please provide check type");

  const cookieStore = await cookies(); // ✅ synchronous
  const cookie = cookieStore.get("token"); // ✅ synchronous

  if (!cookie) return failedResponse("please login first");

  try {
    await connectDB();

    const userEmail = verifyToken(cookie.value).email;

    const user = await User.findOne({ email: userEmail });

    if (!user) return failedResponse("please login first");

    if (check === "app") {
      if (user.tokenApp !== cookie.value) {
        cookies().set({
          name: "token",
          value: "",
          httpOnly: true,
          maxAge: 0,
        });
        return failedResponse("you are logged out");
      }

      return successResponse("user verified successfully", user);
    }

    if (user.tokenWeb !== cookie.value) {
      await cookies().set({
        name: "token",
        value: "",
        httpOnly: true,
        maxAge: 0,
      });
      return failedResponse("you are logged out");
    }

    return successResponse("user verified successfully", user);
  } catch (error) {
    // console.log(error);
    return errorResponse("user verification failed", error.message);
  }
};
