import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";



export const DELETE = userTryCatch(async (req, context) => {
    const params = await context.params;
    const id = params.id; // "app" or "web"
    // const { id } = params;
    if (!id) return failedResponse('Please provide valid id');
  
    const weekly = await Goal.findOne({
      _id: id,
      user: req.user._id,
      type: 'weekly'
    });
  
    if (!weekly) return failedResponse('weekly not found');
  
    weekly.isDeleted = !weekly.isDeleted;
    await weekly.save();
  
    return successResponse('weekly deleted toggle successfully', { weekly });
  });
  
