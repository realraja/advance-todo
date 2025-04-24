import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Diary from "@/models/diary";



export const DELETE = userTryCatch(async (req, context) => {
    const params = await context.params;
    const id = params.id; // "app" or "web"
    // const { id } = params;
    if (!id) return failedResponse('Please provide valid id');
  
    const diary = await Diary.findOne({
      _id: id,
      user: req.user._id,
    });
  
    if (!diary) return failedResponse('diary not found');
  
    diary.isDeleted = !diary.isDeleted;
    await diary.save();
  
    return successResponse('diary deleted toggle successfully', { diary });
  });
  
