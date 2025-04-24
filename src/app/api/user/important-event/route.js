import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import User from "@/models/user";



export const GET = userTryCatch(async(req) =>{
    const importantEvents = await User.findById(req.user._id);
    return successResponse('importantEvents fetch successfully',{importantEvents:importantEvents.importantEvents});
})

export const POST = userTryCatch(async(req) =>{
    const {name,date} = await req.json();
    if(!name || !date) return failedResponse('invailid cridentials')
    const user = await User.findById(req.user._id);
    user.importantEvents.push({name,date:new Date(date)});
    await user.save()
    return successResponse('importantEvents fetch successfully',{importantEvents:user.importantEvents});
})




