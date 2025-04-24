import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Movie from "@/models/movies";

export const PUT = userTryCatch(async (req) => {
  const { rating, id } = await req.json();
  if (!rating || !id)
    return failedResponse("Please provide all cridentials");

  const movie = await Movie.findOne({
    user: req.user._id,
    _id: id,
  });

  if (!movie) return failedResponse("movie not found");

  movie.rating = rating;
  await movie.save();

  return successResponse("movie added successfully", { movie });
});
