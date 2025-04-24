import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";



export const DELETE = userTryCatch(async (req, context) => {
    const params = await context.params;
    const id = params.id; // "app" or "web"
    // const { id } = params;
    if (!id) return failedResponse('Please provide valid id');
  
    const goal = await Goal.findOne({
      _id: id,
      user: req.user._id
    });
  
    if (!goal) return failedResponse('goal not found');
  
    goal.isDeleted = !goal.isDeleted;
    await goal.save();
  
    return successResponse('goal deleted toggle successfully', { goal });
  });
  
