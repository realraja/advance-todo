import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";



export const DELETE = userTryCatch(async (req, context) => {
    const params = await context.params;
    const id = params.id; // "app" or "web"
    // const { id } = params;
    if (!id) return failedResponse('Please provide valid id');
  
    const yearly = await Goal.findOne({
      _id: id,
      user: req.user._id,
      type: 'yearly'
    });
  
    if (!yearly) return failedResponse('yearly not found');
  
    yearly.isDeleted = !yearly.isDeleted;
    await yearly.save();
  
    return successResponse('yearly deleted toggle successfully', { yearly });
  });
  
