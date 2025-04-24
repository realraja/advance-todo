import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Photo from "@/models/photo";

export const POST = userTryCatch(async (req) => {
  const { name,id,image,isSecure } = await req.json();
  // console.log(image,id,name,isSecure)
  if (!name || !id || !image ) 
    return failedResponse("Please provide all cridentials");


  const photo = await Photo.findOne({
    user: req.user._id,
    _id:id
  }).select('+photos');

  let imgUrl;

  if(image){
    const fileUrl = await uploadResponse([image])
    imgUrl = fileUrl[0]
  }

  const uploadedPhotos = {
    name,isSecure: isSecure?isSecure:false,imgUrl
  }

photo.photos = [...photo.photos,uploadedPhotos]
await photo.save();



  return successResponse("photo added successfully", { photo });
});
