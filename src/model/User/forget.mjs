import { Schema } from "mongoose";
import * as mongoose from 'mongoose';


const ForgetPassword = new Schema({
    code: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,   
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
});

ForgetPassword.pre("save", async function (next) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.code = code;
    next();
});

export default mongoose.model("ForgetPassword", ForgetPassword);