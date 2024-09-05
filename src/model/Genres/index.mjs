import mongoose, { Schema } from "mongoose";

const genreSchema = new Schema(
  {
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    }
  },
  { timestamps: true }
);

export const Genre = mongoose.model("Genre", genreSchema);
