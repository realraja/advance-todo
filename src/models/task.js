const { Schema, default: mongoose, Types } = require("mongoose");

const schema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    imgUrl: String,
    type: {
      type: String,
      enum: ["task", "work"],
      required: true,
      default: "task",
    },
    title: { type: String, required: true },
    doTaskOn:{type: Date},
    whenDoWork: {
      type: String,
      enum: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "anytime",
      ],
      default: "anytime",
    },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.models.Task || mongoose.model("Task", schema);

export default Task;
