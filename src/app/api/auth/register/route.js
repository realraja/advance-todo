import bcrypt from "bcryptjs";
import connectDB from "@/DB/ConnectDB";
import User from "@/models/user";
import { signToken } from "@/lib/jwt";
import { errorResponse, failedResponse, successResponse } from "@/middleware/response";
import { setCookie } from "@/middleware/cookie";
import { uploadResponse } from "@/lib/cloudinary";
 
export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      dob,
      image,
      app = false, // ✅ This default value works now
    } = body;

    if (!name || !email || !password || !dob) {
      return failedResponse("All fields are required");
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return failedResponse("Invalid email");
    }

    const dobYear = new Date(dob).getFullYear();
    const nowYear = new Date().getFullYear();
    if (dobYear < 1950 || dobYear >= nowYear) {
        return failedResponse(`DOB year must be between 1950 and ${nowYear - 1}`);
    }

    if (password.length < 8 || !/\d/.test(password)) {
        return failedResponse("Password must be at least 8 characters and include a number");
    }

    const existing = await User.findOne({ email });
    if (existing)
        return failedResponse("Email already registered");

    let imgUrl = undefined;

    if(image){
      imgUrl = await uploadResponse([image])
    }

    // console.log(imgUrl);

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = signToken({ email }); // JWT creation

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      dob: new Date(dob),
      imgUrl: imgUrl?imgUrl[0]: undefined,
      ...(app ? { tokenApp: token } : { tokenWeb: token }),
    });

    const res = successResponse("User registered successfully",user)

    setCookie(res,token);

    return res;
  } catch (err) {
    console.log("Register Error:", err);
    return errorResponse("Registration failed",err);
  }
}
