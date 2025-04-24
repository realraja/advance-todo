import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";



export const GET = userTryCatch(async(req) =>{
    const monthly = await Goal.find({user:req.user._id, type:'monthly'}).sort({createdAt:-1});
    return successResponse('monthly fetch successfully',{monthly});
})

