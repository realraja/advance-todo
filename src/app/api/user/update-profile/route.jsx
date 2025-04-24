import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";

export const PUT = userTryCatch(async (req) => {
  const { name, image, dob } = await req.json();
  if (!name || !image || !dob)
    return failedResponse("Please provide all cridentials");


  let imgUrl = req.user.imgUrl;
  if(imgUrl !== image){
    if (image) {
      const uploadImage = await uploadResponse([image]);
      imgUrl = uploadImage[0];
    }
  }

  req.user.imgUrl = imgUrl;
  req.user.name = name;
  req.user.dob = new Date(dob);
  await req.user.save();


  return successResponse("req.user updated successfully", { user:req.user });
});
