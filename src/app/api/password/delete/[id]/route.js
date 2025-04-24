import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Password from "@/models/password";



export const DELETE = userTryCatch(async (req, context) => {
    const params = await context.params;
    const id = params.id; // "app" or "web"
    // const { id } = params;
    if (!id) return failedResponse('Please provide valid id');
  
    const password = await Password.findOne({
      _id: id,
      user: req.user._id
    });
  
    if (!password) return failedResponse('password not found');
  
    password.isDeleted = !password.isDeleted;
    await password.save();
  
    return successResponse('password deleted toggle successfully', { password });
  });
  
