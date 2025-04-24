import { uploadResponse } from "@/lib/cloudinary";
import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Movie from "@/models/movies";

export const PUT = userTryCatch(async (req) => {
  const { name, image, type,rating,id } = await req.json();
  if (!name || !image || !type || !id)
    return failedResponse("Please provide all cridentials");


  const movie = await Movie.findOne({
    user: req.user._id,
    _id:id
  });

  if (!movie) return failedResponse('movie not found');


  let imgUrl = movie.imgUrl;
  if(imgUrl !== image){
    if (image) {
      const uploadImage = await uploadResponse([image]);
      imgUrl = uploadImage[0];
    }
  }

  movie.rating = rating;
  movie.imgUrl = imgUrl;
  movie.name = name;
  movie.type = type;
  await movie.save();


  return successResponse("movie added successfully", { movie });
});
