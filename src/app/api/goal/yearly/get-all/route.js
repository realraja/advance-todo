import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";



export const GET = userTryCatch(async(req) =>{
    const yearly = await Goal.find({user:req.user._id, type:'yearly'}).sort({createdAt:-1});
    return successResponse('yearly fetch successfully',{yearly});
})

