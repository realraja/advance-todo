import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Diary from "@/models/diary";



export const DELETE = userTryCatch(async (req, context) => {
    const params = await context.params;
    const id = params.id; // "app" or "web"
    // const { id } = params;
    if (!id) return failedResponse('Please provide valid id');
  
    const filling = await Diary.findOne({
      _id: id,
      user: req.user._id,
      type: 'filling'
    });
  
    if (!filling) return failedResponse('filling not found');
  
    filling.isDeleted = !filling.isDeleted;
    await filling.save();
  
    return successResponse('filling deleted toggle successfully', { filling });
  });
  
