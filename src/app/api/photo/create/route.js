import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Photo from "@/models/photo";

export const POST = userTryCatch(async (req) => {
  const { name,isSecure } = await req.json();
  if (!name ) 
    return failedResponse("Please provide all cridentials");



  const photo = await Photo.create({
    user: req.user._id,
    name,
    isSecure:isSecure?isSecure:false
  });
  return successResponse("photo added successfully", { photo });
});
