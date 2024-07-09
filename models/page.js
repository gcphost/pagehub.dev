import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    data: Object,
    formName: String,
  },
  { timestamps: true }
);

export const PageSchema = new mongoose.Schema(
  {
    _id: { type: String, unique: true },
    draftId: { type: String, unique: true },
    name: String,
    domain: String,
    content: String,
    editable: Boolean,
    draft: String,
    title: String,
    description: String,
    company: String,
    companyType: String,
    companyLocation: String,
    users: [
      {
        type: String,
        ref: "User",
      },
    ],
    submissions: [SubmissionSchema],
    media: [
      {
        _id: String,
        content: String,
      },
    ],
  },
  { timestamps: true }
);

// PageSchema.index({ name: "ids", "Page._id": "text" });

const Page = mongoose.models.Page || mongoose.model("Page", PageSchema);

module.exports = mongoose.models.Page || mongoose.model("Page", PageSchema);

export default Page;
