import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Task from "@/models/task";

export const PUT = userTryCatch(async (req) => {
  const { id, title, whenDoWork,image } = await req.json();
  if (!id) return failedResponse('Please provide id');
  if (!title) return failedResponse('Please provide title');
  if (!whenDoWork) return failedResponse('Please provide whenDoWork');

  const work = await Task.findOne(
    { _id: id, user: req.user._id, type: 'work' }
  );

  if (!work) return failedResponse('work not found');

    let imgUrl = work?.imgUrl;
    if (image !== imgUrl && image) {
      const uploadImage = await uploadResponse([image]);
      imgUrl = uploadImage[0];
    }

  work.title = title;
  work.whenDoWork = whenDoWork;
  work.imgUrl = imgUrl;
  await work.save();

  return successResponse('work updated successfully', { work });
});