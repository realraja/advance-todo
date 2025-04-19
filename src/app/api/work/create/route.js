import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Task from "@/models/task";



export const POST = userTryCatch(async(req) =>{
    const {title, whenDoWork,image} = await req.json();
    if(!title) return failedResponse('Please provide title');
    if(!whenDoWork) return failedResponse('Please provide whenDoWork');

    let imgUrl
          if (image) {
            const uploadImage = await uploadResponse([image]);
            imgUrl = uploadImage[0];
          }
    const work = await Task.create({user:req.user._id,imgUrl, type:'work', title, whenDoWork});
    return successResponse('work added successfully',{work});
})
