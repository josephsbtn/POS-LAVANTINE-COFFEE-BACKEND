import mongoose from "mongoose";

const ModItemSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  options: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  ],
});

const ModModel = mongoose.model("modifier", ModItemSchema);
export default ModModel;
