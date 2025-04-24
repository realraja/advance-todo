import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import User from "@/models/user";



export const GET = userTryCatch(async(req) =>{
    const run = await User.findById(req.user._id).sort({running:-1});
    return successResponse('run fetch successfully',{run:run.running});
})

export const POST = userTryCatch(async(req) =>{
    const run = await User.findById(req.user._id);
    run.running.push(new Date());
    await run.save()
    return successResponse('run fetch successfully',{run:run.running});
})




