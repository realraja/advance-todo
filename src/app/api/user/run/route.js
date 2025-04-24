import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import User from "@/models/user";



export const GET = userTryCatch(async(req) =>{
    const run = await User.findById(req.user._id).select("+running").sort({running:-1});
    return successResponse('run fetch successfully',{run:run.running});
})

export const POST = userTryCatch(async(req) =>{
    const run = await User.findById(req.user._id).select("+running");
    run.running.push(new Date());
    await run.save()
    return successResponse('run added successfully',{run:run.running});
})




