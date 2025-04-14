import bcrypt from "bcryptjs";
import connectDB from "@/DB/ConnectDB";
import User from "@/models/user";
import { signToken } from "@/lib/jwt";
import { errorResponse, failedResponse, successResponse } from "@/middleware/response";
import { setCookie } from "@/middleware/cookie";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const {
      email,
      password,
      app = false, // ✅ This default value works now
    } = body;

    if (!email || !password) {
      return failedResponse("Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return failedResponse("Invalid email or password",null, 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return failedResponse("Invalid email or password",null, 401);
    }

    const token = signToken({ email: user.email });

    app ? user.tokenApp : user.tokenWeb = token;
    await user.save();

    const res = successResponse("Login successful", user);

    setCookie(res, token);

    return res;
  } catch (err) {
    console.error("Login Error:", err);
    return errorResponse("Login failed", err.message);
  }
}
