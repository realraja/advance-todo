import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Task from "@/models/task";

export const PUT = userTryCatch(async (req) => {
  const { id, completed } = await req.json();
  if (!id) return failedResponse('Please provide id');
  if (typeof completed === 'undefined') return failedResponse('Please provide completed');

  const work = await Task.findOne(
    { _id: id, user: req.user._id, type: 'work' }
  );
  // { completed, completedAt: completed ? new Date() : null }, // update object
  if (!work) return failedResponse('work not found');

  console.log(completed,new Date());
  work.completed = completed;
  work.completedAt = completed? new Date() :null
  await work.save()


  return successResponse('work updated successfully', { work });
});