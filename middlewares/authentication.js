const jwt = require("jsonwebtoken")
const customAPIError = require("../errors/custom-error")

const authMiddleware = async (req,res,next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer")){
        throw new customAPIError("Authentication Invalid",401)
    }
    const token = authHeader.split(' ')[1]
    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        req.user = {userId:payload.userId,name:payload.name}
        next()
    } catch(err){
        throw new customAPIError("Authentication Invalid",401)
    }
}

module.exports = authMiddleware