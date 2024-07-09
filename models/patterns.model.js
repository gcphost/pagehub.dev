import mongoose from "mongoose";

const PatternSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  mode: { type: String, required: true },
  colors: { type: Number, required: true },
  maxStroke: { type: Number, required: true },
  maxScale: { type: Number, required: true },
  maxSpacing: [{ type: Number }],
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  vHeight: { type: Number, required: true },
  tags: [{ type: String }],
  path: { type: String, required: true },
  creationDate: { type: Date, required: true },
});

const Pattern =
  mongoose.models.Pattern || mongoose.model("Pattern", PatternSchema);

export default Pattern;
