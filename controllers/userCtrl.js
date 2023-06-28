require("express-async-errors")
const User = require("../models/userModel")
const customAPIError = require("../errors/custom-error")

const createUser = async (req,res)=>{
    const user = await User.create(req.body)
    res.status(200).send({user,success:true})
}

const loginUser = async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        throw new customAPIError("Please provide email and password",400)
    }
    const user = await User.findOne({email:email}).select("-isAdmin")
    if(!user){
        throw new customAPIError("User does not exist",404)
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new customAPIError("Incorrect Password",401)
    }
    const token = user.createJWT()
    res.status(200).send({user,token,success:true})
}

const getAllUser = async (req,res)=>{
    const users = await User.find().select("-isAdmin")
    res.send({count:users.length,users,success:true})
}

const getUser = async (req,res)=>{
    const user = await User.findById(req.params.id).select("-isAdmin")
    if(!user){
        throw new customAPIError("User not found",404)
    }
    res.status(200).send({user,success:true})
}

const UpdateUser = async (req,res)=>{
    const {firstName,lastName,email,mobile} = req.body
    const user = await User.findByIdAndUpdate(req.params.id,{firstName,lastName,email,mobile},{new:true,runValidators:true}).select("-isAdmin")
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
    const user = await User.findByIdAndUpdate(req.params.id,{isBlocked:true},{new:true,runValidators:true}).select("-isAdmin")
    if(!user){
        throw new customAPIError("User not found",404)
    }
    res.status(200).send({msg:`User with id: ${req.params.id} blocked successfully`,success:true})
}

const unblockUser = async (req,res)=>{
    const user = await User.findByIdAndUpdate(req.params.id,{isBlocked:false},{new:true,runValidators:true}).select("-isAdmin")
    if(!user){
        throw new customAPIError("User not found",404)
    }
    res.status(200).send({msg:`User with id: ${req.params.id} unblocked successfully`,success:true})
}

module.exports = {
    createUser,
    loginUser,
    getAllUser,
    getUser,
    UpdateUser,
    deleteUser,
    blockUser,
    unblockUser
}