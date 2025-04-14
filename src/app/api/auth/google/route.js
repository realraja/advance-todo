import connectDB from "@/DB/ConnectDB";
import { signToken } from "@/lib/jwt";
import { setCookie } from "@/middleware/cookie";
import {
  errorResponse,
  ResponseFailed,
  successResponse,
} from "@/middleware/response";
import User from "@/models/user";
// import { OAuth2Client } from "google-auth-library";

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const POST = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const { email,app=false } = body;
    if (!email) {
      return ResponseFailed("Email is required!");
    }


    const user = await User.findOne({ email });

if(!user) return ResponseFailed("User not found with this email", {isUser: false});

    const jwtToken = signToken({ email: user.email });

    app ? user.tokenApp : user.tokenWeb = jwtToken;
    await user.save();

    const res = successResponse("Login successful", user);
    setCookie(res, jwtToken);

    return res;
  } catch (error) {
    console.error("Google auth error:", error);
    return errorResponse("google auth error", error.message);
  }
};
// export const POST = async (req) => {
//   try {
//     const body = await req.json();
//     const { token, dob, app = false } = body;
//     if (!token) {
//       return ResponseFailed("Token is required!");
//     }
//     if (!dob) {
//       return ResponseFailed("Date of Birth is required!");
//     }
//     // Verify the Google token
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();

//     if (!payload) {
//       return ResponseFailed("Invalid token payload!");
//     }
//     await connectDB();

//     if (!payload?.name || !payload?.email || !dob) {
//       return failedResponse("All fields are required");
//     }

//     const emailRegex = /^\S+@\S+\.\S+$/;
//     if (!emailRegex.test(payload?.email)) {
//       return failedResponse("Invalid email");
//     }

//     const dobYear = new Date(dob).getFullYear();
//     const nowYear = new Date().getFullYear();
//     if (dobYear < 1950 || dobYear >= nowYear) {
//       return failedResponse(`DOB year must be between 1950 and ${nowYear - 1}`);
//     }

//     const user = await User.findOne({ email: payload?.email });
//     if (!user) {
//       const hashedPassword = await bcrypt.hash(payload?.picture, 10);
//       const jwtToken = signToken({ email: payload?.email }); // JWT creation

//       const user = await User.create({
//         name: payload?.name,
//         email: payload?.email,
//         password: hashedPassword,
//         dob: new Date(dob),
//         imgUrl: payload?.picture || undefined,
//         ...(app ? { tokenApp: jwtToken } : { tokenWeb: jwtToken }),
//       });

//       const res = successResponse("User registered successfully", user);

//       setCookie(res, jwtToken);

//       return res;
//     }



//     const jwtToken = signToken({ email: user.email });

//     app ? user.tokenApp : user.tokenWeb = jwtToken;
//     await user.save();

//     const res = successResponse("Login successful", user);

//     setCookie(res, jwtToken);

//     return res;
//   } catch (error) {
//     console.error("Google auth error:", error);
//     return errorResponse("google auth error", error.message);
//   }
// };

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   try {
//     const { token } = req.body;

//     // Verify the Google token
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();

//     // Check if user exists in your database or create new user
//     const user = await findOrCreateUser({
//       email: payload.email,
//       name: payload.name,
//       googleId: payload.sub,
//       picture: payload.picture,
//     });

//     // Create a session or JWT token for your app
//     const appToken = createAppToken(user.id);

//     return res.status(200).json({
//       success: true,
//       token: appToken,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         picture: user.picture
//       }
//     });

//   } catch (error) {
//     console.error('Google auth error:', error);
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid Google token'
//     });
//   }
// }

// // Helper functions (implement according to your database)
// async function findOrCreateUser(userData) {
//   // Check if user exists in your database
//   // If not, create a new user
//   // Return the user object
// }

// function createAppToken(userId) {
//   // Create and return a JWT token for your app
//   // Using jsonwebtoken or your preferred method
// }
