const notFound = (req,res)=>{
    return res.status(404).send({msg:"Route Does Not Exist",success:false})
}

module.exports = notFound