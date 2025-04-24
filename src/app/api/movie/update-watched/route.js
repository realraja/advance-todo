import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Movie from "@/models/movies";

export const PUT = userTryCatch(async (req) => {
  const { watched, watchedAt, id } = await req.json();
  if ( !watched || !watchedAt || !id)
    return failedResponse("Please provide all cridentials");

  const movie = await Movie.findOne({ 
    user: req.user._id,
    _id: id,
  });

  if (!movie) return failedResponse("movie not found");

  movie.watched = watched;
  movie.watchedDates.push({
    name: watched,
    date: new Date(watchedAt),
  });
  await movie.save();

  return successResponse("movie added successfully", { movie });
});
