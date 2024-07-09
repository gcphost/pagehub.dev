import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    image: String,
    emailVerified: { type: Boolean, default: false },
    authentication: [
      {
        providerId: { type: String, required: true },
        providerAccountId: { type: String, required: true },
        refreshToken: String,
        accessToken: String,
        accessTokenExpires: Date,
      },
    ],
    pages: [
      {
        type: String,
        ref: "Page",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = mongoose.models.User || mongoose.model("User", PageSchema);

export default User;
