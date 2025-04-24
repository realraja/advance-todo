import bcrypt from "bcryptjs";
import connectDB from "@/DB/ConnectDB";
import User from "@/models/user";
import {  verifyToken } from "@/lib/jwt";
import { errorResponse, failedResponse, successResponse } from "@/middleware/response";
export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const {
      password,token
    } = body;

    if (!password,!token) {
      return failedResponse("Email and Token are required");
    }

    const {email,checkToken} = verifyToken(token);



    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return failedResponse("Invalid email",null, 401);
    }

// console.log(token,user.passwordResetToken)
    if (checkToken !== user.passwordResetToken) {
      return failedResponse("Invalid token",null, 401);
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    user.passwordResetToken = undefined; // Clear the password reset token
    user.password = hashedPassword;
    await user.save();

    const res = successResponse("Password reset successfully! Now login please.", user);
    return res;
  } catch (err) {
    console.error("reset password Error:", err);
    return errorResponse("reset password failed", err.message);
  }
}
