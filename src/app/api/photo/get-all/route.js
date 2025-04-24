import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Photo from "@/models/photo";



export const GET = userTryCatch(async(req) =>{
    const photo = await Photo.find({user:req.user._id}).sort({createdAt:-1});
    return successResponse('photo fetch successfully',{photo});
})

