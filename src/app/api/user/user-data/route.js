import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import User from "@/models/user";

export const GET = userTryCatch(async (req) => {
  const user = await User.findById(req.user._id).select(
    "+bathed +running +didThat +brushed"
  );

  const todayStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  const formatDate = (d) => new Date(d).toISOString().slice(0, 10);

  const isTodayBrushed = user.brushed.some((date) => formatDate(date) === todayStr);
  const isTodayBathed = user.bathed.some((date) => formatDate(date) === todayStr);
  const isTodayRunning = user.running.some((date) => formatDate(date) === todayStr);
  const isTodayDidThat = user.didThat.some((date) => formatDate(date) === todayStr);

  return successResponse("User fetched successfully", {
    isTodayBrushed,
    isTodayBathed,
    isTodayRunning,
    isTodayDidThat,
  });
});
