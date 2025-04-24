import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Skill from "@/models/skill";



export const DELETE = userTryCatch(async (req, context) => {
    const params = await context.params;
    const id = params.id; // "app" or "web"
    // const { id } = params;
    if (!id) return failedResponse('Please provide valid id');
  
    const skill = await Skill.findOne({
      _id: id,
      user: req.user._id
    });
  
    if (!skill) return failedResponse('skill not found');
  
    skill.isDeleted = !skill.isDeleted;
    await skill.save();
  
    return successResponse('skill deleted toggle successfully', { skill });
  });
  
