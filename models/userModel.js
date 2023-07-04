const mongoose = require('mongoose'); 
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    cart:{
        type:Array,
        default:[],
    },
    address:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Address"
    }],
    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    }], 
    refreshToken:{
        type:String,
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    passwordChangedAt:{
        type:Date
    },
    passwordResetToken:{
        type:String
    },
    passwordResetExpires:{
        type:Date
    }
},{timestamps:true});

userSchema.pre("save",async function(){
    if(!this.isModified(password)){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password)
}

userSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id,name:this.firstName},process.env.JWT_SECRET,{expiresIn:"1d"})
}

userSchema.methods.refreshJWT = function(){
    return jwt.sign({userId:this._id,name:this.firstName},process.env.JWT_SECRET,{expiresIn:"3d"})
}

userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(3).toString("hex")
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.passwordResetExpires = Date.now()+10*60*1000
    return resetToken
}

//Export the model
module.exports = mongoose.model('User', userSchema);