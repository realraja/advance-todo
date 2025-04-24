import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Diary from "@/models/diary";

export const POST = userTryCatch(async (req) => {
  const { title, image, forDate, content } = await req.json();
  if (!title || !forDate || content)
    return failedResponse("Please provide all cridentials");

  let imgUrl;
  if (image) {
    const uploadImage = await uploadResponse([image]);
    imgUrl = uploadImage;
  }
  const filling = await Diary.create({
    user: req.user._id,
    imgUrl,
    type: "filling",
    title,
    content,
    forDate: new Date(forDate),
  });
  return successResponse("filling added successfully", { filling });
});
