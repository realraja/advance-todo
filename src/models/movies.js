const { Schema, default: mongoose, Types } = require("mongoose");

const schema = new Schema(
  {
    imgUrl: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["series", "movie"],
      default: "series",
    },
    users: [
      {
        id: { type: Types.ObjectId, ref: "User", required: true },
        imgUrl: { type: String, required: true },
        watched: {
          type: String,
          required: true,
          enum: ["Started", "Half", "Full"],
          default: "Full",
        },
        watchedAt: [Date],
        rating: { type: Number },
        isDeleted: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.models.Movie || mongoose.model("Movie", schema);

export default Movie;
