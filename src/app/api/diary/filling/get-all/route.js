import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Diary from "@/models/diary";



export const GET = userTryCatch(async(req) =>{
    const filling = await Diary.find({user:req.user._id, type:'filling'}).sort({createdAt:-1});
    return successResponse('filling fetch successfully',{filling});
})

