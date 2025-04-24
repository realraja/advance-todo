import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Movie from "@/models/movies";



export const DELETE = userTryCatch(async (req, context) => {
    const params = await context.params;
    const id = params.id; // "app" or "web"
    // const { id } = params;
    if (!id) return failedResponse('Please provide valid id');
  
    const movie = await Movie.findOne({
      _id: id,
      user: req.user._id,
    });
  
    if (!movie) return failedResponse('movie not found');
  
    movie.isDeleted = !movie.isDeleted;
    await movie.save();
  
    return successResponse('movie deleted toggle successfully', { movie });
  });
  
