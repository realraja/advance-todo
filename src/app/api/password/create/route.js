import { signToken } from "@/lib/jwt";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Password from "@/models/password";

export const POST = userTryCatch(async (req) => {
  const { name,  username,password,isSecure,url } = await req.json();
  if (!name || !password) 
    return failedResponse("Please provide all cridentials");

  const LockedPassword = signToken({password});

 
  const passwordRes = await Password.create({
    user: req.user._id,
    name,
    username,
    url,
    password:LockedPassword,
    isSecure:isSecure?isSecure:false
  });
  return successResponse("passwordRes added successfully", { password:passwordRes });
});
