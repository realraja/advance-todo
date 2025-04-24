import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Diary from "@/models/diary";



export const GET = userTryCatch(async(req) =>{
    const diary = await Diary.find({user:req.user._id,isDeleted:false}).sort({createdAt:-1}).limit(15);
    return successResponse('diary fetch successfully',{diary});
})

