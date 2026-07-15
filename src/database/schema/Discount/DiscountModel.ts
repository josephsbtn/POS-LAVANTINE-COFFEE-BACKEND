import mongoose from "mongoose";

const DiscountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    minTransaction: {
      type: Number,
      required: true,
      min: 0,
    },
    limitUsage: {
      type: Number,
      required: true,
      min: 1,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const DicsountModel = mongoose.model("discount", DiscountSchema);
export default DicsountModel;
