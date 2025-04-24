const { Schema, default: mongoose, Types } = require("mongoose");

const schema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    url: String,
    name: {required: true, type: String},
    username: String,
    password:{ type: String, required: true ,select: false},
    isSecure: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Password = mongoose.models.Password || mongoose.model("Password", schema);

export default Password;
