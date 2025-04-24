import bcrypt from "bcryptjs";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/user";
import Password from "@/models/password";

export const POST = userTryCatch(async (req, context) => {
  const { id, userPassword } = await req.json();
  // const { id } = params;
  if (!id) return failedResponse("Please provide valid id");

  const password = await Password.findOne({
    _id: id,
    user: req.user._id,
  }).select("+password");
  if (!password) return failedResponse("password not found");

  if (password.isSecure) {
    const user = await User.findById(req.user._id).select("+password");

    // console.log(id,userPassword)
    const isMatch = await bcrypt.compare(userPassword, user.password);
    if (!isMatch) {
      return failedResponse("Invalid password", null, 401);
    }
  }

  const getPassword = verifyToken(password.password);
  console.log(getPassword)

  return successResponse("password get successfully", {
    password: getPassword.password,
  });
});
