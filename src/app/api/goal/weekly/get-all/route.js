import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";



export const GET = userTryCatch(async(req) =>{
    const weekly = await Goal.find({user:req.user._id, type:'weekly'}).sort({createdAt:-1});
    return successResponse('weekly fetch successfully',{weekly});
})

