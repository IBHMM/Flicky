import mongoose, { Schema } from "mongoose";

const actorSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    birthDate: {
      type: Date,
    },
    nationality: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    movies: {
        type: [Number]
    },
    awards: [
      {
        title: { type: String, trim: true },
        year: { type: Number },
      }
    ],
    socialMedia: {
      twitter: { type: String, trim: true },
      instagram: { type: String, trim: true },
      facebook: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

export const Actor = mongoose.model("Actor", actorSchema);
