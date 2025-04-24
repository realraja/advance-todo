import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Skill from "@/models/skill";

export const POST = userTryCatch(async (req) => {
  const { name, image, targetLevel,currentLevel} = await req.json();
  console.log(currentLevel);
  if (!name || !image || !targetLevel)
    return failedResponse("Please provide all cridentials");

  let imgUrl;
  if (image) {
    const uploadImage = await uploadResponse([image]);
    imgUrl = uploadImage[0];
  }
  const skill = await Skill.create({
    user: req.user._id,
    imgUrl,
    name,
    targetLevel,
    currentLevel
  });


  return successResponse("skill added successfully", { skill });
});
