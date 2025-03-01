import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Optionally store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error.message);
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};


const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - filed should not empty
  // check if user already exists : email , username
  // check for images ,check for avatar
  // upload them to cloudinary
  // create user object --> create entry in db
  // remove password and refresh token fileld from response
  // check for user creation
  // return response

  const { username, email, fullName, password } = req.body;
  // console.log("username :", username);
  // console.log("req.body",req.body)

  // if(username == ""){
  //   throw new ApiError(400,"fullName is required")
  // }

  if (
    [fullName, email, password, username].some((filed) => filed?.trim() === "")
  ) {
    throw new ApiError(400, "All fileds are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  // console.log("existedUser",existedUser)

  if (existedUser) {
    throw new ApiError(409, "username || email existed");
  }

  // coz of middleware in register router so multer provide req.files for images or files
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // array of object of images
  // console.log("req.files",req.files)

  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage.path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatarLocalPath error");
  }

  // upload on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar not uploaded on cloudinary");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
    email,
    username,
  });

  const createdUser = await User.findById(user._id).select(
    // bydefault select all so we have to write those want to not select
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerd successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req.body --> data
  // username or email
  // find the user
  // password check
  // access and refresh token
  // send cookie

  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "user or email is required");
  }


  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const ispasswordValid = await user.isPasswordCorrect(password);

  if (!ispasswordValid) {
    throw new ApiError(401, "Invaild user credentials");
  }

  const tokens = await generateAccessAndRefreshTokens(user._id);
  if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
    throw new ApiError(500, "Token generation failed");
  }
  
  const { accessToken, refreshToken } = tokens;

  const loggedInUser = await User
    .findById(user._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
        },
        "User loggedIn successfully"
      )
    )
});

const logoutUser = asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(
      req.user._id,
      {
          $unset: {
              refreshToken: 1 // this removes the field from document
          }
      },
      {
          new: true
      }
  )

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req,res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401,"unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken,REFRESH_TOKEN_SECRET)
  
    const user = await User.findById(decodedToken?._id)
  
    if(!user){
      throw new ApiError(401,"Invalid refresh token")
    }
  
    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401,"browsers refershtoken and database stored refresh token doesn't match")
    }
  
    const options = {
      httpOnly : true,
      secure : true
    }
  
    const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
  
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
      new ApiResponse(
        200,
        {accessToken, refreshToken:newRefreshToken},
        "Access token refreshed"
      )
    )
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token")
  }

})

export { registerUser, loginUser, logoutUser, refreshAccessToken };
