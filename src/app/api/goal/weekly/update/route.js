import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";

export const PUT = userTryCatch(async (req) => {
  const { id, title, description,image,doBefore } = await req.json();
  if (!id || !doBefore) return failedResponse('Please provide id or doBefore');
  if (!title) return failedResponse('Please provide title');
  if (!description) return failedResponse('Please provide description');

  const weekly = await Goal.findOne(
    { _id: id, user: req.user._id, type: 'weekly' }
  );

  if (!weekly) return failedResponse('weekly not found');

    let imgUrl = weekly?.imgUrl;
    if (image !== imgUrl && image) {
      const uploadImage = await uploadResponse([image]);
      imgUrl = uploadImage[0];
    }

  weekly.title = title;
  weekly.description = description;
  weekly.imgUrl = imgUrl;
  weekly.doBefore= new Date(doBefore)
  await weekly.save();

  return successResponse('weekly updated successfully', { weekly });
});