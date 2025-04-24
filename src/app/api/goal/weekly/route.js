import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";



export const GET = userTryCatch(async(req) =>{
    const weekly = await Goal.find({user:req.user._id, type:'weekly',isDeleted:false}).sort({createdAt:-1}).limit(15);
    return successResponse('weekly fetch successfully',{weekly});
})

 