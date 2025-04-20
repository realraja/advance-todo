const { Schema, default: mongoose } = require("mongoose");

const BathSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["normal", "hot"],
      default: "normal",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // Prevent creating _id for subdocuments
);

const schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    imgUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dwc3gwskl/image/upload/v1721379013/samples/ecommerce/fiiijyy4cq1nrcp7t4zz.jpg",
      required: true,
    },
    dob: { type: Date, required: true },

    // Track logs (no select: false on array directly)
    brushed: [{ type: Date }],
    running: [{ type: Date }],
    didThat: [{ type: Date }],
    bathed: [BathSchema], // Use a clean schema for subdocuments
    importantEvents:[{name: String, date: Date}],

    // Tokens
    tokenWeb: { type: String },
    tokenApp: { type: String },
    passwordResetToken: { type: String },

    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate model registration in hot reload
const User = mongoose.models.User || mongoose.model("User", schema);
export default User;
