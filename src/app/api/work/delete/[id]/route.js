import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Task from "@/models/task";



export const DELETE = userTryCatch(async (req, context) => {
    const params = await context.params;
    const id = params.id; // "app" or "web"
    // const { id } = params;
    if (!id) return failedResponse('Please provide valid id');
  
    const work = await Task.findOne({
      _id: id,
      user: req.user._id,
      type: 'work'
    });
  
    if (!work) return failedResponse('Work not found');
  
    work.isDeleted = !work.isDeleted;
    await work.save();
  
    return successResponse('Work deleted toggle successfully', { work });
  });
  
