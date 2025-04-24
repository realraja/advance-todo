import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";

export const PUT = userTryCatch(async (req) => {
  const { id, title, description,image,doBefore } = await req.json();
  if (!id || !doBefore) return failedResponse('Please provide id or doBefore');
  if (!title) return failedResponse('Please provide title');
  if (!description) return failedResponse('Please provide description');

  const yearly = await Goal.findOne(
    { _id: id, user: req.user._id, type: 'yearly' }
  );

  if (!yearly) return failedResponse('yearly not found');

    let imgUrl = yearly?.imgUrl;
    if (image !== imgUrl && image) {
      const uploadImage = await uploadResponse([image]);
      imgUrl = uploadImage[0];
    }

  yearly.title = title;
  yearly.description = description;
  yearly.imgUrl = imgUrl;
  yearly.doBefore= new Date(doBefore)
  await yearly.save();

  return successResponse('yearly updated successfully', { yearly });
});