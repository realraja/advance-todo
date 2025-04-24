import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Password from "@/models/password";



export const GET = userTryCatch(async(req) =>{
    const password = await Password.find({user:req.user._id}).sort({createdAt:-1});
    return successResponse('password fetch successfully',{password});
})

