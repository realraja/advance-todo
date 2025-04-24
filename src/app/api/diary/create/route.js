import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Diary from "@/models/diary";

export const POST = userTryCatch(async (req) => {
  const { title, images, forDate, content,type } = await req.json();
  // console.log(title,forDate,content,type)
  if (!title || !forDate || !content || !type)
    return failedResponse("Please provide all cridentials");

  let imgUrl;
  if (images) {
    const uploadImages = await uploadResponse(images);
    imgUrl = uploadImages;
  }
  const diary = await Diary.create({
    user: req.user._id,
    type,
    title,
    imgUrl,
    content,
    forDate: new Date(forDate),
  });

  
  return successResponse("diary added successfully", { diary });
});
