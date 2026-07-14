import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

CategorySchema.index({ name: 1, createdAt: -1 });

const CategoryModel = mongoose.model("category", CategorySchema);
export default CategoryModel;
