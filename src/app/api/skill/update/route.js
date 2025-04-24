import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Skill from "@/models/skill";

export const PUT = userTryCatch(async (req) => {
  const { name, image, targetLevel,id,currentLevel } = await req.json();
  if (!name || !image || !targetLevel || !id)
    return failedResponse("Please provide all cridentials");


  const skill = await Skill.findOne({
    user: req.user._id,
    _id:id
  });

  if (!skill) return failedResponse('skill not found');


  let imgUrl = skill.imgUrl;
  if(imgUrl !== image){
    if (image) {
      const uploadImage = await uploadResponse([image]);
      imgUrl = uploadImage[0];
    }
  }

  skill.currentLevel = currentLevel;
  skill.imgUrl = imgUrl;
  skill.name = name;
  skill.targetLevel = targetLevel;
  await skill.save();


  return successResponse("skill added successfully", { skill });
});
