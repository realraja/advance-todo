import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";



export const GET = userTryCatch(async(req) =>{
    const goal = await Goal.find({user:req.user._id}).sort({doBefore:1,createdAt:-1});
    return successResponse('goal fetch successfully',{goal});
})

