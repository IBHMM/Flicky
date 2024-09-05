import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Antu_im-invisible-user.svg/512px-Antu_im-invisible-user.svg.png?20160706105740",
    },
    surname: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "superuser", "admin"],
      default: "user",
    },
    blockDuration: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin : {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: String,
      default: null,
    },
    watchList: {
      type: Array,
      default: [],
    },
    Comments: {
      type: Array,
      default: [],
    },
    LikedMovies: {
      type: Array,
      default: [],
    },
    LikedComments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

userSchema.methods.isPasswordCorrect = async function (password) {
  if (this.password === password) {
    return true;
  } else {
    return false;
  }
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30m",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "15d",
    }
  );
};

userSchema.methods.isBlockedUser = function () {
  return this.isBlocked;
};

userSchema.methods.addToWatchList = function (movieId) {
  if (!this.watchList.includes(movieId)) {
    this.watchList.push(movieId);
  }
  return this.save();
};

userSchema.methods.removeFromWatchList = function (movieId) {
  this.watchList = this.watchList.filter((id) => id !== movieId);
  return this.save();
};

userSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

userSchema.methods.verifyUser = function () {
  this.isVerified = true;
  return this.save();
};

export const User = mongoose.model("User", userSchema);