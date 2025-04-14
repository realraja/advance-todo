const { Schema, default: mongoose, Types } = require("mongoose");

const schema = new Schema(
  {
    imgUrl: { type: String, required: true },
    name: { type: String, required: true },
    users: [
      {
        id: { type: Types.ObjectId, ref: "User", required: true },        
        imgUrl: { type: String, required: true },
        targetLevel: {
          type: String,
          required: true,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
          default: "Beginner",
        },
        crruntLevel: {
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
        levelUpDate: [Date],
        daysOfDid: [Date],
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

const Skill = mongoose.models.Skill || mongoose.model("Skill", schema);

export default Skill;
