const { Schema, default: mongoose, Types } = require("mongoose");

const schema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    name: { required: true, type: String },
    photos: {
      type: [
        {
          name: { type: String, required: true },
          imgUrl: { type: String, required: true },
          isSecure: { type: Boolean, default: false },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      select: false,
    },
    isSecure: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Photo = mongoose.models.Photo || mongoose.model("Photo", schema);

export default Photo;
