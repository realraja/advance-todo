import connectDB from "@/DB/ConnectDB";
import { cookies } from "next/headers";
import { ResponseFailed, ResponseFailedError } from "./response";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/user";

export const userTryCatch = (passedFunction) => async (req, context) => {
  try {
    await connectDB();
    const {User,data} = await UserAuth(req);
    if (!User) return ResponseFailed("Please Login First", { User,data });
    req.user = User;

    return await passedFunction(req, context); // <== forward context (e.g. { params })
  } catch (error) {
    console.log("try catch error: " + error);
    return ResponseFailedError("Internal Server Error", error.message);
  }
};

export const UserAuth = async (req) => {
  //    const cookie = await req.cookies;
  //   const cookie = cookies().get("Raithan_Token");

  const cookieStore = await cookies(); // gets all cookies
  const cookie = cookieStore.get("token"); // replace with your actual cookie key

  if (!cookie) return {User:false,data:'cookie error'};

  //    const isVerified = jwt.verify(cookie.value,process.env.JWT_SECRET).password ===  process.env.ADMIN_PASSWORD
  const userEmail = verifyToken(cookie.value).email;
 
  if (!userEmail) return {User:false,data:'user email not found from token'};

  const user = await User.findOne({email:userEmail});

  if (!user) return {User:false,data:'user Not Found'};

  if (user.tokenWeb !== cookie.value && user.tokenApp !== cookie.value) {
    await cookies().set({
      name: "Raithan_Token",
      value: "",
      httpOnly: true,
      maxAge: 0,
    });
    return {User:false,data:'cookie not match'};
  }

  return {User:user,data:'user get success'};
};
