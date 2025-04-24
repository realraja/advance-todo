import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";

export const POST = userTryCatch(async (req) => {
  const { title, image, doBefore, description } = await req.json();
  if (!title || !doBefore || description)
    return failedResponse("Please provide all cridentials");

  let imgUrl;
  if (image) {
    const uploadImage = await uploadResponse([image]);
    imgUrl = uploadImage[0];
  }
  const weekly = await Goal.create({
    user: req.user._id,
    imgUrl,
    type: "weekly",
    title,
    description,
    doBefore: new Date(doBefore),
  });
  return successResponse("weekly added successfully", { weekly });
});
