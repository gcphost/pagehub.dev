import mongoose from "mongoose";

const VerificationRequestSchema = new mongoose.Schema(
  {
    identifier: { type: String, unique: true },
    token: { type: String, unique: true },
    expires: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const VerificationRequest =
  mongoose.models.VerificationRequest ||
  mongoose.model("VerificationRequest", VerificationRequestSchema);

export default VerificationRequest;
