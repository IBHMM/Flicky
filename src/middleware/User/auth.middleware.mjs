import jwt from "jsonwebtoken";
import { User } from "../../model/User/index.mjs";

export const verifyJWT = async (req, res, next) => {
  try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (token == undefined || token == null) {
        return res.status(401).json({ message: "Token not found" });
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user;
      next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
