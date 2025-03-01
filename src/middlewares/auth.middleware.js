import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// middleware for verify jwt
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("Token",token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // ✅ Ensure token is a valid JWT format before verifying
    if (typeof token !== "string" || token.split(".").length !== 3) {
      throw new ApiError(400, "Malformed JWT token");
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      throw new ApiError(401, "Invalid or expired token");
    }

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    // throw new ApiError(401,error?.message || "invalid access token")
    next(new ApiError(401, error?.message || "Invalid access token"));
  }
});
