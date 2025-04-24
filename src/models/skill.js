const { Schema, default: mongoose, Types } = require("mongoose");

const schema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    imgUrl: { type: String, required: true },
    name: { type: String, required: true },        
    targetLevel: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Beginner",
    },
    currentLevel: {
      type: String,
      required: true,
      enum: [
        "notStarted",
        "inProgress",
        "Started",
        "Beginner",
        "Improver",
        "Intermediate",
        "Advanced",
        "Expert",
      ],
      default: "notStarted",
    },
    daysOfDid: [{name:String,date:{type:Date,default:Date.now}}],
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.models.Skill || mongoose.model("Skill", schema);

export default Skill;
