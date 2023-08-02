const mongoose = require('mongoose'); // Erase if already required

var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default:0
    },
    isLiked:{
        type:Boolean,
        default:false
    },
    isDisLiked:{
        type:Boolean,
        default:false
    },
    likes:[
        {
            type:mongoose.Types.ObjectId,
            ref:"user"
        }
    ],
    disLikes:[
        {
            type:mongoose.Types.ObjectId,
            ref:"user"
        }
    ],
    image:{
        type:String,
        default:"https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    author:{
        type:String,
        default:"Admin"
    }
},{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    },
    timestamps:true
})

module.exports = mongoose.model('Blog', blogSchema);