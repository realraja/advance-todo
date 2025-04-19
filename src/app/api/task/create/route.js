import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Task from "@/models/task";



export const POST = userTryCatch(async(req) =>{
    const {title, doTaskOn,image} = await req.json();
    if(!title) return failedResponse('Please provide title');
    if(!doTaskOn) return failedResponse('Please provide doTaskBefor');

    const date = new Date(doTaskOn); // UTC midnight
date.setHours(date.getHours() + 23);
date.setMinutes(date.getMinutes() + 55);
date.setSeconds(date.getSeconds() + 40);



    if(date < new Date()) return failedResponse('doTaskOn should be greater than current date');

    let imgUrl
      if (image) {
        const uploadImage = await uploadResponse([image]);
        imgUrl = uploadImage[0];
      }

      if (!doTaskOn || isNaN(new Date(doTaskOn))) {
        return res.status(400).json({ message: 'Invalid or missing date' });
      }

    const task = await Task.create({user:req.user._id, type:'task',imgUrl, title, doTaskOn: new Date(doTaskOn)});
    return successResponse('task added successfully',{task});
})
