import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Task from "@/models/task";

export const PUT = userTryCatch(async (req) => {
  const { id, completed } = await req.json();
  if (!id) return failedResponse('Please provide id');
  if (typeof completed === 'undefined') return failedResponse('Please provide completed');

  const task = await Task.findOneAndUpdate(
    { _id: id, user: req.user._id, type: 'task' },
    { completed, completedAt: completed ? new Date() : null },
    { new: true }
  );

  if (!task) return failedResponse('task not found');

  return successResponse('task updated successfully', { task });
});