import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Task from "@/models/task";



export const GET = userTryCatch(async(req) =>{
    const task = await Task.find({user:req.user._id, type:'task'}).sort({completed:1,doTaskOn:1,createdAt:-1});
    return successResponse('task fetch successfully',{task});
})

