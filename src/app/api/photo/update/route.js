import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Photo from "@/models/photo";

export const PUT = userTryCatch(async (req) => {
    const { name,isSecure,id } = await req.json();
    if (!name || !id ) 
      return failedResponse("Please provide all cridentials");
  
  
  
    const photo = await Photo.findOne({
      user: req.user._id,
      _id:id
    });



    
    photo.name = name;
    photo.isSecure = isSecure?isSecure:false;
    await photo.save()


    return successResponse("photo updated successfully", { photo });


});
