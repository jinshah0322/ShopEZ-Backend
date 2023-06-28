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
        type:mongoose.Types.ObjectId,
        ref:"Address"
    }],
    wishlist:[{
        type:mongoose.Types.ObjectId,
        ref:"Product",
    }], 
    isBlocked:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

userSchema.pre("save",async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password)
}

userSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id,name:this.firstName},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

//Export the model
module.exports = mongoose.model('User', userSchema);