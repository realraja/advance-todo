import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import User from "@/models/user";

export const GET = userTryCatch(async (req) => {
  const user = await User.findById(req.user._id)
    .select("+bathed")
    .select("+running")
    .select("+didThat")
    .select("+brushed");


  const today = new Date();
  const formattedToday = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;


  const isTodayBrushed = user.brushed.some((date) => {
    const d = new Date(date);
    const formatted = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    return formatted === formattedToday;
  });
  const isTodayBathed = user.bathed.some((date) => {
    const d = new Date(date);
    const formatted = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    return formatted === formattedToday;
  });
  const isTodayRunning = user.running.some((date) => {
    const d = new Date(date);
    const formatted = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    return formatted === formattedToday;
  });
  const isTodayDidThat = user.didThat.some((date) => {
    const d = new Date(date);
    const formatted = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    return formatted === formattedToday;
  });

//   console.log(isTodayIncluded);
  return successResponse("user fetch successfully", { isTodayBrushed ,isTodayBathed,isTodayDidThat,isTodayRunning});
});
