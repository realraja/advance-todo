import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Photo from "@/models/photo";



export const PUT = userTryCatch(async (req, context) => {
    const params = await context.params;
    const id = params.id; // "app" or "web"
    // const { id } = params;
    if (!id) return failedResponse('Please provide valid id');
  
    const photo = await Photo.findOne({
      _id: id,
      user: req.user._id,
    });
  
    if (!photo) return failedResponse('photo not found');
  
    photo.isSecure = !photo.isSecure;
    await photo.save();
  
    return successResponse('photo deleted toggle successfully', { photo });
  });
  
