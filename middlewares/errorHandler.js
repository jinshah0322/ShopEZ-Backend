const customAPIError = require("../errors/custom-error")
const errorHandler = (err,req,res,next)=>{
    if(err instanceof customAPIError){
        return res.status(err.statusCode).send({msg:err.message,success:false})
    }
    if(err.code === 11000){
        return res.status(400).send({msg:err.message,success:false})
    }
    return res.status(500).send({msg:err.message,success:false})
}

module.exports = errorHandler