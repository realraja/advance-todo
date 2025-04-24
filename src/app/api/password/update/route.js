import { signToken } from "@/lib/jwt";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Password from "@/models/password";
 
export const PUT = userTryCatch(async (req) => {
  const { id, name, username, password, isSecure, url } = await req.json();
  if (!id || !name || !username)
    return failedResponse("Please provide all cridentials");

  const passwordRes = await Password.findOne({
    user: req.user._id,
    _id: id,
  }).select("+password");

  if (!passwordRes) return failedResponse("password not found");

  if (password) {
    const LockedPassword = signToken({password});
    passwordRes.password = LockedPassword;
  }

  passwordRes.name = name;
  passwordRes.username = username;
  passwordRes.isSecure = isSecure;
  passwordRes.url = url;
  await passwordRes.save();

  return successResponse("passwordRes added successfully", {
    password: passwordRes,
  });
});
