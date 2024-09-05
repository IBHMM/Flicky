import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";
import { User } from "../../../model/User/index.mjs";
import  ForgetPassword  from "../../../model/User/forget.mjs";
import {MakeHtml, sendMail} from '../../../services/Mail.mjs'
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


export const registerUser = async (req, res) => {
  const { email, password, username, surname, name, age } = req.body;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ 
      email, 
      password, 
      id: uuidv4(),
      surname, 
      name,
      age,
      username
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user || !(user.isPasswordCorrect(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: "Strict",
      maxAge: 15 * 60 * 60 * 1000
    });
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Strict",
      maxAge: 45 * 60 * 60 * 1000
    });

    res.status(200).json({ message: "Login successful", accessToken, refreshToken, id: user._id});
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const user = req.user;

    user.refreshToken = null;
    await user.save();

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshAccessToken = async (req, res) => {
  const refreshToken =
        req.cookies?.refreshToken ||
        req.header("Authorization")?.replace("Bearer ", "");

  try {
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = user.generateAccessToken();
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Strict",
      maxAge: 15 * 60 * 60 * 1000 
    });

    res.status(200).json({ message: "Access token refreshed", newAccessToken });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const SendCode = async (req, res) => {
  const { email } = req.body;
  try {

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const forget = new ForgetPassword({ email });
    await forget.save();

    const info = await sendMail(
      email, 
      "Password Reset Request", 
      `Hello, \n\nPlease use the following code to reset your password: ${forget.code}`, 
      `${MakeHtml(forget.code)}`
    );

    if (info.accepted.lenght === 0 || info.rejected.lenght > 0) {
      await ForgetPassword.deleteOne({ email });
      throw new Error("Failed to send email");
    }

    res.status(200).json({ message: "Code sent", email: email });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const VerifyCode = async (req, res) => {
  const { email, code} = req.body;
  try {
    const forget = await ForgetPassword.findOne({ email, code });
    if (!forget) return res.status(404).json({ message: "Invalid code" });

    if (forget.code !== code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    if (forget.code == code) forget.isVerified = true;
    await forget.save();
    return res.status(200).json({ message: "Code verified" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const ResetPassword = async (req, res) => {
  const {email, password} = req.body;

  try {

    const forget = await ForgetPassword.findOne({email: email});
    if (!forget) throw new Error("Code not found");

    const user = await User.findOne({email});
    if (!user) throw new Error("User not found");

    if (forget.isVerified === false) return res.status(400).json({ message: "Code not verified" });

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character",
      });
    }
    user.password = password;
    await user.save();
    await ForgetPassword.deleteOne({email});

    return res.status(200).json({ message: "Password reset successful" });
  }catch(err) {
    return res.status(500).json({ message: "Server error", err });
  }
};