import ApiError from "../utility/apiError.js";
import asyncHandler from "../utility/asyncHandler.js";
import User from "../model/user.model.js";
import ApiResponse from "../utility/apiResponse.js";
import jwt from 'jsonwebtoken'

const generateAccessRefreshToken=async(userId)=>{
    try{
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    }
    catch(err){
        throw new ApiError(500,"something went wrong while generating access and refresh token")
    }
}

const registerUser=asyncHandler(
    async(req,res)=>{
        const {name,password,email}=req.body;
        if(!name?.trim()) throw new ApiError(400,"name is required")
        if(!password?.trim()) throw new ApiError(400,"password is required")
        if(!email?.trim()) throw new ApiError(400,"email is required")
        const user=await User.create({
            name,
            password,
            email
        })
        res.status(200)
            .json(new ApiResponse(200,user,"user successfully created"))
    }
)

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim()) throw new ApiError(400, "Email is required");
  if (!password?.trim()) throw new ApiError(400, "Password is required");

  // find user by email
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  // plain text password comparison
  if (user.password !== password) {
    throw new ApiError(401, "Invalid password");
  }

  // generate tokens
  const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);

  // update refresh token in db
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true, // set false if local testing without https
    sameSite: "None"
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, user, "User successfully logged in"));
});

const logoutUser=asyncHandler(
    async(req,res)=>{
        const user=await User.findOne(req.user._id)
        const options={
            httpOnly:true,
            secure:true,
            sameSite: "None"
        }
        user.refreshToken="";
        await user.save();
        res.status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json(new ApiResponse(200,{},"user successfully loggedout"))
    }
)
const refreshAccessToken=asyncHandler(
    async(req,res)=>{
        const token=req.cookies?.refreshToken || req.body.refreshToken
        if(!token) throw new ApiError(401,"unauthorized access")
        let decodedToken
        try{
            decodedToken=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
        }catch(err){
            throw new ApiError(401,"Invalid or expired refresh Token")
        }
        if(!decodedToken) throw new ApiError(401,"unauthorized access")
        const user=await User.findById(decodedToken._id)
        if(!user) throw new ApiError(401,"unauthorizes access")
        if(token!=user.refreshToken) throw new ApiError(401,"unauthorized access")
        const  {accessToken,refreshToken}=await generateAccessRefreshToken(user._id)
        const newUser=await User.findById(decodedToken._id)
        const options={
            httpOnly:true,
            secure:true,
            sameSite: "None"
        }
        res.status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",refreshToken,options)
            .json(new ApiResponse(200,newUser,"token successfully changed"))
    }
)

export {registerUser,loginUser,logoutUser,refreshAccessToken}