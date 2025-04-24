import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";

export const PUT = userTryCatch(async (req) => {
  const { id, title, description,image,doBefore } = await req.json();
  if (!id || !doBefore) return failedResponse('Please provide id or doBefore');
  if (!title) return failedResponse('Please provide title');
  if (!description) return failedResponse('Please provide description');

  const monthly = await Goal.findOne(
    { _id: id, user: req.user._id, type: 'monthly' }
  );

  if (!monthly) return failedResponse('monthly not found');

    let imgUrl = monthly?.imgUrl;
    if (image !== imgUrl && image) {
      const uploadImage = await uploadResponse([image]);
      imgUrl = uploadImage[0];
    }

  monthly.title = title;
  monthly.description = description;
  monthly.imgUrl = imgUrl;
  monthly.doBefore= new Date(doBefore)
  await monthly.save();

  return successResponse('monthly updated successfully', { monthly });
});