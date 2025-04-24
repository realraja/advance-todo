import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";



export const GET = userTryCatch(async(req) =>{
    const yearly = await Goal.find({user:req.user._id, type:'yearly',isDeleted:false}).sort({createdAt:-1}).limit(15);
    return successResponse('yearly fetch successfully',{yearly});
})

