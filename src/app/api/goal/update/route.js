import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Goal from "@/models/goal";

export const PUT = userTryCatch(async (req) => {
  const { id, title, description,image,doBefore,type } = await req.json();
  // console.log(id,type,doBefore)
  if (!id || !doBefore || !type) return failedResponse('Please provide id or doBefore');
  if (!title) return failedResponse('Please provide title');
  if (!description) return failedResponse('Please provide description');

  const goal = await Goal.findOne(
    { _id: id, user: req.user._id,type }
  );

  if (!goal) return failedResponse('goal not found');

    let imgUrl = goal?.imgUrl;
    if (image !== imgUrl && image) {
      const uploadImage = await uploadResponse([image]);
      imgUrl = uploadImage[0];
    }

  goal.title = title;
  goal.description = description;
  goal.imgUrl = imgUrl;
  goal.doBefore= new Date(doBefore)
  await goal.save();

  return successResponse('goal updated successfully', { goal });
});