import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Movie from "@/models/movies";

export const POST = userTryCatch(async (req) => {
  const { name, image, type,watchedAt,comment,watched,rating } = await req.json();
  if (!name || !image || !type)
    return failedResponse("Please provide all cridentials");

  let imgUrl;
  if (image) {
    const uploadImage = await uploadResponse([image]);
    imgUrl = uploadImage[0];
  }
  const movie = await Movie.create({
    user: req.user._id,
    imgUrl,
    name,
    type,
    rating
  });

  if(watchedAt){
    movie.watched = watched;
    movie.watchedDates.push({
      name:comment,
      date: new Date(watchedAt)
    })
    await movie.save()
  }
  return successResponse("movie added successfully", { movie });
});
