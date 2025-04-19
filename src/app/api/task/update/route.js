import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Task from "@/models/task";

export const PUT = userTryCatch(async (req) => {
  const { id, title, doTaskOn, image } = await req.json();
  if (!id) return failedResponse("Please provide id");
  if (!title) return failedResponse("Please provide title");
  if (!doTaskOn) return failedResponse("Please provide doTaskOn");

  const date = new Date(doTaskOn); // UTC midnight
  date.setHours(date.getHours() + 23);
  date.setMinutes(date.getMinutes() + 55);
  date.setSeconds(date.getSeconds() + 40);

  if (date < new Date())
    return failedResponse("doTaskOn should be greater than current date");

  const task = await Task.findOne(
    { _id: id, user: req.user._id, type: "task" }
  );
  if (!task) return failedResponse("task not found");

  let imgUrl = task?.imgUrl;
  if (image !== imgUrl && image) {
    const uploadImage = await uploadResponse([image]);
    imgUrl = uploadImage[0];
  }

  task.title = title;
  task.doTaskOn = new Date(doTaskOn);
  task.imgUrl = imgUrl;
  await task.save();

  return successResponse("task updated successfully", { task });
});
