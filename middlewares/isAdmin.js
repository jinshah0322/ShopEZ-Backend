const customAPIError = require("../errors/custom-error")
const User = require("../models/userModel")

const isAdmin = async (req,res,next)=>{
    const id = req.user.userId
    const user = await User.findById(id)
    if(!user.isAdmin){
        throw new customAPIError("You are not authorized user",401)
    }
    next()
}

module.exports = isAdmin