import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import User from "@/models/user";



export const GET = userTryCatch(async(req) =>{
    const didThat = await User.findById(req.user._id).select("+didThat").sort({didThat:-1});
    return successResponse('didThat fetch successfully',{didThat:didThat.didThat});
})

export const POST = userTryCatch(async(req) =>{
    const didThat = await User.findById(req.user._id).select("+didThat");
    didThat.didThat.push(new Date());
    await didThat.save()
    return successResponse('didThat added successfully',{didThat:didThat.didThat});
})




