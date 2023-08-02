require("express-async-errors")
const User = require("../models/userModel")
const customAPIError = require("../errors/custom-error")
const mongoose = require("mongoose")
const sendEmail = require("./emailCtrl")
const crypto = require("crypto")

const createUser = async (req,res)=>{
    const user = await User.create(req.body)
    res.status(200).send({user,success:true})
}

const loginUser = async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        throw new customAPIError("Please provide email and password",400)
    }
    const user = await User.findOne({email:email})
    if(!user){
        throw new customAPIError("User does not exist",404)
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new customAPIError("Incorrect Password",401)
    }
    const refreshToken = user.refreshJWT()
    await User.findByIdAndUpdate(user._id,{refreshToken:refreshToken},{new:true,runValidators:true})
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        maxAge: 72*60*60*1000
    })
    const token = user.createJWT()
    res.status(200).send({user,token,success:true})
}

const getAllUser = async (req,res)=>{
    const users = await User.find()
    res.send({count:users.length,users,success:true})
}

const getUser = async (req,res)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        throw new customAPIError("User not found",404)
    }
    res.status(200).send({user,success:true})
}

const UpdateUser = async (req,res)=>{
    const {firstName,lastName,email,mobile} = req.body
    const user = await User.findByIdAndUpdate(req.params.id,{firstName,lastName,email,mobile},{new:true,runValidators:true})
    if(!user){
        throw new customAPIError("User not found",404)
    }
    res.status(200).send({user,success:true})
}

const deleteUser = async (req,res)=>{
    const user = await User.findByIdAndDelete(req.params.id)
    if(!user){
        throw new customAPIError("User not found",404)
    }
    res.status(200).send({msg:"User deleted successfully",success:true})
}

const blockUser = async (req,res)=>{
    const user = await User.findByIdAndUpdate(req.params.id,{isBlocked:true},{new:true,runValidators:true})
    if(!user){
        throw new customAPIError("User not found",404)
    }
    res.status(200).send({msg:`User with id: ${req.params.id} blocked successfully`,success:true})
}

const unblockUser = async (req,res)=>{
    const user = await User.findByIdAndUpdate(req.params.id,{isBlocked:false},{new:true,runValidators:true})
    if(!user){
        throw new customAPIError("User not found",404)
    }
    res.status(200).send({msg:`User with id: ${req.params.id} unblocked successfully`,success:true})
}

const refreshToken = async (req,res)=>{
    const cookie = req.cookies
    const refreshToken = cookie.refreshToken
    if(!refreshToken){
        throw new customAPIError("Token not found",401)
    }
    const user = await User.findOne({refreshToken})
    if(!user){
        throw new customAPIError("User not found",404)
    }
    const updateToken = user.createJWT()
    const updateRefreshToken = user.refreshJWT()
    res.cookie("refreshToken",updateRefreshToken,{  
        httpOnly:true,
        maxAge:24*60*60*1000
    })
    await User.findOneAndUpdate({refreshToken},{refreshToken:updateRefreshToken},{new:true,runValidators:true})
    res.status(200).send({token:updateToken,refreshToken:updateRefreshToken,success:true})
}

const updatePassword = async(req,res)=>{
    const {oldPassword,newPassword} = req.body
    const userId = new mongoose.Types.ObjectId(req.user.userId)
    const user = await User.findById(userId)
    if(await user.comparePassword(oldPassword)){
        user.password = newPassword
        const updatePassword = await user.save()
        res.status(200).send({user:user,msg:"Password Updated successfully",success:true})
    } else{
        throw new customAPIError("Please enter correct password",401)
    }
}

const forgotPasswordToken = async(req,res)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        throw new customAPIError("User not found",404)
    }
    const token = await user.createPasswordResetToken()
    await user.save()
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/resetPassword/${token}'>Click Here</>`;
    const data = {
        to: req.body.email,
        text: "Hey User",
        subject: "Forgot Password Link",
        html: resetURL,
    };
    sendEmail(data)
    res.status(200).send({user,success:true})
}

const resetPassword = async (req,res)=>{
    const {password} = req.body
    const {token} = req.params
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })
    if(!user){
        throw new customAPIError("User not found",404)
    }
    user.password = password
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).send({user,success:true})
}

const logout = async (req,res)=>{
    console.log("here");
    const refreshToken = req.cookies.refreshToken
    console.log(refreshToken);
    const user = await User.findOne({refreshToken})
    if(!user){
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true
        })
        throw new customAPIError("Token is expired",401)
    }
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true
    })
    await User.findOneAndUpdate({refreshToken},{refreshToken:""})
    res.status(204).send()
}

module.exports = {
    createUser,
    loginUser,
    getAllUser,
    getUser,
    UpdateUser,
    deleteUser,
    blockUser,
    unblockUser,
    refreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword
}