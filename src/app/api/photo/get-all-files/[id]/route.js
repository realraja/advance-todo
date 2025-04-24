import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Photo from "@/models/photo";



export const GET = userTryCatch(async (req, context) => {
    const params = await context.params;
    const id = params.id; // "app" or "web"
    // const { id } = params;
    if (!id) return failedResponse('Please provide valid id');
  
    const photo = await Photo.findOne({
      _id: id,
      user: req.user._id
    }).select('+photos');
  
    if (!photo) return failedResponse('photo not found');
  
  
    return successResponse('photo get successfully', { files:photo });
  });
  
