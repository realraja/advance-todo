import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Skill from "@/models/skill";

export const GET = userTryCatch(async (req) => {
  const skill = await Skill.find({
    user:req.user._id
  })
    .sort({ createdAt: -1 })
  return successResponse("skill fetch successfully", { skill });
});
