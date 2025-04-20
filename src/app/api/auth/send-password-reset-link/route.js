import connectDB from "@/DB/ConnectDB";
import User from "@/models/user";
import { generateRandomString, signToken } from "@/lib/jwt";
import { errorResponse, failedResponse, successResponse } from "@/middleware/response";
import { sendMail } from "@/lib/sendEmail";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const {
      email
    } = body;

    if (!email) {
      return failedResponse("Email are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return failedResponse("Invalid email",null, 401);
    }

    const resetToken = generateRandomString(32);
    const passwordResetToken = signToken({token:resetToken,email});

    const {error,message} = await sendMail(email, passwordResetToken);

    if (error) {
      return errorResponse("Email sending failed", message);
    }


    user.passwordResetToken = passwordResetToken;
    await user.save();

    const res = successResponse("Password Link Sent On "+ email, user);


    return res;
  } catch (err) {
    console.error("send email Error:", err);
    return errorResponse("send email failed", err.message);
  }
}
