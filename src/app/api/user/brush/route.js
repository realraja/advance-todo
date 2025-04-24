import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import User from "@/models/user";



export const GET = userTryCatch(async(req) =>{
    const brush = await User.findById(req.user._id).sort({brushed:-1});
    return successResponse('brush fetch successfully',{brush:brush.brushed});
})

export const POST = userTryCatch(async(req) =>{
    const brush = await User.findById(req.user._id);
    brush.brushed.push(new Date());
    await brush.save()
    return successResponse('brush fetch successfully',{brush:brush.brushed});
})




