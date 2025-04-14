const { Schema, default: mongoose, Types } = require("mongoose");

const schema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    imgUrl: String,
    type: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
      default: "weekly",
    },
    title: { type: String, required: true },
    description: { type: String },
    doBefore: { type: Date, default: null },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Goal = mongoose.models.Goal || mongoose.model("Goal", schema);

export default Goal;
