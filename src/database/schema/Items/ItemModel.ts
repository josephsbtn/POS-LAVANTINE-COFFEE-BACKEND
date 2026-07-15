import mongoose from "mongoose";

export const AddonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const ItemSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    modifier: [
      {
        type: mongoose.Types.ObjectId,
        ref: "modifier",
      },
    ],
    addon: [AddonSchema],
  },
  {
    timestamps: true,
  },
);

ItemSchema.index({ name: 1, categoryId: 1 });
ItemSchema.index({ name: 1, createdAt: -1 });

const ItemModel = mongoose.model("item", ItemSchema);
export default ItemModel;
