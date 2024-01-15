const { asyncHandler } = require("../utils/asyncHandler");
const { User } = require("../models/user.model");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/apiResponse.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");

const registerUser = asyncHandler(async (req, res) => {
  // Get user details from frontend
  // validation - not empty
  // check if user already exists - username and email
  // check for images, check for avater
  // upload them to cloudinary
  // create user object - create entry in db
  // remove password refresh token field from response
  // check for user creation
  // return res

  const { fullname, email, username, password } = req.body;
  console.log(`${email}`);

  if (
    [fullname, email, username, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are Required");
  }

  const existedUser = User.findOne({
    $or: [{ username, email }],
  });
  if (!existedUser) {
    throw new ApiError(409, "username or email already exists.");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required.");
  }

  const user = User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

module.exports = {
  registerUser,
};
