import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Diary from "@/models/diary";

export const PUT = userTryCatch(async (req) => {
  const { id, title, content,image,forDate } = await req.json();
  if (!id || !forDate) return failedResponse('Please provide id or forDate');
  if (!title) return failedResponse('Please provide title');
  if (!content) return failedResponse('Please provide content');

  const filling = await Diary.findOne(
    { _id: id, user: req.user._id, type: 'filling' }
  );

  if (!filling) return failedResponse('filling not found');

    let imgUrl = filling?.imgUrl;
    if (image !== imgUrl && image) {
      const uploadImage = await uploadResponse([image]);
      imgUrl = uploadImage;
    }

  filling.title = title;
  filling.content = content;
  filling.imgUrl = imgUrl;
  filling.forDate= new Date(forDate)
  await filling.save();

  return successResponse('filling updated successfully', { filling });
});