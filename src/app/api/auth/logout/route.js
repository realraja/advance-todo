import connectDB from '@/DB/ConnectDB';
import { verifyToken } from '@/lib/jwt';
import { errorResponse, failedResponse, successResponse } from '@/middleware/response';
import User from '@/models/user';

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { app = false } = body; // ✅ This default value works now
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return failedResponse('Already logged out');
    }

    const decoded = verifyToken(token);
    if (!decoded?.email) {
      return failedResponse('Invalid token');
    }


    console.log(decoded)

    const user = await User.findOne({ email: decoded.email });
    if (user) {
      app?user.tokenApp:user.tokenWeb = null;
      await user.save();
    }

    const res = successResponse('Logout successful',user);

    res.cookies.set('token', '', {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
      path: '/',
    });

    return res;
  } catch (err) {
    console.error('Logout Error:', err);
    return errorResponse('Logout failed', err.message);
  }
}
