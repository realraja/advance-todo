import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Task from "@/models/task";



export const DELETE = userTryCatch(async (req, context) => {
    const params = await context.params;
    const id = params.id; // "app" or "web"
    // const { id } = params;
    if (!id) return failedResponse('Please provide valid id');
  
    const task = await Task.findOne({
      _id: id,
      user: req.user._id,
      type: 'task'
    });
  
    if (!task) return failedResponse('task not found');
  
    task.isDeleted = !task.isDeleted;
    await task.save();
  
    return successResponse('task deleted toggle successfully', { task });
  });
  
