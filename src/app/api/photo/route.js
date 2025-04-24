import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Photo from "@/models/photo";



export const GET = userTryCatch(async(req) =>{
    const photo = await Photo.find({user:req.user._id,isDeleted:false,isSecure:false}).sort({createdAt:-1}).limit(15);
    return successResponse('photo fetch successfully',{photo});
})

