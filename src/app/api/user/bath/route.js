import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import User from "@/models/user";


 
export const GET = userTryCatch(async(req) =>{
    const bath = await User.findById(req.user._id).select("+bathed").sort({bathed:-1});
    return successResponse('bath fetch successfully',{bath:bath.bathed});
})

export const POST = userTryCatch(async(req) =>{
    const bath = await User.findById(req.user._id).select("+bathed");
    bath.bathed.push(new Date());
    await bath.save()
    return successResponse('bath added successfully',{bath:bath.bathed});
})




