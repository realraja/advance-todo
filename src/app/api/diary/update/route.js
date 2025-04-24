import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Diary from "@/models/diary";

export const PUT = userTryCatch(async (req) => {
  const { id, title, content,images,forDate,type } = await req.json();
  if (!id || !forDate || !type) return failedResponse('Please provide id or forDate');
  if (!title) return failedResponse('Please provide title');
  if (!content) return failedResponse('Please provide content');

  const diary = await Diary.findOne(
    { _id: id, user: req.user._id }
  );

  if (!diary) return failedResponse('diary not found');

    let imgUrl;
    if (images) {
      const uploadImages = await uploadResponse(images);
      imgUrl = uploadImages;
    }

  diary.title = title;
  diary.type = type;
  diary.content = content;
  diary.imgUrl = [...diary.imgUrl,...imgUrl];
  diary.forDate= new Date(forDate)
  await diary.save();

  return successResponse('diary updated successfully', { diary });
});