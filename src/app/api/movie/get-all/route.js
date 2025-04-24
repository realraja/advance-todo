import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Movie from "@/models/movies";

export const GET = userTryCatch(async (req) => {
  const movie = await Movie.find({
    user:req.user._id
  })
    .sort({ createdAt: -1 })
  return successResponse("movie fetch successfully", { movie });
});
