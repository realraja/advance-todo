import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Skill from "@/models/skill";

export const PUT = userTryCatch(async (req) => {
  const { didAt, comment, id } = await req.json();
  if (!comment || !didAt || !id)
    return failedResponse("Please provide all cridentials");

  const skill = await Skill.findOne({
    user: req.user._id,
    _id: id,
  });

  if (!skill) return failedResponse("skill not found");

  skill.daysOfDid.push({
    name: comment,
    date: new Date(didAt),
  });
  await skill.save();

  return successResponse("skill added successfully", { skill });
});
