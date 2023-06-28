const mongoose = require("mongoose")

const dbConnect = async (url)=>{
    await mongoose.connect(url)
}

module.exports = dbConnect