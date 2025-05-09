const { Schema, default: mongoose, Types } = require("mongoose");

const schema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["diary", "filling"],
      required: true,
      default: "diary",
    },
    imgUrl: [String],
    title: { type: String, required: true },
    content: { type: String, required: true },
    forDate: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Diary = mongoose.models.Diary || mongoose.model("Diary", schema);

export default Diary;
