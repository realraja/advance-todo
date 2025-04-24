import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";



export const DELETE = userTryCatch(async (req, context) => {
    const params = await context.params;
    const id = params.id; // "app" or "web"
    // const { id } = params;
    if (!id) return failedResponse('Please provide valid id');
  
    const monthly = await Goal.findOne({
      _id: id,
      user: req.user._id,
      type: 'monthly'
    });
  
    if (!monthly) return failedResponse('monthly not found');
  
    monthly.isDeleted = !monthly.isDeleted;
    await monthly.save();
  
    return successResponse('monthly deleted toggle successfully', { monthly });
  });
  
