import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";

export const POST = userTryCatch(async (req) => {
  const { title, image, doBefore, description,type } = await req.json();
  // console.log(title,image,doBefore,description,type)
  if (!title || !doBefore || !description || !type)
    return failedResponse("Please provide all cridentials");

  let imgUrl;
  if (image) {
    const uploadImage = await uploadResponse([image]);
    imgUrl = uploadImage[0];
  }
  const goal = await Goal.create({
    user: req.user._id,
    imgUrl,
    type,
    title,
    description,
    doBefore: new Date(doBefore),
  });
  return successResponse("goal added successfully", { goal });
});
