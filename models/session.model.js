import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    expires: Date,
    sessionToken: { type: String },
    accessToken: { type: String },
  },
  { timestamps: true },
);

const Session =
  mongoose.models.Session || mongoose.model("Session", SessionSchema);

export default Session;
